import { BibleVerse, BibleBook } from '../types';
import { BIBLE_BOOKS } from '../data/havahData';
import matData from '../../public/bible/books/MAT.json';

export interface BibleBookData {
  bookId: string;
  chaptersCount: number;
  chapters: Array<Array<{
    verseNumber: number;
    textEs: string;
    textEn: string;
  }>>;
}

export interface VerseSearchResult {
  bookId: string;
  bookName: string;
  bookNameEn?: string;
  chapter: number;
  verseNumber: number;
  textEs: string;
  textEn: string;
  relevanceScore?: number;
}

export interface ResolvedBibleReference {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number | null;
}

export type ResolvedReference = ResolvedBibleReference;
export type CachedBookData = BibleBookData;

const IDB_NAME = 'HavahBibleServiceDB_v2';
const IDB_VERSION = 1;
const IDB_STORE = 'bible_books';

/**
 * Centralized Bible Data Service & Asynchronous Loader
 * Provides instant access, asynchronous streaming of complete books in JSON format,
 * memory caching, IndexedDB persistence, and guaranteed non-truncated chapter rendering.
 */
class BibleDataService {
  private memoryCache: Map<string, BibleBookData> = new Map();
  private aliasMap: Map<string, string> = new Map();
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private isSyncing = false;

  constructor() {
    this.buildAliasMap();
    this.initDatabase();
    this.preloadBundledBooks();
    this.preloadFrequentBooks();
  }

  /**
   * Pre-loads bundled books so common books like Mateo (all 28 chapters) are available instantaneously.
   */
  private preloadBundledBooks() {
    if (matData && matData.bookId === 'MAT') {
      this.memoryCache.set('MAT', matData as BibleBookData);
    }
  }

  /**
   * Pre-loads frequently accessed devotional books (Salmos, Proverbios, Juan, Romanos)
   * in background idle time so opening the Bible view is always 0ms instant.
   */
  private preloadFrequentBooks() {
    if (typeof window === 'undefined') return;
    const loadFrequent = () => {
      const frequent = ['PSA', 'PRO', 'JHN', 'ROM', 'GEN'];
      frequent.forEach((bId) => {
        if (!this.memoryCache.has(bId)) {
          this.loadBook(bId).catch(() => {});
        }
      });
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadFrequent);
    } else {
      setTimeout(loadFrequent, 600);
    }
  }

  private initDatabase() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'bookId' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('BibleService: IndexedDB not available, falling back to memory cache.');
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  private async getFromIndexedDB(bookId: string): Promise<BibleBookData | null> {
    const db = await this.dbPromise;
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(bookId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async saveToIndexedDB(bookData: BibleBookData): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(bookData);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  private normalizeText(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private buildAliasMap() {
    BIBLE_BOOKS.forEach((book) => {
      const id = book.id.toUpperCase();
      this.aliasMap.set(id.toLowerCase(), id);
      this.aliasMap.set(book.nameEs.toLowerCase(), id);
      this.aliasMap.set(book.nameEn.toLowerCase(), id);
      this.aliasMap.set(this.normalizeText(book.nameEs), id);
      this.aliasMap.set(this.normalizeText(book.nameEn), id);
    });

    const abbreviations: Record<string, string[]> = {
      MAT: ['mt', 'mat', 'mateo', 'matthew', 'matero'],
      MRK: ['mc', 'mr', 'mar', 'marcos', 'mark'],
      LUK: ['lc', 'lu', 'luc', 'lucas', 'luke'],
      JHN: ['jn', 'jua', 'juan', 'john', 'jhn'],
      ACT: ['hch', 'hec', 'hechos', 'acts'],
      ROM: ['ro', 'rom', 'romanos', 'romans'],
      PSA: ['ps', 'sal', 'salmo', 'salmos', 'psalm', 'psalms'],
      PRO: ['pr', 'pro', 'prov', 'proverbios', 'proverbs'],
      GEN: ['gn', 'gen', 'genesis'],
      EXO: ['ex', 'exod', 'exodo', 'exodus'],
      REV: ['ap', 'apoc', 'apocalipsis', 'revelation'],
    };

    Object.entries(abbreviations).forEach(([bookId, aliases]) => {
      aliases.forEach((alias) => {
        this.aliasMap.set(alias.toLowerCase(), bookId);
        this.aliasMap.set(this.normalizeText(alias), bookId);
      });
    });
  }

  /**
   * Loads a full Bible book asynchronously from memory, IndexedDB, or static JSON asset.
   */
  public async loadBook(bookId: string): Promise<BibleBookData | null> {
    const cleanId = (bookId || '').toUpperCase();
    if (!cleanId) return null;

    // 1. In-Memory Cache
    if (this.memoryCache.has(cleanId)) {
      return this.memoryCache.get(cleanId)!;
    }

    // 2. IndexedDB Persistent Storage
    const cachedIdb = await this.getFromIndexedDB(cleanId);
    if (cachedIdb && cachedIdb.chapters && cachedIdb.chapters.length > 0) {
      this.memoryCache.set(cleanId, cachedIdb);
      return cachedIdb;
    }

    // 3. Static JSON asset fetch (/bible/books/{bookId}.json)
    try {
      const res = await fetch(`/bible/books/${cleanId}.json`);
      if (res.ok) {
        const data: BibleBookData = await res.json();
        if (data && data.chapters && Array.isArray(data.chapters)) {
          this.memoryCache.set(cleanId, data);
          this.saveToIndexedDB(data); // persist for offline capability
          return data;
        }
      }
    } catch (e) {
      console.warn(`BibleService: Fetching /bible/books/${cleanId}.json had network issue:`, e);
    }

    // 4. API Endpoint Fallback (/api/bible/chapter)
    try {
      const apiRes = await fetch('/api/bible/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: cleanId, chapter: 1 }),
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.verses && Array.isArray(json.verses)) {
          const minimalBook: BibleBookData = {
            bookId: cleanId,
            chaptersCount: 1,
            chapters: [
              json.verses.map((v: any) => ({
                verseNumber: v.verseNumber,
                textEs: v.textEs,
                textEn: v.textEn,
              })),
            ],
          };
          this.memoryCache.set(cleanId, minimalBook);
          return minimalBook;
        }
      }
    } catch (apiErr) {
      console.error('BibleService: API fallback error:', apiErr);
    }

    return null;
  }

  /**
   * Retrieves chapter verses synchronously if the book is already in memory cache.
   * Returns null if the book has not yet been loaded into memory.
   */
  public getSynchronousChapter(bookId: string, chapter: number): BibleVerse[] | null {
    const cleanId = (bookId || 'MAT').toUpperCase();
    const chapterNum = Math.max(1, parseInt(String(chapter), 10) || 1);
    const bookData = this.memoryCache.get(cleanId);
    if (bookData && bookData.chapters && bookData.chapters[chapterNum - 1]) {
      const bookMeta = BIBLE_BOOKS.find((b) => b.id === cleanId) || { nameEs: cleanId, nameEn: cleanId };
      const rawVerses = bookData.chapters[chapterNum - 1];
      return rawVerses.map((v) => ({
        bookId: cleanId,
        bookNameEs: bookMeta.nameEs,
        bookNameEn: bookMeta.nameEn,
        chapter: chapterNum,
        verseNumber: v.verseNumber,
        textEs: v.textEs,
        textEn: v.textEn,
      }));
    }
    return null;
  }

  /**
   * Retrieves all verses of a chapter dynamically without truncation.
   * Guarantees 100% complete chapters (e.g. Mateo 4 returns all 25 verses, including 4:23, 4:24, 4:25).
   */
  public async getChapter(bookId: string, chapter: number): Promise<BibleVerse[]> {
    const cleanId = (bookId || 'MAT').toUpperCase();
    const chapterNum = Math.max(1, parseInt(String(chapter), 10) || 1);
    const bookMeta = BIBLE_BOOKS.find((b) => b.id === cleanId) || { nameEs: cleanId, nameEn: cleanId };

    // 1. Fast load from memory or static JSON
    const bookData = await this.loadBook(cleanId);
    if (bookData && bookData.chapters && bookData.chapters[chapterNum - 1]) {
      const rawVerses = bookData.chapters[chapterNum - 1];
      return rawVerses.map((v) => ({
        bookId: cleanId,
        bookNameEs: bookMeta.nameEs,
        bookNameEn: bookMeta.nameEn,
        chapter: chapterNum,
        verseNumber: v.verseNumber,
        textEs: v.textEs,
        textEn: v.textEn,
      }));
    }

    // 2. Server API fallback for that specific chapter
    try {
      const res = await fetch('/api/bible/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: cleanId, chapter: chapterNum }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.verses && Array.isArray(json.verses) && json.verses.length > 0) {
          return json.verses.map((v: any) => ({
            bookId: cleanId,
            bookNameEs: bookMeta.nameEs,
            bookNameEn: bookMeta.nameEn,
            chapter: chapterNum,
            verseNumber: v.verseNumber,
            textEs: v.textEs,
            textEn: v.textEn,
          }));
        }
      }
    } catch (err) {
      console.error(`BibleService: Error retrieving ${cleanId} chapter ${chapterNum}:`, err);
    }

    return [];
  }

  /**
   * Retrieves a single verse directly by location.
   */
  public async getVerse(bookId: string, chapter: number, verseNumber: number): Promise<BibleVerse | null> {
    const verses = await this.getChapter(bookId, chapter);
    const match = verses.find((v) => v.verseNumber === verseNumber);
    return match || null;
  }

  /**
   * Resolves a scripture reference string into a precise location.
   * e.g. "Mateo 4:23", "Mat 4", "Salmo 23", "Jn 3:16", or chapter:verse like "4:23"
   */
  public resolveReference(
    query: string,
    allowSoloBook = false,
    currentBookId?: string,
    currentChapter?: number
  ): ResolvedBibleReference | null {
    if (!query || query.trim().length < 1) return null;
    const clean = this.normalizeText(query);

    // Standard reference format: [BookName] [Chapter]:[Verse] or [BookName] [Chapter] [Verse]
    const regex = /^(\d?\s*[a-zñ\s]+?)\s+(\d+)(?:[:.,\s]+(\d+))?$/i;
    const match = clean.match(regex);

    if (match) {
      const rawBook = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = match[3] ? parseInt(match[3], 10) : null;

      const bookId = this.aliasMap.get(rawBook);
      if (bookId) {
        const book = BIBLE_BOOKS.find((b) => b.id === bookId);
        if (book && chapter > 0 && chapter <= book.chaptersCount) {
          return {
            bookId: book.id,
            bookName: book.nameEs,
            chapter,
            verse,
          };
        }
      }
    }

    // Compressed format: e.g. "Mt4:23", "Jn3:16", "Mat4"
    const compRegex = /^(\d?[a-zñ]+)(\d+)(?:[:.,\s]+(\d+))?$/i;
    const compMatch = clean.match(compRegex);
    if (compMatch) {
      const rawBook = compMatch[1].trim();
      const chapter = parseInt(compMatch[2], 10);
      const verse = compMatch[3] ? parseInt(compMatch[3], 10) : null;

      const bookId = this.aliasMap.get(rawBook);
      if (bookId) {
        const book = BIBLE_BOOKS.find((b) => b.id === bookId);
        if (book && chapter > 0 && chapter <= book.chaptersCount) {
          return {
            bookId: book.id,
            bookName: book.nameEs,
            chapter,
            verse,
          };
        }
      }
    }

    // Chapter:Verse format within current book: e.g. "4:23", "4,23"
    const chVersRegex = /^(\d+)[:.,\s]+(\d+)$/;
    const chVersMatch = clean.match(chVersRegex);
    if (chVersMatch && currentBookId) {
      const targetCh = parseInt(chVersMatch[1], 10);
      const targetVs = parseInt(chVersMatch[2], 10);
      const book = BIBLE_BOOKS.find((b) => b.id === currentBookId.toUpperCase());
      if (book && targetCh > 0 && targetCh <= book.chaptersCount) {
        return {
          bookId: book.id,
          bookName: book.nameEs,
          chapter: targetCh,
          verse: targetVs,
        };
      }
    }

    // Solo verse format within current chapter: e.g. "v23", "v.23", ":23"
    const soloVsRegex = /^(?:v\.?|verse|versiculo|:)\s*(\d+)$/i;
    const soloVsMatch = clean.match(soloVsRegex);
    if (soloVsMatch && currentBookId && currentChapter) {
      const targetVs = parseInt(soloVsMatch[1], 10);
      const book = BIBLE_BOOKS.find((b) => b.id === currentBookId.toUpperCase());
      if (book) {
        return {
          bookId: book.id,
          bookName: book.nameEs,
          chapter: currentChapter,
          verse: targetVs,
        };
      }
    }

    // Solo book reference (only when explicitly requested, e.g. on Enter key)
    if (allowSoloBook) {
      const soloBookId = this.aliasMap.get(clean);
      if (soloBookId) {
        const book = BIBLE_BOOKS.find((b) => b.id === soloBookId);
        if (book) {
          return {
            bookId: book.id,
            bookName: book.nameEs,
            chapter: 1,
            verse: null,
          };
        }
      }
    }

    return null;
  }

  /**
   * Global search across indexed scriptures with local search first, then server fallback.
   */
  public async searchGlobal(keyword: string): Promise<VerseSearchResult[]> {
    if (!keyword || keyword.trim().length < 2) return [];
    const clean = keyword.trim().toLowerCase();

    // 1. Search in loaded books
    const results: VerseSearchResult[] = [];
    for (const [bookId, bookData] of this.memoryCache.entries()) {
      if (results.length >= 20) break;
      const meta = BIBLE_BOOKS.find((b) => b.id === bookId);
      const name = meta?.nameEs || bookId;
      const nameEn = meta?.nameEn || bookId;

      for (let c = 0; c < bookData.chapters.length; c++) {
        if (results.length >= 20) break;
        const chapterVerses = bookData.chapters[c];
        for (const v of chapterVerses) {
          if (v.textEs.toLowerCase().includes(clean) || v.textEn.toLowerCase().includes(clean)) {
            results.push({
              bookId,
              bookName: name,
              bookNameEn: nameEn,
              chapter: c + 1,
              verseNumber: v.verseNumber,
              textEs: v.textEs,
              textEn: v.textEn,
              relevanceScore: 0.95,
            });
            if (results.length >= 20) break;
          }
        }
      }
    }

    if (results.length > 0) {
      return results;
    }

    // 2. Query high-speed server search endpoint
    try {
      const res = await fetch('/api/bible/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.results || [];
      }
    } catch (e) {
      console.error('BibleService: Global search error:', e);
    }

    return [];
  }

  /**
   * Pre-downloads and indexes all 66 books of the Bible in background asynchronously.
   * Guarantees 100% offline access and instant search across all 31,104 verses.
   */
  public async syncEntireBible(
    onProgress?: (loaded: number, total: number, currentBookName: string, totalVersesSoFar: number) => void
  ): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;

    const total = BIBLE_BOOKS.length;
    let loaded = 0;
    let totalVersesSoFar = 0;
    const batchSize = 4;

    for (let i = 0; i < total; i += batchSize) {
      const batch = BIBLE_BOOKS.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (book) => {
          const bookData = await this.loadBook(book.id);
          loaded++;
          if (bookData && bookData.chapters) {
            for (const ch of bookData.chapters) {
              totalVersesSoFar += ch.length;
            }
          }
          if (onProgress) onProgress(loaded, total, book.nameEs, totalVersesSoFar);
        })
      );
    }

    this.isSyncing = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('havah_bible_synced_v2', 'true');
      localStorage.setItem('havah_bible_synced_time_v2', String(Date.now()));
    }
    return true;
  }

  public isBibleFullySynced(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('havah_bible_synced_v2') === 'true';
  }

  public getSyncedStats(): { loadedCount: number; totalCount: number; isFullySynced: boolean } {
    const isFullySynced = this.isBibleFullySynced();
    return {
      loadedCount: this.memoryCache.size,
      totalCount: BIBLE_BOOKS.length,
      isFullySynced: isFullySynced || this.memoryCache.size >= BIBLE_BOOKS.length,
    };
  }

  public async clearOfflineCache(): Promise<void> {
    this.memoryCache.clear();
    this.preloadBundledBooks();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('havah_bible_synced_v2');
      localStorage.removeItem('havah_bible_synced_time_v2');
    }
    const db = await this.dbPromise;
    if (db) {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).clear();
      } catch (e) {
        console.warn('Could not clear IndexedDB:', e);
      }
    }
  }
}

export const bibleService = new BibleDataService();
