import { BIBLE_BOOKS, VERSES_DATABASE } from '../data/havahData';
import { BibleVerse } from '../types';

export interface ChapterData {
  bookId: string;
  bookNameEs: string;
  bookNameEn: string;
  chapter: number;
  totalVerses: number;
  verses: BibleVerse[];
  source: string;
  timestamp: number;
}

export interface SyncProgress {
  percent: number;
  currentBook: string;
  syncedChapters: number;
  totalChapters: number;
  status: 'idle' | 'syncing' | 'completed' | 'error';
}

const DB_NAME = 'HavahBibleStore_v2';
const STORE_NAME = 'bible_chapters';
const TOTAL_BIBLE_CHAPTERS = 1189;

class BibleIndexEngine {
  private memCache = new Map<string, ChapterData>();
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private prefetchQueue = new Set<string>();
  private isPrefetching = false;
  private cancelSync = false;
  private syncProgressListeners = new Set<(progress: SyncProgress) => void>();
  private currentProgress: SyncProgress = {
    percent: 0,
    currentBook: '',
    syncedChapters: 0,
    totalChapters: TOTAL_BIBLE_CHAPTERS,
    status: 'idle',
  };

  constructor() {
    this.initIndexedDB();
    this.seedLocalHighlights();
    this.checkSyncedCount();
  }

  // 1. IndexedDB Initialization
  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result as IDBDatabase;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          }
        };
        req.onsuccess = (e: any) => {
          resolve(e.target.result as IDBDatabase);
        };
        req.onerror = () => {
          console.warn('IndexedDB not accessible, falling back to memory cache.');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init error:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  // 2. Seed memory cache from local high-priority verses (e.g. Mateo 4 full 25 verses)
  private seedLocalHighlights() {
    // Group local database by book and chapter
    const grouped = new Map<string, BibleVerse[]>();
    for (const v of VERSES_DATABASE) {
      const key = `${v.bookId}_${v.chapter}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(v);
    }

    for (const [key, verses] of grouped.entries()) {
      // Only seed chapters with full content (e.g. MAT 4 with 25 verses)
      if (verses.length >= 20) {
        const [bookId, chapterStr] = key.split('_');
        const chapter = parseInt(chapterStr, 10);
        const book = BIBLE_BOOKS.find((b) => b.id === bookId);
        if (book) {
          const data: ChapterData = {
            bookId,
            bookNameEs: book.nameEs,
            bookNameEn: book.nameEn,
            chapter,
            totalVerses: verses.length,
            verses: [...verses].sort((a, b) => a.verseNumber - b.verseNumber),
            source: 'embedded-pristine',
            timestamp: Date.now(),
          };
          this.memCache.set(key, data);
          this.saveToDB(key, data);
        }
      }
    }
  }

  private async getFromDB(key: string): Promise<ChapterData | null> {
    try {
      const db = await this.initIndexedDB();
      if (!db) return null;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.data) {
            resolve(req.result.data as ChapterData);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  private async saveToDB(key: string, data: ChapterData): Promise<void> {
    try {
      const db = await this.initIndexedDB();
      if (!db) return;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key, data });
    } catch {
      // Silent catch for storage limitations
    }
  }

  // 3. Count synced chapters
  public async checkSyncedCount(): Promise<number> {
    try {
      const db = await this.initIndexedDB();
      if (!db) return this.memCache.size;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => {
          const count = req.result || 0;
          this.currentProgress.syncedChapters = count;
          this.currentProgress.percent = Math.min(100, Math.round((count / TOTAL_BIBLE_CHAPTERS) * 100));
          if (count >= TOTAL_BIBLE_CHAPTERS) {
            this.currentProgress.status = 'completed';
          }
          this.broadcastProgress();
          resolve(count);
        };
        req.onerror = () => resolve(this.memCache.size);
      });
    } catch {
      return this.memCache.size;
    }
  }

  // 4. Asynchronous Chapter Fetcher (Tiered: Memory -> IndexedDB -> Server Cloud Fetch)
  public async loadChapter(
    bookId: string,
    chapter: number,
    options: { forceRefresh?: boolean; silent?: boolean } = {}
  ): Promise<ChapterData> {
    const key = `${bookId}_${chapter}`;
    const book = BIBLE_BOOKS.find((b) => b.id === bookId) || BIBLE_BOOKS[0];

    // Tier 1: Check Memory Cache
    if (!options.forceRefresh && this.memCache.has(key)) {
      const mem = this.memCache.get(key)!;
      this.scheduleAdjacentPrefetch(bookId, chapter);
      return mem;
    }

    // Tier 2: Check IndexedDB
    if (!options.forceRefresh) {
      const idbData = await this.getFromDB(key);
      if (idbData && idbData.verses && idbData.verses.length > 0) {
        this.memCache.set(key, idbData);
        this.scheduleAdjacentPrefetch(bookId, chapter);
        return idbData;
      }
    }

    // Tier 3: Fetch Asynchronously from Server (/api/bible/chapter)
    try {
      const response = await fetch('/api/bible/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          chapter,
          bookName: book.nameEs,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.verses && Array.isArray(json.verses) && json.verses.length > 0) {
          const formattedVerses: BibleVerse[] = json.verses.map((v: any) => ({
            bookId,
            bookNameEs: book.nameEs,
            bookNameEn: book.nameEn,
            chapter,
            verseNumber: v.verseNumber,
            textEs: v.textEs || '',
            textEn: v.textEn || '',
          }));

          const chapterData: ChapterData = {
            bookId,
            bookNameEs: book.nameEs,
            bookNameEn: book.nameEn,
            chapter,
            totalVerses: formattedVerses.length,
            verses: formattedVerses,
            source: json.source || 'cloud-verified',
            timestamp: Date.now(),
          };

          this.memCache.set(key, chapterData);
          await this.saveToDB(key, chapterData);

          this.scheduleAdjacentPrefetch(bookId, chapter);
          return chapterData;
        }
      }
    } catch (err: any) {
      console.warn(`Cloud chapter load error for ${bookId} ${chapter}:`, err?.message);
    }

    // Tier 4: Fallback to local highlights if available
    const localVerses = VERSES_DATABASE.filter((v) => v.bookId === bookId && v.chapter === chapter);
    if (localVerses.length > 0) {
      const fallbackData: ChapterData = {
        bookId,
        bookNameEs: book.nameEs,
        bookNameEn: book.nameEn,
        chapter,
        totalVerses: localVerses.length,
        verses: localVerses,
        source: 'local-highlights',
        timestamp: Date.now(),
      };
      this.memCache.set(key, fallbackData);
      return fallbackData;
    }

    // Emergency graceful fallback
    throw new Error(`No se pudo cargar el capítulo ${chapter} de ${book.nameEs}`);
  }

  // 5. Intelligent Adjacent Prefetch (Loads chapter - 1 and chapter + 1 silently)
  private scheduleAdjacentPrefetch(bookId: string, chapter: number) {
    if (typeof window === 'undefined') return;

    const book = BIBLE_BOOKS.find((b) => b.id === bookId);
    if (!book) return;

    // Next chapter
    if (chapter < book.chaptersCount) {
      this.enqueuePrefetch(bookId, chapter + 1);
    }
    // Previous chapter
    if (chapter > 1) {
      this.enqueuePrefetch(bookId, chapter - 1);
    }
  }

  private enqueuePrefetch(bookId: string, chapter: number) {
    const key = `${bookId}_${chapter}`;
    if (this.memCache.has(key) || this.prefetchQueue.has(key)) return;

    this.prefetchQueue.add(key);
    this.runPrefetchLoop();
  }

  private async runPrefetchLoop() {
    if (this.isPrefetching || this.prefetchQueue.size === 0) return;
    this.isPrefetching = true;

    // Use requestIdleCallback if supported
    const idleRunner = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 1500 });
      } else {
        setTimeout(cb, 200);
      }
    };

    idleRunner(async () => {
      try {
        const nextKey = this.prefetchQueue.values().next().value;
        if (nextKey) {
          this.prefetchQueue.delete(nextKey);
          const [bookId, chapterStr] = nextKey.split('_');
          const chapter = parseInt(chapterStr, 10);
          await this.loadChapter(bookId, chapter, { silent: true });
        }
      } catch {
        // Silently continue
      } finally {
        this.isPrefetching = false;
        if (this.prefetchQueue.size > 0) {
          setTimeout(() => this.runPrefetchLoop(), 300);
        }
      }
    });
  }

  // 6. Asynchronous Full Bible Downloader (Background Worker with Live Progress)
  public async syncFullBible(): Promise<void> {
    if (this.currentProgress.status === 'syncing') return;

    this.cancelSync = false;
    this.currentProgress.status = 'syncing';
    this.broadcastProgress();

    let synced = await this.checkSyncedCount();

    for (const book of BIBLE_BOOKS) {
      if (this.cancelSync) break;

      this.currentProgress.currentBook = book.nameEs;
      this.broadcastProgress();

      for (let ch = 1; ch <= book.chaptersCount; ch++) {
        if (this.cancelSync) break;

        const key = `${book.id}_${ch}`;
        const hasIt = this.memCache.has(key) || (await this.getFromDB(key));

        if (!hasIt) {
          try {
            await this.loadChapter(book.id, ch, { silent: true });
            synced++;
            this.currentProgress.syncedChapters = synced;
            this.currentProgress.percent = Math.min(100, Math.round((synced / TOTAL_BIBLE_CHAPTERS) * 100));
            this.broadcastProgress();
            // Tiny pause to keep UI at 60fps
            await new Promise((r) => setTimeout(r, 60));
          } catch {
            // Continue with other chapters
          }
        }
      }
    }

    if (!this.cancelSync) {
      this.currentProgress.status = 'completed';
      this.currentProgress.percent = 100;
      this.currentProgress.syncedChapters = TOTAL_BIBLE_CHAPTERS;
      try {
        localStorage.setItem('havah_bible_full_indexed_v2', 'true');
      } catch {}
    } else {
      this.currentProgress.status = 'idle';
    }

    this.broadcastProgress();
  }

  public stopSync(): void {
    this.cancelSync = true;
    this.currentProgress.status = 'idle';
    this.broadcastProgress();
  }

  public getProgress(): SyncProgress {
    return { ...this.currentProgress };
  }

  public onProgress(listener: (p: SyncProgress) => void): () => void {
    this.syncProgressListeners.add(listener);
    listener(this.getProgress());
    return () => this.syncProgressListeners.delete(listener);
  }

  private broadcastProgress() {
    for (const l of this.syncProgressListeners) {
      l(this.getProgress());
    }
  }
}

export const bibleIndexEngine = new BibleIndexEngine();
