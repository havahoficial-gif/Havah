import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sliders,
  ChevronDown,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  Square,
  Volume2,
  X,
  Highlighter,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Heart,
  Trash2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Edit3,
  Feather,
  CloudDownload,
  ShieldCheck,
  ChevronUp,
} from 'lucide-react';
import { BibleVerse, FavoriteVerse, JournalEntry, Language, VerseAnnotation } from '../types';
import { BIBLE_BOOKS, getVersesFor } from '../data/havahData';
import { ThemeColors } from '../theme';
import { storage } from '../utils/storage';
import { speechEngine } from '../utils/speechEngine';
import { bibleService } from '../services/bibleService';

interface BibleScreenProps {
  language: Language;
  theme: ThemeColors;
  selectedBookId: string;
  selectedChapter: number;
  completedChapters: string[];
  annotations: VerseAnnotation[];
  fontSize: number;
  onSelectLocation: (bookId: string, chapter: number) => void;
  onToggleChapterComplete: (chapterKey: string) => void;
  onToggleHighlight: (verseNum: number, colorHex: string) => void;
  onChangeFontSize: (delta: number) => void;
}

export const BibleScreen: React.FC<BibleScreenProps> = React.memo(({
  language,
  theme,
  selectedBookId,
  selectedChapter,
  completedChapters,
  annotations,
  fontSize,
  onSelectLocation,
  onToggleChapterComplete,
  onToggleHighlight,
  onChangeFontSize,
}) => {
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ot' | 'nt'>('all');
  const [selectedVerseForAction, setSelectedVerseForAction] = useState<BibleVerse | null>(null);

  // Dedicated Favorite Verses for Meditation state
  const [favorites, setFavorites] = useState<FavoriteVerse[]>(() => storage.getFavoriteVerses());
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favSearchQuery, setFavSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [verseNoteInput, setVerseNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [meditatingVerse, setMeditatingVerse] = useState<FavoriteVerse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncingBible, setIsSyncingBible] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncedBooksCount, setSyncedBooksCount] = useState(0);
  const [syncedVersesCount, setSyncedVersesCount] = useState(0);
  const [currentSyncingBook, setCurrentSyncingBook] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<'sencillo' | 'web' | 'parallel'>('sencillo');
  const [isBibleFullySynced, setIsBibleFullySynced] = useState(() => bibleService.isBibleFullySynced());
  const [bibleViewMode, setBibleViewMode] = useState<'single' | 'parallel'>('single');
  const [preferredVersion, setPreferredVersion] = useState<'es' | 'en'>('es');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // YouVersion-grade 3-step Book, Chapter, Verse Picker State
  const [pickerStep, setPickerStep] = useState<'book' | 'chapter' | 'verse'>('book');
  const [pickerBookId, setPickerBookId] = useState<string>(selectedBookId);
  const [pickerChapter, setPickerChapter] = useState<number>(selectedChapter);
  const [pickerBookSearch, setPickerBookSearch] = useState('');

  useEffect(() => {
    setPickerBookId(selectedBookId);
    setPickerChapter(selectedChapter);
  }, [selectedBookId, selectedChapter]);

  const handleFullBibleSync = async () => {
    setIsSyncingBible(true);
    setSyncProgress(0);
    setSyncedBooksCount(0);
    setSyncedVersesCount(0);
    setCurrentSyncingBook(language === 'es' ? 'Iniciando descarga...' : 'Starting download...');
    setShowDownloadModal(true);
    try {
      await bibleService.syncEntireBible((loaded, total, currentBook, totalVerses) => {
        setSyncedBooksCount(loaded);
        setSyncedVersesCount(totalVerses);
        setCurrentSyncingBook(currentBook);
        setSyncProgress(Math.round((loaded / total) * 100));
      });
      setIsBibleFullySynced(true);
      // @ts-ignore
      if (window.navigator?.vibrate) window.navigator.vibrate([50, 100, 50]);
      setToastMessage(
        language === 'es'
          ? '¡Biblia Completa Descargada! (66 libros, 31,104 versículos listos offline)'
          : 'Complete Bible Downloaded! (66 books, 31,104 verses offline ready)'
      );
    } catch (e) {
      console.error('Bible sync error:', e);
    } finally {
      setIsSyncingBible(false);
    }
  };

  // Audio Text-To-Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentReadingVerse, setCurrentReadingVerse] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingAudioRef = useRef<boolean>(false);

  // Centralized Bible Content state: initialized immediately from in-memory cache
  const [realVerses, setRealVerses] = useState<BibleVerse[] | null>(() => {
    return bibleService.getSynchronousChapter(selectedBookId, selectedChapter);
  });
  const [isFetchingRealVerses, setIsFetchingRealVerses] = useState(false);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === selectedBookId) || BIBLE_BOOKS[18]; // Default Salmos
  const bookName = language === 'es' ? currentBook.nameEs : currentBook.nameEn;

  // Define premium reading atmosphere styles matching user's exact preferences
  const atmosphereStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
    borderColor: theme.cardBorder,
  };
  
  // Use realVerses if available, otherwise get from synchronous cache or local data
  const localVerses = bibleService.getSynchronousChapter(selectedBookId, selectedChapter) || getVersesFor(selectedBookId, selectedChapter);
  const verses = realVerses && realVerses.length > 0 ? realVerses : localVerses;
  const isUsingFallback = (localVerses as any)?.isFallback && (!realVerses || realVerses.length === 0);

  // AI Chapter Summary / Wisdom Insight state
  const [chapterSummary, setChapterSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Automatically pre-load instant 0ms chapter insight whenever chapter changes
  useEffect(() => {
    const instantInsight = language === 'es'
      ? `En este capítulo ${selectedChapter} de ${currentBook.nameEs}, el Señor nos invita a descansar en Su presencia. No cargues con el peso del mundo en tus hombros; Su gracia sostiene cada paso de tu camino hoy con amor inagotable.`
      : `In this chapter ${selectedChapter} of ${currentBook.nameEs}, the Lord invites us to rest in His presence. Do not carry the weight of the world on your shoulders; His grace sustains every step today with unfailing love.`;
    setChapterSummary(instantInsight);
  }, [selectedBookId, selectedChapter, language, currentBook.nameEs]);

  const getChapterInsight = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    const instantInsight = language === 'es'
      ? `En este capítulo ${selectedChapter} de ${currentBook.nameEs}, el Señor nos invita a descansar en Su presencia. No cargues con el peso del mundo en tus hombros; Su gracia sostiene cada paso de tu camino hoy con amor inagotable.`
      : `In this chapter ${selectedChapter} of ${currentBook.nameEs}, the Lord invites us to rest in His presence. Do not carry the weight of the world on your shoulders; His grace sustains every step today with unfailing love.`;
    
    setChapterSummary(instantInsight);
    setIsSummarizing(false);
  };

  // Track window scroll for quick jump button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Robust Asynchronous Loading of Chapter Content via Centralized Bible Service
  useEffect(() => {
    let isCancelled = false;

    const loadChapter = async () => {
      // 1. Instant Synchronous Check from Centralized Service Memory Cache
      const instant = bibleService.getSynchronousChapter(selectedBookId, selectedChapter);
      const synchronous = getVersesFor(selectedBookId, selectedChapter);

      if ((instant && instant.length > 0) || (synchronous && synchronous.length > 0 && !(synchronous as any).isFallback)) {
        setRealVerses(instant && instant.length > 0 ? instant : synchronous);
        setIsFetchingRealVerses(false);
      } else {
        setIsFetchingRealVerses(true);
      }

      // 2. Asynchronous Retrieval from Centralized Bible Service (guarantees complete chapter without truncation)
      try {
        const fullChapter = await bibleService.getChapter(selectedBookId, selectedChapter);
        if (!isCancelled && fullChapter && fullChapter.length > 0) {
          setRealVerses(fullChapter);
        }
      } catch (err) {
        console.error('Async chapter load error:', err);
      } finally {
        if (!isCancelled) {
          setIsFetchingRealVerses(false);

          // Preload adjacent next and previous chapters in background for instant 0ms chapter paging
          const adjacent = [selectedChapter - 1, selectedChapter + 1].filter(
            (c) => c >= 1 && c <= currentBook.chaptersCount
          );
          adjacent.forEach((c) => {
            bibleService.getChapter(selectedBookId, c).catch(() => {});
          });
        }
      }
    };

    loadChapter();
    return () => {
      isCancelled = true;
    };
  }, [selectedBookId, selectedChapter]);

  // Smooth scroll to targeted verse when verse number changes
  useEffect(() => {
    if (currentReadingVerse) {
      const scrollTarget = () => {
        const el = document.getElementById(`verse-${currentReadingVerse}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      scrollTarget();
      const t1 = setTimeout(scrollTarget, 100);
      const t2 = setTimeout(scrollTarget, 300);
      const t3 = setTimeout(scrollTarget, 600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [currentReadingVerse, verses]);

  const chapterKey = `${selectedBookId}_${selectedChapter}`;
  const isCompleted = completedChapters.includes(chapterKey);

  // Parse global Bible references from search bar (e.g. "John 3:16", "Mateo 4:23", "4:23")
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    
    // Attempt instant resolution via Centralized Service Hash Map Engine
    const ref = bibleService.resolveReference(val, true, selectedBookId, selectedChapter);
    
    if (ref) {
      // Instant Visionary Navigation
      onSelectLocation(ref.bookId, ref.chapter);
      if (ref.verse) {
        setCurrentReadingVerse(ref.verse);
      } else {
        setCurrentReadingVerse(null);
      }
      // @ts-ignore
      if (window.navigator?.vibrate) window.navigator.vibrate(10);
      return;
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) return;

    // Check if it's a reference (allowing solo book name on enter)
    const ref = bibleService.resolveReference(searchQuery, true, selectedBookId, selectedChapter);
    if (ref) {
      onSelectLocation(ref.bookId, ref.chapter);
      if (ref.verse) {
        setCurrentReadingVerse(ref.verse);
      } else {
        setCurrentReadingVerse(null);
      }
      setSearchQuery('');
      setShowSearch(false); // Close search modal to immediately display search outcome
      return;
    }
    
    if (searchQuery.trim().length < 2) return;
    setIsFetchingRealVerses(true);
    const results = await bibleService.searchGlobal(searchQuery);
    if (results.length > 0) {
      const first = results[0];
      onSelectLocation(first.bookId, first.chapter);
      setCurrentReadingVerse(first.verseNumber);
      setSearchQuery('');
      setShowSearch(false); // Close search modal to immediately display search outcome
    }
    setIsFetchingRealVerses(false);
  };

  // Prepopulate note when selecting a verse
  useEffect(() => {
    if (selectedVerseForAction) {
      const id = `${selectedVerseForAction.bookId}_${selectedVerseForAction.chapter}_${selectedVerseForAction.verseNumber}`;
      const existing = favorites.find((f) => f.id === id);
      setVerseNoteInput(existing?.personalNote || '');
    }
  }, [selectedVerseForAction, favorites]);

  // Favorites Handlers
  const isSelectedVerseFavorite = selectedVerseForAction
    ? favorites.some(
        (f) =>
          f.bookId === selectedVerseForAction.bookId &&
          f.chapter === selectedVerseForAction.chapter &&
          f.verseNumber === selectedVerseForAction.verseNumber
      )
    : false;

  const handleToggleFavorite = (verse: BibleVerse, customNote?: string) => {
    const noteToUse = customNote !== undefined ? customNote : verseNoteInput.trim() || undefined;
    const { isFavorite, favorites: updated } = storage.toggleFavoriteVerse(verse, noteToUse);
    setFavorites(updated);
    setToastMessage(
      isFavorite
        ? language === 'es'
          ? 'Versículo guardado en Favoritos para Meditar'
          : 'Verse saved to Favorites for Meditation'
        : language === 'es'
        ? 'Versículo removido de Favoritos'
        : 'Verse removed from Favorites'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveFavorite = (id: string) => {
    const updated = storage.removeFavoriteVerse(id);
    setFavorites(updated);
    if (meditatingVerse?.id === id) {
      setMeditatingVerse(null);
    }
    setToastMessage(language === 'es' ? 'Versículo eliminado de favoritos' : 'Verse removed from favorites');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveNote = (id: string, noteText: string) => {
    const updated = storage.updateFavoriteNote(id, noteText.trim());
    setFavorites(updated);
    setEditingNoteId(null);
    setToastMessage(language === 'es' ? 'Nota de meditación guardada' : 'Meditation note saved');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyVerse = (verseText: string, citation: string, id: string) => {
    const textToCopy = `«${verseText}» — ${citation}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveVerseToJournal = (verse: BibleVerse | FavoriteVerse) => {
    const citation = `${verse.bookNameEs} ${verse.chapter}:${verse.verseNumber}`;
    const text = language === 'es' ? verse.textEs : verse.textEn;
    const note = 'personalNote' in verse && verse.personalNote ? verse.personalNote : verseNoteInput;
    const newEntry: JournalEntry = {
      id: Date.now(),
      title: language === 'es' ? `Meditación: ${citation}` : `Meditation: ${citation}`,
      content: `«${text}»\n\nReflexión del corazón:\n${note || 'Guardado para meditar en la paz y fidelidad de Dios.'}`,
      moodId: 'peace',
      scriptureRef: citation,
      timestamp: Date.now(),
    };
    const entries = storage.getJournalEntries();
    storage.saveJournalEntries([newEntry, ...entries]);
    setToastMessage(language === 'es' ? '¡Meditación guardada en tu Diario!' : 'Saved to Journal!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavigateToVerse = (bookId: string, chapter: number) => {
    onSelectLocation(bookId, chapter);
    setShowFavoritesModal(false);
  };

  // Stop audio on unmount or chapter change
  useEffect(() => {
    return () => {
      isPlayingAudioRef.current = false;
      speechEngine.stop();
      setIsPlayingAudio(false);
      setCurrentReadingVerse(null);
    };
  }, [selectedBookId, selectedChapter]);

  // Pre-fetch initial chapter verses for instant 0ms audio start
  useEffect(() => {
    if (verses.length > 0) {
      const v1 = language === 'es' ? verses[0].textEs : verses[0].textEn;
      speechEngine.preload(v1, undefined, language);
      if (verses.length > 1) {
        const v2 = language === 'es' ? verses[1].textEs : verses[1].textEn;
        speechEngine.preload(v2, undefined, language);
      }
    }
  }, [verses, language]);

  const handleStopAudio = () => {
    isPlayingAudioRef.current = false;
    speechEngine.stop();
    setIsPlayingAudio(false);
    setCurrentReadingVerse(null);
  };

  const handleStartAudio = async () => {
    if (isPlayingAudioRef.current) {
      handleStopAudio();
      return;
    }

    if (!verses.length) return;

    isPlayingAudioRef.current = true;
    setIsPlayingAudio(true);
    let currentIndex = 0;

    const playNext = async () => {
      if (!isPlayingAudioRef.current) {
        setIsPlayingAudio(false);
        setCurrentReadingVerse(null);
        return;
      }

      if (currentIndex >= verses.length) {
        isPlayingAudioRef.current = false;
        setIsPlayingAudio(false);
        setCurrentReadingVerse(null);
        return;
      }

      const v = verses[currentIndex];
      setCurrentReadingVerse(v.verseNumber);

      const verseText = language === 'es' ? v.textEs : v.textEn;

      // Pre-fetch the subsequent verse in the background for 0ms transition latency
      if (currentIndex + 1 < verses.length) {
        const nextVerseText = language === 'es' ? verses[currentIndex + 1].textEs : verses[currentIndex + 1].textEn;
        speechEngine.preload(nextVerseText, undefined, language);
      }

      speechEngine.speak({
        text: verseText,
        language,
        onEnd: () => {
          if (!isPlayingAudioRef.current) return;
          currentIndex++;
          playNext();
        },
        onError: () => {
          if (!isPlayingAudioRef.current) return;
          currentIndex++;
          playNext();
        },
      });
    };

    playNext();
  };

  // Check if searchQuery is a reference (e.g. "mateo 4:23", "mateo 4", "4:23", "juan 3", etc.)
  const parsedSearchRef = bibleService.resolveReference(searchQuery, true, selectedBookId, selectedChapter);

  // If search query is a reference, DO NOT filter out the chapter verses!
  // Only filter if it's a general text keyword search (like "luz" or "amor")
  const displayedVerses = searchQuery.trim() && !parsedSearchRef
    ? verses.filter((v) =>
        (language === 'es' ? v.textEs : v.textEn)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : verses;

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      onSelectLocation(selectedBookId, selectedChapter - 1);
    } else {
      const bookIdx = BIBLE_BOOKS.findIndex((b) => b.id === selectedBookId);
      if (bookIdx > 0) {
        const prevBook = BIBLE_BOOKS[bookIdx - 1];
        onSelectLocation(prevBook.id, prevBook.chaptersCount);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < currentBook.chaptersCount) {
      onSelectLocation(selectedBookId, selectedChapter + 1);
    } else {
      const bookIdx = BIBLE_BOOKS.findIndex((b) => b.id === selectedBookId);
      if (bookIdx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIdx + 1];
        onSelectLocation(nextBook.id, 1);
      }
    }
  };

  return (
    <div className="max-w-2xl md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 space-y-4 pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-2xl border border-purple-300/30 text-xs font-semibold bg-purple-950/90 text-white">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar with Liquid Glass */}
      <div
        className="rounded-3xl p-3 border transition-all duration-300 shadow-xl backdrop-blur-2xl liquid-glass flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center justify-between md:justify-start gap-2 flex-1">
          {/* Search Toggle - Moved to left next to Book Picker */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            style={{
              backgroundColor: showSearch ? theme.accentBg : theme.cardVariant,
              borderColor: theme.cardBorder,
              color: showSearch ? theme.accent : theme.textMuted,
            }}
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* Book & Chapter Dropdown */}
          <button
            onClick={() => setShowBookPicker(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-sm font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95 flex-1 md:flex-none justify-center"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.accent,
            }}
          >
            <span className="truncate font-bold" style={{ color: theme.accent }}>
              {bookName} {selectedChapter}
            </span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Translation badge & tool actions */}
        <div className="flex items-center gap-2">
          {/* Futuristic Sync / Download Full Bible Button */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: isBibleFullySynced ? 'rgba(16, 185, 129, 0.12)' : theme.cardVariant,
              borderColor: isBibleFullySynced ? 'rgba(16, 185, 129, 0.3)' : theme.cardBorder,
              color: isBibleFullySynced ? '#10B981' : theme.accent,
            }}
            title={language === 'es' ? 'Descargar / Gestionar Biblia Completa Offline' : 'Download / Manage Offline Bible'}
          >
            {isBibleFullySynced ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <CloudDownload className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="uppercase tracking-tighter">
              {isSyncingBible 
                ? `${syncProgress}%` 
                : isBibleFullySynced 
                  ? (language === 'es' ? 'OFFLINE' : 'OFFLINE')
                  : (language === 'es' ? 'DESCARGAR' : 'DOWNLOAD')}
            </span>
          </button>

          {/* Translation Switcher Button */}
          <button
            onClick={() => setShowVersionModal(true)}
            title={language === 'es' ? 'Seleccionar versión de la Biblia' : 'Select Bible translation'}
            className="text-[11px] font-bold px-2.5 py-1 rounded-xl border shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accent,
              borderColor: theme.accentBorder,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>
              {bibleViewMode === 'parallel'
                ? (language === 'es' ? 'PARALELO' : 'PARALLEL')
                : preferredVersion === 'es'
                ? (language === 'es' ? 'SENCILLO' : 'SIMPLE')
                : 'WEB'}
            </span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {/* Dedicated Favorite Verses for Meditation Button */}
          <button
            onClick={() => setShowFavoritesModal(true)}
            className="relative p-2 rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
            style={{
              backgroundColor: favorites.length > 0 ? theme.accentBg : theme.cardVariant,
              borderColor: favorites.length > 0 ? theme.accentBorder : theme.cardBorder,
              color: theme.accent,
            }}
            title={language === 'es' ? 'Versículos favoritos para meditar' : 'Saved verses for meditation'}
          >
            <Bookmark className={`w-4 h-4 ${favorites.length > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
            {favorites.length > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                {favorites.length}
              </span>
            )}
          </button>

          {/* TTS Audio Player button */}
          <button
            onClick={handleStartAudio}
            className="p-2 rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isPlayingAudio ? theme.accent : theme.cardVariant,
              borderColor: isPlayingAudio ? theme.accent : theme.cardBorder,
              color: isPlayingAudio ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
            }}
            title={isPlayingAudio ? 'Pausar audio' : 'Escuchar capítulo en voz calma'}
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            style={{
              backgroundColor: showSettings ? theme.accentBg : theme.cardVariant,
              borderColor: theme.cardBorder,
              color: showSettings ? theme.accent : theme.textMuted,
            }}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Settings Drawer (Liquid Glass) */}
      {showSettings && (
        <div
          className="rounded-3xl p-5 border animate-fade-in space-y-3.5 shadow-xl backdrop-blur-2xl liquid-glass"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: theme.text }}>
              {language === 'es' ? 'Tamaño de letra' : 'Font Size'}: {fontSize}px
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeFontSize(-2)}
                className="w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                A-
              </button>
              <button
                onClick={() => onChangeFontSize(2)}
                className="w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                A+
              </button>
            </div>
          </div>

          {isPlayingAudio && (
            <div
              className="p-3 rounded-2xl border flex items-center justify-between shadow-sm animate-fade-in"
              style={{
                backgroundColor: theme.accentBg,
                borderColor: theme.accentBorder,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5 h-3.5">
                  <span className="w-1 bg-current rounded-full h-3" style={{ color: theme.accent }} />
                  <span className="w-1 bg-current rounded-full h-4" style={{ color: theme.accent }} />
                  <span className="w-1 bg-current rounded-full h-2" style={{ color: theme.accent }} />
                  <span className="w-1 bg-current rounded-full h-3.5" style={{ color: theme.accent }} />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight" style={{ color: theme.accent }}>
                    {language === 'es' ? `Leyendo versículo ${currentReadingVerse || '...'}` : `Reciting verse ${currentReadingVerse || '...'}`}
                  </p>
                  <p className="text-[10px] opacity-80" style={{ color: theme.accent }}>
                    {language === 'es' ? 'Voz humana y serena' : 'Human serene voice'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleStopAudio}
                className="text-xs font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95"
                style={{
                  backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                  borderColor: theme.accentBorder,
                  color: theme.accent,
                }}
              >
                <Square className="w-3 h-3 fill-current" />
                <span>{language === 'es' ? 'Detener' : 'Stop'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Offline Bible Banner for 1-click download */}
      {!isBibleFullySynced && !isSyncingBible && (
        <div
          className="rounded-3xl p-4 border shadow-lg backdrop-blur-xl liquid-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in relative overflow-hidden group"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.accentBorder,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CloudDownload className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                {language === 'es' ? 'Descargar Biblia Completa (Lectura Offline)' : 'Download Complete Bible (Offline Reading)'}
              </h4>
              <p className="text-[11px] opacity-75 font-medium leading-tight">
                {language === 'es'
                  ? 'Guarda los 66 libros y 31,104 versículos para leer sin conexión a internet y acceder a todos los capítulos completos.'
                  : 'Save all 66 books and 31,104 verses for 100% offline reading and instant complete access.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleFullBibleSync}
            className="px-4 py-2 rounded-2xl border text-xs font-bold tracking-wider uppercase transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer shrink-0 flex items-center gap-1.5 backdrop-blur-md"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
              color: theme.accent,
            }}
          >
            <CloudDownload className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Descargar Ahora' : 'Download Now'}</span>
          </button>
        </div>
      )}

      {/* Dedicated Offline Download / Sync Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 relative overflow-hidden liquid-glass"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <CloudDownload className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-scripture uppercase tracking-wider" style={{ color: theme.accent }}>
                    {language === 'es' ? 'Biblia Completa Offline' : 'Complete Bible Offline'}
                  </h3>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                    66 Libros • 1,189 Capítulos • 31,104 Versículos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Display */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="opacity-75 uppercase tracking-wider truncate max-w-[280px]">
                  {isSyncingBible
                    ? (language === 'es' ? `Descargando: ${currentSyncingBook}` : `Downloading: ${currentSyncingBook}`)
                    : isBibleFullySynced
                    ? (language === 'es' ? '✓ Estado: Completamente Sincronizada' : '✓ Status: Fully Synchronized')
                    : (language === 'es' ? 'Estado: Listo para descargar' : 'Status: Ready to download')}
                </span>
                <span className="font-mono text-amber-500 font-bold">{isBibleFullySynced && !isSyncingBible ? '100%' : `${syncProgress}%`}</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div
                  className="h-full bg-linear-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                  style={{ width: `${isBibleFullySynced && !isSyncingBible ? 100 : Math.max(5, syncProgress)}%` }}
                />
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="block text-[10px] font-bold opacity-50 uppercase tracking-wider">
                    {language === 'es' ? 'Libros Guardados' : 'Books Saved'}
                  </span>
                  <span className="text-sm font-bold font-mono" style={{ color: theme.accent }}>
                    {isBibleFullySynced && !isSyncingBible ? 66 : syncedBooksCount} / 66
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="block text-[10px] font-bold opacity-50 uppercase tracking-wider">
                    {language === 'es' ? 'Versículos Indexados' : 'Verses Indexed'}
                  </span>
                  <span className="text-sm font-bold font-mono" style={{ color: theme.accent }}>
                    {isBibleFullySynced && !isSyncingBible ? '31,104' : (syncedVersesCount ? syncedVersesCount.toLocaleString() : '0')} / 31,104
                  </span>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2 text-xs opacity-85">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'es' ? 'Lectura instantánea de cualquier libro sin recortes ni versículos truncados.' : 'Instant chapter reading without truncation or delays.'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'es' ? '100% Funcional sin conexión a internet y en modo avión.' : 'Works 100% in airplane mode and without Wi-Fi/data.'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'es' ? 'Búsqueda por palabras clave instantánea en toda la Biblia.' : 'Instant global keyword search across all 66 books.'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: theme.cardBorder }}
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
              <button
                onClick={handleFullBibleSync}
                disabled={isSyncingBible}
                className="px-5 py-2.5 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer flex items-center gap-2 backdrop-blur-md btn-holographic"
              >
                <CloudDownload className="w-4 h-4" />
                <span>
                  {isSyncingBible
                    ? (language === 'es' ? 'Descargando...' : 'Downloading...')
                    : isBibleFullySynced
                    ? (language === 'es' ? 'Re-descargar / Verificar' : 'Re-download / Verify')
                    : (language === 'es' ? 'Iniciar Descarga Completa' : 'Start Full Download')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translation Selection Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-5 relative overflow-hidden liquid-glass"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold font-serif-scripture uppercase tracking-wider" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Versión de la Biblia' : 'Bible Translation'}
                </h3>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'sencillo',
                  name: 'Español Sencillo',
                  badge: 'ESPAÑOL',
                  desc: 'Español actual y fácil de entender, pensado para jóvenes y para quien lee la Biblia por primera vez.',
                  onClick: () => {
                    setBibleViewMode('single');
                    setPreferredVersion('es');
                    setSelectedTranslation('sencillo');
                    setShowVersionModal(false);
                  },
                  isActive: bibleViewMode === 'single' && preferredVersion === 'es',
                },
                {
                  id: 'web',
                  name: 'World English Bible (WEB)',
                  badge: 'ENGLISH',
                  desc: 'Clear, modern English that is easy to read and understand. Public domain.',
                  onClick: () => {
                    setBibleViewMode('single');
                    setPreferredVersion('en');
                    setSelectedTranslation('web');
                    setShowVersionModal(false);
                  },
                  isActive: bibleViewMode === 'single' && preferredVersion === 'en',
                },
                {
                  id: 'parallel',
                  name: 'Modo Paralelo (Bilingüe ES + EN)',
                  badge: 'PARALELO',
                  desc: 'Compara versículo a versículo en Español Sencillo y World English Bible.',
                  onClick: () => {
                    setBibleViewMode('parallel');
                    setSelectedTranslation('parallel');
                    setShowVersionModal(false);
                  },
                  isActive: bibleViewMode === 'parallel',
                },
              ].map((ver) => (
                <button
                  key={ver.id}
                  onClick={ver.onClick}
                  className="w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 hover:scale-[1.01] active:scale-98"
                  style={{
                    backgroundColor: ver.isActive ? theme.accentBg : theme.cardVariant,
                    borderColor: ver.isActive ? theme.accent : theme.cardBorder,
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-serif-scripture" style={{ color: ver.isActive ? theme.accent : theme.text }}>
                        {ver.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-500 uppercase">
                        {ver.badge}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-70 leading-snug">{ver.desc}</p>
                  </div>
                  {ver.isActive && <Check className="w-4 h-4 text-amber-500 shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scripture Search Bar (Liquid Glass with Futuristic Glow) */}
      {showSearch && (
        <div
          className="rounded-3xl p-3.5 border animate-fade-in shadow-2xl backdrop-blur-2xl liquid-glass relative overflow-hidden group"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
          }}
        >
          {/* Animated Glow Portal */}
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-amber-500/70" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGlobalSearch();
              }}
              placeholder={
                language === 'es'
                  ? 'Navegación Visionaria (Ej: Mateo 4:23)...'
                  : 'Visionary Navigation (Ex: John 3:16)...'
              }
              className="w-full pl-10 pr-16 py-2.5 text-xs rounded-2xl border outline-none liquid-glass-subtle shadow-inner transition-all focus:ring-2 focus:ring-amber-500/20"
              style={{
                borderColor: theme.cardBorder,
                color: theme.text,
              }}
            />
            <div className="absolute right-2 top-1.5 flex gap-1.5 items-center">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 cursor-pointer transition-all mr-0.5"
                  title={language === 'es' ? 'Limpiar búsqueda' : 'Clear search'}
                >
                  <X className="w-3.5 h-3.5" style={{ color: theme.text }} />
                </button>
              )}
              <button
                onClick={handleGlobalSearch}
                className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-black cursor-pointer shadow-md shadow-amber-500/25 flex items-center justify-center shrink-0"
                title={language === 'es' ? 'Buscar' : 'Search'}
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {parsedSearchRef && (
            <div className="mt-2.5 pt-2 border-t flex items-center justify-between animate-fade-in" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'es'
                    ? `Cita identificada: ${parsedSearchRef.bookName} ${parsedSearchRef.chapter}${parsedSearchRef.verse ? `:${parsedSearchRef.verse}` : ''}`
                    : `Reference detected: ${parsedSearchRef.bookName} ${parsedSearchRef.chapter}${parsedSearchRef.verse ? `:${parsedSearchRef.verse}` : ''}`}
                </span>
              </div>
              <button
                onClick={() => {
                  onSelectLocation(parsedSearchRef.bookId, parsedSearchRef.chapter);
                  if (parsedSearchRef.verse) {
                    setCurrentReadingVerse(parsedSearchRef.verse);
                  }
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="px-3 py-1 rounded-xl bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                {language === 'es' ? 'Enfocar pasaje ➜' : 'Focus passage ➜'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Chapter Illuminator (Futuristic Summary) */}
      <div 
        className="rounded-3xl p-5 border shadow-lg backdrop-blur-xl liquid-glass-subtle flex flex-col gap-4 transition-all"
        style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h4 className="text-[12px] font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                {language === 'es' ? 'Iluminador de Fe' : 'Faith Illuminator'}
              </h4>
              <p className="text-[9px] opacity-60 uppercase font-bold tracking-wide">{language === 'es' ? 'Visión Profunda de este Capítulo' : 'Chapter Insight'}</p>
            </div>
          </div>
          
          {!chapterSummary ? (
            <button
              onClick={getChapterInsight}
              disabled={isSummarizing}
              className="px-4 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: theme.accentBg,
                borderColor: theme.accentBorder,
                color: theme.accent,
              }}
            >
              {isSummarizing ? (
                <span>{language === 'es' ? 'CARGANDO...' : 'LOADING...'}</span>
              ) : (
                <>
                  <Feather className="w-3 h-3" />
                  <span>{language === 'es' ? 'REVELAR ESENCIA' : 'REVEAL ESSENCE'}</span>
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={() => setChapterSummary(null)}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-30 hover:opacity-100 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {chapterSummary && (
          <div
            className="p-4 rounded-2xl border animate-fade-in"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
            }}
          >
            <p
              className="text-xs italic leading-relaxed font-serif-scripture"
              style={{ color: theme.text }}
            >
              "{chapterSummary}"
            </p>
          </div>
        )}

        {/* Cohesive Metadata & Verification panel integrated 100% inside the box */}
        <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2.5 text-[10px] opacity-95" style={{ borderColor: theme.cardBorder }}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {language === 'es' ? 'Texto Sagrado Íntegro' : 'Sacred Text Verified'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 uppercase tracking-wider text-xs" style={{ color: theme.text }}>
              {bookName} {selectedChapter}
            </span>
            <span className="px-1.5 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 opacity-70 uppercase tracking-wider">
              {verses.length} {language === 'es' ? 'v.' : 'v.'}
            </span>
            <span className="px-1.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono uppercase text-[9px]">
              {isBibleFullySynced ? 'OFFLINE' : 'ONLINE'}
            </span>
            <span className="px-1.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 font-mono uppercase text-[9px]">
              {bibleViewMode === 'parallel' ? 'ES+EN' : preferredVersion === 'es' ? 'SENCILLO' : 'WEB'}
            </span>
          </div>
        </div>
      </div>

      {/* Verses List Card (Liquid Glass Sanctuary Card for Comfortable Reading) */}
      <main
        className="rounded-3xl p-6 sm:p-10 border space-y-6 shadow-2xl backdrop-blur-2xl transition-all duration-300"
        style={{
          minHeight: '80vh',
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        }}
      >
        {isFetchingRealVerses && (
          <div className="py-3 px-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-3 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-amber-500">
              {language === 'es' ? 'Cargando capítulo completo...' : 'Loading complete chapter...'}
            </span>
          </div>
        )}

        {/* Quick Jumper for Long Chapters (> 20 verses, e.g. Mateo 4, Mateo 26, Salmo 119) */}
        {displayedVerses.length > 20 && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl border text-xs mb-3" style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}>
            <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">
              {language === 'es' ? 'Salto Rápido:' : 'Quick Jump:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {[
                1,
                Math.round(displayedVerses.length * 0.25),
                Math.round(displayedVerses.length * 0.5),
                Math.round(displayedVerses.length * 0.75),
                displayedVerses.length >= 23 ? 23 : null,
                displayedVerses.length
              ]
                .filter((v): v is number => v !== null && v > 0 && v <= displayedVerses.length)
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .sort((a, b) => a - b)
                .map((vNum) => (
                  <button
                    key={vNum}
                    onClick={() => {
                      setCurrentReadingVerse(vNum);
                      const el = document.getElementById(`verse-${vNum}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border border-black/5 dark:border-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 active:scale-95 cursor-pointer"
                    style={{ color: currentReadingVerse === vNum ? theme.accent : theme.text }}
                  >
                    v.{vNum}
                  </button>
                ))}
            </div>
          </div>
        )}

        {isUsingFallback && !isFetchingRealVerses && (
          <div className="py-3 px-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-4 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: theme.text }}>
              {language === 'es' 
                ? 'Base Local • Cargando Versículos' 
                : 'Local Base • Loading Verses'}
            </p>
          </div>
        )}

        {displayedVerses.length === 0 && (
          <div className="py-12 px-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold opacity-75">
              {language === 'es'
                ? `No hay versículos que contengan "${searchQuery}" en este capítulo`
                : `No verses found with "${searchQuery}" in this chapter`}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {language === 'es' ? 'Mostrar todo el capítulo' : 'Show full chapter'}
            </button>
          </div>
        )}

        {/* Independent Chapter Scripture Scroll Container with Smooth Scrolling */}
        <div className="overflow-y-auto max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-290px)] pr-1 sm:pr-2 space-y-4 rounded-2xl scroll-smooth">
          {displayedVerses.map((verse) => {
            const annotation = annotations.find(
              (a) => a.bookId === verse.bookId && a.chapter === verse.chapter && a.verseNumber === verse.verseNumber
            );
            const isHighlighted = !!annotation;
            const isReadingNow = currentReadingVerse === verse.verseNumber;
            const isFav = favorites.some(
              (f) =>
                f.bookId === verse.bookId &&
                f.chapter === verse.chapter &&
                f.verseNumber === verse.verseNumber
            );

            return (
              <div
                key={verse.verseNumber}
                id={`verse-${verse.verseNumber}`}
                onClick={() => setSelectedVerseForAction(verse)}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  isReadingNow ? 'ring-2 ring-offset-2 scale-[1.01] shadow-md shadow-amber-500/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  border: `1px solid ${isReadingNow ? theme.accent : isFav ? theme.accentBorder : theme.cardBorder}`,
                  backgroundColor: isHighlighted
                    ? annotation?.colorHex
                    : isReadingNow
                    ? theme.accentBg
                    : isFav
                    ? theme.accentBg
                    : theme.cardVariant,
                }}
              >
                {bibleViewMode === 'parallel' ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span
                        className="font-sans font-bold text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-500 select-none inline-flex items-center gap-1 shrink-0 mt-1"
                      >
                        {isFav && <Bookmark className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />}
                        <span>{verse.verseNumber} • ES</span>
                      </span>
                      <p
                        className="font-serif-scripture leading-relaxed transition-all flex-1"
                        style={{ fontSize: `${fontSize}px`, color: atmosphereStyle.color }}
                      >
                        {verse.textEs}
                      </p>
                    </div>
                    <div className="flex items-start gap-2 pt-1.5 border-t border-black/5 dark:border-white/5 opacity-85">
                      <span
                        className="font-sans font-bold text-[10px] px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-400 select-none inline-flex items-center gap-1 shrink-0 mt-0.5"
                      >
                        <span>{verse.verseNumber} · WEB</span>
                      </span>
                      <p
                        className="font-serif-scripture italic leading-relaxed transition-all flex-1 text-[0.95em]"
                        style={{ fontSize: `${Math.max(12, fontSize - 1)}px`, color: theme.text }}
                      >
                        {verse.textEn}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p
                    className="font-serif-scripture leading-relaxed transition-all"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: theme.text,
                    }}
                  >
                    <span
                      className="font-sans font-bold text-xs mr-2 select-none inline-flex items-center gap-1 min-w-[1.2rem]"
                      style={{ color: theme.accent }}
                    >
                      {isFav && <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500" />}
                      <span>{verse.verseNumber}</span>
                    </span>
                    {preferredVersion === 'es' || language === 'es' ? verse.textEs : verse.textEn}
                  </p>
                )}
              </div>
            );
          })}

          {/* Chapter Navigation Buttons (Futuristic redesign - At the end of verse scroll) */}
          <div className="pt-8 border-t space-y-5" style={{ borderColor: theme.cardBorder }}>
            {/* Progress Bar through the Book */}
            <div className="relative h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
              <div 
                className="absolute left-0 top-0 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(229,181,100,0.5)]"
                style={{ 
                  width: `${(selectedChapter / currentBook.chaptersCount) * 100}%`,
                  backgroundColor: theme.accent
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevChapter}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl border text-[11px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md liquid-glass-subtle"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'es' ? 'ANTERIOR' : 'PREVIOUS'}</span>
              </button>

              <div className="text-center">
                <span className="block text-[10px] font-bold tracking-widest uppercase opacity-50" style={{ color: theme.text }}>
                  {bookName}
                </span>
                <span className="text-lg font-serif-scripture font-bold" style={{ color: theme.accent }}>
                  {selectedChapter} <span className="text-xs opacity-30 mx-1">/</span> {currentBook.chaptersCount}
                </span>
              </div>

              <button
                onClick={handleNextChapter}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl border text-[11px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md liquid-glass-subtle"
                style={{
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                  color: theme.accent,
                }}
              >
                <span>{language === 'es' ? 'SIGUIENTE' : 'NEXT'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Verse Action, Favorite & Highlight Modal (Liquid Glass) */}
      {selectedVerseForAction && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/15'
        }`}>
          <div
            className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass space-y-3.5"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2">
                <span
                  className="p-1.5 rounded-xl border flex items-center justify-center shadow-xs"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                    color: theme.accent,
                  }}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSelectedVerseFavorite ? 'fill-amber-500 text-amber-500' : 'text-amber-500'}`} />
                </span>
                <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {bookName} {selectedVerseForAction.chapter}:{selectedVerseForAction.verseNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVerseForAction(null)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ color: theme.textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scripture quote */}
            <p className="font-serif-scripture italic text-sm leading-relaxed" style={{ color: theme.text }}>
              «{language === 'es' ? selectedVerseForAction.textEs : selectedVerseForAction.textEn}»
            </p>

            {/* Primary Favorite Toggle Button */}
            <button
              onClick={() => handleToggleFavorite(selectedVerseForAction)}
              className="w-full py-2.5 px-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-98"
              style={{
                backgroundColor: isSelectedVerseFavorite ? theme.accentBg : theme.accent,
                borderColor: isSelectedVerseFavorite ? theme.accentBorder : theme.accent,
                color: isSelectedVerseFavorite ? theme.accent : theme.isDark ? '#000000' : '#FFFFFF',
              }}
            >
              <div className="flex items-center gap-2">
                <Bookmark className={`w-4 h-4 ${isSelectedVerseFavorite ? 'fill-amber-500 text-amber-500' : 'fill-current'}`} />
                <span>
                  {isSelectedVerseFavorite
                    ? language === 'es'
                      ? 'Guardado en Favoritos para Meditar'
                      : 'Saved in Favorites for Meditation'
                    : language === 'es'
                    ? 'Guardar en Favoritos para Meditar'
                    : 'Save to Favorites for Meditation'}
                </span>
              </div>
              {isSelectedVerseFavorite && (
                <span className="text-[11px] underline opacity-80 hover:opacity-100">
                  {language === 'es' ? 'Quitar' : 'Remove'}
                </span>
              )}
            </button>

            {/* Personal Meditation Note Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: theme.textMuted }}>
                <Feather className="w-3 h-3 text-amber-500" />
                <span>{language === 'es' ? 'Nota o pensamiento para meditar:' : 'Personal reflection note:'}</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={verseNoteInput}
                  onChange={(e) => setVerseNoteInput(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? '¿Qué descanso o promesa te da este versículo?...'
                      : 'What promise does this verse bring you?...'
                  }
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border outline-none liquid-glass-subtle"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                />
                {isSelectedVerseFavorite && (
                  <button
                    onClick={() => {
                      const id = `${selectedVerseForAction.bookId}_${selectedVerseForAction.chapter}_${selectedVerseForAction.verseNumber}`;
                      handleSaveNote(id, verseNoteInput);
                    }}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: theme.accentBg,
                      borderColor: theme.accentBorder,
                      color: theme.accent,
                    }}
                  >
                    {language === 'es' ? 'Guardar' : 'Save'}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions: Copiar & Meditar en Diario */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                onClick={() =>
                  handleCopyVerse(
                    language === 'es' ? selectedVerseForAction.textEs : selectedVerseForAction.textEn,
                    `${bookName} ${selectedVerseForAction.chapter}:${selectedVerseForAction.verseNumber}`,
                    `${selectedVerseForAction.bookId}_${selectedVerseForAction.chapter}_${selectedVerseForAction.verseNumber}`
                  )
                }
                className="py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                {copiedId === `${selectedVerseForAction.bookId}_${selectedVerseForAction.chapter}_${selectedVerseForAction.verseNumber}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>
                  {copiedId === `${selectedVerseForAction.bookId}_${selectedVerseForAction.chapter}_${selectedVerseForAction.verseNumber}`
                    ? language === 'es'
                      ? '¡Copiado!'
                      : 'Copied!'
                    : language === 'es'
                    ? 'Copiar texto'
                    : 'Copy text'}
                </span>
              </button>

              <button
                onClick={() => {
                  handleSaveVerseToJournal(selectedVerseForAction);
                  setSelectedVerseForAction(null);
                }}
                className="py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'es' ? 'Meditar en Diario' : 'Reflect in Journal'}</span>
              </button>
            </div>

            {/* Subrayar con Color */}
            <div className="pt-0.5">
              <p className="text-[11px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Subrayar con color:' : 'Highlight color:'}
              </p>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Dorado', hex: theme.isDark ? 'rgba(229, 181, 100, 0.35)' : 'rgba(120, 60, 21, 0.16)' },
                  { label: 'Olivo', hex: 'rgba(94, 139, 126, 0.3)' },
                  { label: 'Rosa', hex: 'rgba(196, 122, 122, 0.3)' },
                  { label: 'Lavanda', hex: 'rgba(138, 129, 168, 0.3)' },
                ].map((c) => (
                  <button
                    key={c.label}
                    onClick={() => {
                      onToggleHighlight(selectedVerseForAction.verseNumber, c.hex);
                      setSelectedVerseForAction(null);
                    }}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: c.hex,
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    }}
                  >
                    <Highlighter className="w-3 h-3" />
                    <span className="text-[11px]">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedVerseForAction(null)}
              className="w-full py-2.5 rounded-2xl border text-xs font-bold cursor-pointer hover:opacity-90 shadow-sm active:scale-98 mt-1"
              style={{
                backgroundColor: theme.cardVariant,
                borderColor: theme.cardBorder,
                color: theme.text,
              }}
            >
              {language === 'es' ? 'Listo' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* Dedicated Section: Versículos Favoritos para Meditar (Liquid Glass Modal) */}
      {showFavoritesModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/15'
        }`}>
          <div
            className="w-full max-w-xl rounded-3xl p-5 sm:p-7 border shadow-2xl transition-all max-h-[90vh] flex flex-col backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md border"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                    color: theme.accent,
                  }}
                >
                  <Bookmark className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                      {language === 'es' ? 'Versículos Guardados para Meditar' : 'Saved Verses for Meditation'}
                    </h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: theme.accentBg,
                        color: theme.accent,
                        border: `1px solid ${theme.accentBorder}`,
                      }}
                    >
                      {favorites.length}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: theme.textMuted }}>
                    {language === 'es'
                      ? 'Tu santuario de promesas y pasajes atesorados en el corazón'
                      : 'Your sacred treasury of scripture promises for peaceful reflection'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowFavoritesModal(false);
                  setEditingNoteId(null);
                  setMeditatingVerse(null);
                }}
                className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ color: theme.textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="pt-3 pb-2 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={favSearchQuery}
                  onChange={(e) => setFavSearchQuery(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? 'Buscar en tus versículos guardados o notas...'
                      : 'Search in saved scriptures or notes...'
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl border outline-none liquid-glass-subtle shadow-xs"
                  style={{
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: theme.textMuted }} />
                {favSearchQuery && (
                  <button
                    onClick={() => setFavSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs cursor-pointer opacity-60 hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {['all', 'Paz', 'Serenidad', 'Fortaleza', 'Sabiduría', 'Descanso'].map((cat) => {
                  const count =
                    cat === 'all'
                      ? favorites.length
                      : favorites.filter(
                          (f) =>
                            f.category === cat ||
                            f.personalNote?.toLowerCase().includes(cat.toLowerCase())
                        ).length;

                  if (cat !== 'all' && count === 0) return null;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className="px-3 py-1 rounded-xl border text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs active:scale-95"
                      style={{
                        backgroundColor: activeCategoryFilter === cat ? theme.accent : theme.cardVariant,
                        borderColor: activeCategoryFilter === cat ? theme.accent : theme.cardBorder,
                        color:
                          activeCategoryFilter === cat
                            ? theme.isDark
                              ? '#000000'
                              : '#FFFFFF'
                            : theme.textMuted,
                      }}
                    >
                      {cat === 'all'
                        ? language === 'es'
                          ? `Todos (${favorites.length})`
                          : `All (${favorites.length})`
                        : `${cat} (${count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Favorites List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 pt-1">
              {(() => {
                const filtered = favorites.filter((fav) => {
                  const matchesSearch =
                    !favSearchQuery.trim() ||
                    (
                      fav.textEs +
                      ' ' +
                      fav.textEn +
                      ' ' +
                      fav.bookNameEs +
                      ' ' +
                      fav.chapter +
                      ':' +
                      fav.verseNumber +
                      ' ' +
                      (fav.personalNote || '')
                    )
                      .toLowerCase()
                      .includes(favSearchQuery.toLowerCase());

                  const matchesCat =
                    activeCategoryFilter === 'all' ||
                    fav.category === activeCategoryFilter ||
                    fav.personalNote?.toLowerCase().includes(activeCategoryFilter.toLowerCase());

                  return matchesSearch && matchesCat;
                });

                if (filtered.length === 0) {
                  return (
                    <div
                      className="py-12 px-4 text-center rounded-3xl border space-y-3 liquid-glass-subtle"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <div
                        className="w-14 h-14 mx-auto rounded-full flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: theme.accentBg, color: theme.accent }}
                      >
                        <Bookmark className="w-7 h-7 text-amber-500 fill-amber-500/30" />
                      </div>
                      <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                        {favorites.length === 0
                          ? language === 'es'
                            ? 'Aún no tienes versículos guardados'
                            : 'No saved verses yet'
                          : language === 'es'
                          ? 'No se encontraron versículos con esa búsqueda'
                          : 'No matching verses found'}
                      </h4>
                      <p className="text-xs max-w-sm mx-auto leading-relaxed" style={{ color: theme.textMuted }}>
                        {favorites.length === 0
                          ? language === 'es'
                            ? 'Mientras lees la Biblia, toca cualquier versículo para guardarlo aquí con tu nota de meditación personal y regresar a él cada vez que necesites paz.'
                            : 'While reading Scripture, tap any verse to save it here with your reflection notes and return to it whenever your soul needs rest.'
                          : language === 'es'
                          ? 'Prueba con otra palabra clave, o revisa todos tus versículos favoritos.'
                          : 'Try another keyword or view all saved verses.'}
                      </p>
                      {favorites.length > 0 && favSearchQuery && (
                        <button
                          onClick={() => {
                            setFavSearchQuery('');
                            setActiveCategoryFilter('all');
                          }}
                          className="px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer"
                          style={{
                            backgroundColor: theme.accentBg,
                            borderColor: theme.accentBorder,
                            color: theme.accent,
                          }}
                        >
                          {language === 'es' ? 'Ver todos los versículos' : 'View all verses'}
                        </button>
                      )}
                    </div>
                  );
                }

                return filtered.map((fav) => {
                  const citation = `${language === 'es' ? fav.bookNameEs : fav.bookNameEn} ${fav.chapter}:${fav.verseNumber}`;
                  const isMeditatingThis = meditatingVerse?.id === fav.id;
                  const isEditingThisNote = editingNoteId === fav.id;

                  return (
                    <div
                      key={fav.id}
                      className="rounded-3xl p-4 sm:p-5 border transition-all duration-300 shadow-md backdrop-blur-xl liquid-glass liquid-glass-subtle space-y-3"
                      style={{
                        backgroundColor: theme.cardVariant,
                        borderColor: theme.cardBorder,
                      }}
                    >
                      {/* Top Meta Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-serif-scripture font-bold text-sm tracking-wide flex items-center gap-1.5"
                            style={{ color: theme.accent }}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{citation}</span>
                          </span>
                          {fav.category && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: theme.accentBg,
                                color: theme.accent,
                                border: `1px solid ${theme.accentBorder}`,
                              }}
                            >
                              {fav.category}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-sans" style={{ color: theme.textMuted }}>
                          {new Date(fav.timestamp).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Scripture Text */}
                      <p
                        className="font-serif-scripture text-sm sm:text-base leading-relaxed pl-3 border-l-2"
                        style={{ color: theme.text, borderColor: theme.accent }}
                      >
                        «{language === 'es' ? fav.textEs : fav.textEn}»
                      </p>

                      {/* Personal Meditation Note Box */}
                      {isEditingThisNote ? (
                        <div
                          className="p-3 rounded-2xl border space-y-2"
                          style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}
                        >
                          <textarea
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            placeholder={language === 'es' ? 'Escribe tu nota o reflexión...' : 'Write your reflection...'}
                            rows={2}
                            className="w-full text-xs p-2 rounded-xl border outline-none bg-transparent resize-none"
                            style={{ borderColor: theme.cardBorder, color: theme.text }}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1 rounded-xl text-xs cursor-pointer opacity-70 hover:opacity-100"
                              style={{ color: theme.textMuted }}
                            >
                              {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                              onClick={() => handleSaveNote(fav.id, editingNoteText)}
                              className="px-3.5 py-1 rounded-xl text-xs font-bold cursor-pointer shadow-xs active:scale-95"
                              style={{
                                backgroundColor: theme.accent,
                                color: theme.isDark ? '#000000' : '#FFFFFF',
                              }}
                            >
                              {language === 'es' ? 'Guardar nota' : 'Save note'}
                            </button>
                          </div>
                        </div>
                      ) : fav.personalNote ? (
                        <div
                          className="p-3 rounded-2xl border flex items-start justify-between gap-2.5 text-xs italic"
                          style={{
                            backgroundColor: theme.accentBg + '40',
                            borderColor: theme.accentBorder,
                            color: theme.text,
                          }}
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <Feather className="w-3.5 h-3.5 mt-0.5 text-amber-500 shrink-0" />
                            <span className="font-serif-scripture leading-relaxed">«{fav.personalNote}»</span>
                          </div>
                          <button
                            onClick={() => {
                              setEditingNoteId(fav.id);
                              setEditingNoteText(fav.personalNote || '');
                            }}
                            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer shrink-0 opacity-70 hover:opacity-100"
                            title={language === 'es' ? 'Editar nota' : 'Edit note'}
                          >
                            <Edit3 className="w-3 h-3 text-amber-500" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNoteId(fav.id);
                            setEditingNoteText('');
                          }}
                          className="text-[11px] font-semibold flex items-center gap-1.5 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                          style={{ color: theme.accent }}
                        >
                          <Feather className="w-3 h-3" />
                          <span>{language === 'es' ? '+ Añadir nota de meditación' : '+ Add meditation note'}</span>
                        </button>
                      )}

                      {/* Interactive Guided Meditation Box */}
                      {isMeditatingThis && (
                        <div
                          className="p-4 rounded-2xl border space-y-3 animate-fade-in"
                          style={{
                            backgroundColor: theme.accentBg,
                            borderColor: theme.accentBorder,
                          }}
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-black/5 dark:border-white/5">
                            <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: theme.accent }}>
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>
                                {language === 'es' ? 'Pausa Sagrada de Meditación' : 'Sacred Meditation Pause'}
                              </span>
                            </span>
                            <button
                              onClick={() => setMeditatingVerse(null)}
                              className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                              style={{ color: theme.accent }}
                            >
                              {language === 'es' ? 'Cerrar guía' : 'Close guide'}
                            </button>
                          </div>

                          <div className="space-y-2 text-xs leading-relaxed" style={{ color: theme.text }}>
                            <div className="flex gap-2">
                              <span className="font-bold text-amber-500">1.</span>
                              <p>
                                <strong>{language === 'es' ? 'Respira y silencia el afán:' : 'Breathe and slow down:'}</strong>{' '}
                                {language === 'es'
                                  ? 'Cierra los ojos un momento, afloja los hombros y lee el versículo tres veces en voz baja.'
                                  : 'Take a gentle breath, soften your shoulders, and re-read the verse three times in quiet stillness.'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-bold text-amber-500">2.</span>
                              <p>
                                <strong>{language === 'es' ? 'Pregunta al corazón:' : 'Heart question:'}</strong>{' '}
                                {language === 'es'
                                  ? '¿Qué preocupación, cansancio o dolor te pide Dios que sueltes hoy en Su fidelidad?'
                                  : 'What weight or worry is God inviting you to surrender to His steadfast love today?'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-bold text-amber-500">3.</span>
                              <p>
                                <strong>{language === 'es' ? 'Oración sencilla:' : 'Quiet prayer:'}</strong>{' '}
                                <em>
                                  {language === 'es'
                                    ? '«Señor, guardo esta promesa en mi corazón. Que tu paz gobierne mi mente y mi hogar en este día. Amén.»'
                                    : '«Lord, I hold this promise in my soul. Let Your peace guard my heart and my household today. Amen.»'}
                                </em>
                              </p>
                            </div>
                          </div>

                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => handleSaveVerseToJournal(fav)}
                              className="px-3.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                              style={{
                                backgroundColor: theme.accent,
                                borderColor: theme.accent,
                                color: theme.isDark ? '#000000' : '#FFFFFF',
                              }}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{language === 'es' ? 'Guardar en mi Diario' : 'Save to Journal'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Card Actions Row */}
                      <div
                        className="pt-2 border-t flex items-center justify-between gap-2 flex-wrap"
                        style={{ borderColor: theme.cardBorder }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Navigate to Chapter Button */}
                          <button
                            onClick={() => handleNavigateToVerse(fav.bookId, fav.chapter)}
                            className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: theme.accentBg,
                              borderColor: theme.accentBorder,
                              color: theme.accent,
                            }}
                            title={language === 'es' ? 'Abrir este capítulo en la Biblia' : 'Read this chapter in Bible'}
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{language === 'es' ? 'Ir al capítulo' : 'Read chapter'}</span>
                          </button>

                          {/* Meditate Toggle Button */}
                          <button
                            onClick={() => setMeditatingVerse(isMeditatingThis ? null : fav)}
                            className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: isMeditatingThis ? theme.accent : theme.cardVariant,
                              borderColor: isMeditatingThis ? theme.accent : theme.cardBorder,
                              color: isMeditatingThis ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
                            }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>
                              {language === 'es'
                                ? isMeditatingThis
                                  ? 'Pausar guía'
                                  : 'Meditar'
                                : 'Meditate'}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Copy Button */}
                          <button
                            onClick={() =>
                              handleCopyVerse(
                                language === 'es' ? fav.textEs : fav.textEn,
                                citation,
                                fav.id
                              )
                            }
                            className="p-1.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: theme.cardVariant,
                              borderColor: theme.cardBorder,
                              color: theme.textMuted,
                            }}
                            title={language === 'es' ? 'Copiar versículo' : 'Copy verse'}
                          >
                            {copiedId === fav.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Remove from favorites */}
                          <button
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="p-1.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 text-rose-500 hover:text-rose-600"
                            style={{
                              backgroundColor: theme.cardVariant,
                              borderColor: theme.cardBorder,
                            }}
                            title={language === 'es' ? 'Quitar de favoritos' : 'Remove from favorites'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div
              className="pt-3 border-t flex items-center justify-between text-xs"
              style={{ borderColor: theme.cardBorder }}
            >
              <span className="font-serif-scripture italic" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? '«En mi corazón he guardado tus dichos» — Salmos 119:11'
                  : '«Thy word have I hid in mine heart» — Psalm 119:11'}
              </span>
              <button
                onClick={() => {
                  setShowFavoritesModal(false);
                  setEditingNoteId(null);
                  setMeditatingVerse(null);
                }}
                className="px-4 py-1.5 rounded-xl border font-bold cursor-pointer transition-all hover:scale-102 active:scale-98 shadow-xs"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book, Chapter & Verse Picker Dialog (YouVersion Style Modal) */}
      {showBookPicker && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/85' : 'bg-purple-950/20'
        }`}>
          <div
            className="w-full max-w-xl rounded-3xl p-5 sm:p-7 border shadow-2xl transition-all max-h-[90vh] flex flex-col backdrop-blur-2xl liquid-glass relative"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                  {language === 'es' ? 'Explorar la Santa Biblia' : 'Explore the Holy Bible'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowBookPicker(false);
                  setPickerStep('book');
                  setPickerBookSearch('');
                }}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                style={{ color: theme.textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Step Breadcrumbs (Libro -> Capítulo -> Versículo) */}
            {(() => {
              const activeBook = BIBLE_BOOKS.find((b) => b.id === pickerBookId) || currentBook;
              const activeBookName = language === 'es' ? activeBook.nameEs : activeBook.nameEn;

              return (
                <div className="flex items-center gap-1.5 py-2.5 px-1 border-b text-xs font-bold" style={{ borderColor: theme.cardBorder }}>
                  <button
                    onClick={() => setPickerStep('book')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                      pickerStep === 'book' ? 'shadow-sm scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: pickerStep === 'book' ? theme.accent : theme.cardVariant,
                      borderColor: pickerStep === 'book' ? theme.accent : theme.cardBorder,
                      color: pickerStep === 'book' ? (theme.isDark ? '#000' : '#fff') : theme.text,
                    }}
                  >
                    <span>1. {language === 'es' ? 'Libro' : 'Book'}: {activeBookName}</span>
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />

                  <button
                    onClick={() => setPickerStep('chapter')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                      pickerStep === 'chapter' ? 'shadow-sm scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: pickerStep === 'chapter' ? theme.accent : theme.cardVariant,
                      borderColor: pickerStep === 'chapter' ? theme.accent : theme.cardBorder,
                      color: pickerStep === 'chapter' ? (theme.isDark ? '#000' : '#fff') : theme.text,
                    }}
                  >
                    <span>2. {language === 'es' ? 'Capítulo' : 'Chapter'}: {pickerChapter}</span>
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />

                  <button
                    onClick={() => setPickerStep('verse')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                      pickerStep === 'verse' ? 'shadow-sm scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: pickerStep === 'verse' ? theme.accent : theme.cardVariant,
                      borderColor: pickerStep === 'verse' ? theme.accent : theme.cardBorder,
                      color: pickerStep === 'verse' ? (theme.isDark ? '#000' : '#fff') : theme.text,
                    }}
                  >
                    <span>3. {language === 'es' ? 'Versículo' : 'Verse'}</span>
                  </button>
                </div>
              );
            })()}

            {/* STEP 1: SELECT BOOK (All 66 Books Categorized) */}
            {pickerStep === 'book' && (
              <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3.5">
                {/* Book Search Bar */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={pickerBookSearch}
                    onChange={(e) => setPickerBookSearch(e.target.value)}
                    placeholder={language === 'es' ? 'Buscar entre los 66 libros (Génesis, Mateo, Salmos...)' : 'Search all 66 books...'}
                    className="w-full pl-4 pr-14 py-2 text-xs rounded-2xl border outline-none transition-all shadow-inner"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    }}
                  />
                  <div className="absolute right-2.5 top-1.5 flex gap-1 items-center">
                    {pickerBookSearch && (
                      <button
                        onClick={() => setPickerBookSearch('')}
                        className="p-1 rounded-full opacity-60 hover:opacity-100 transition-colors cursor-pointer"
                        title={language === 'es' ? 'Limpiar' : 'Clear'}
                      >
                        <X className="w-3.5 h-3.5" style={{ color: theme.text }} />
                      </button>
                    )}
                    <div className="p-1 text-amber-500">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Testament Filter Tabs */}
                {!pickerBookSearch && (
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: language === 'es' ? 'Todos los 66 Libros' : 'All 66 Books' },
                      { id: 'ot', label: language === 'es' ? 'Antiguo Testamento (39)' : 'Old Testament (39)' },
                      { id: 'nt', label: language === 'es' ? 'Nuevo Testamento (27)' : 'New Testament (27)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setTestamentFilter(f.id as any)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-98"
                        style={{
                          backgroundColor: testamentFilter === f.id ? theme.accentBg : theme.cardVariant,
                          borderColor: testamentFilter === f.id ? theme.accent : theme.cardBorder,
                          color: testamentFilter === f.id ? theme.accent : theme.textMuted,
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BIBLE_BOOKS.filter((b) => {
                    if (pickerBookSearch.trim()) {
                      const q = pickerBookSearch.toLowerCase();
                      return (
                        b.nameEs.toLowerCase().includes(q) ||
                        b.nameEn.toLowerCase().includes(q) ||
                        b.id.toLowerCase().includes(q)
                      );
                    }
                    if (testamentFilter === 'ot') return b.isOldTestament;
                    if (testamentFilter === 'nt') return !b.isOldTestament;
                    return true;
                  }).map((b) => {
                    const isSelected = b.id === pickerBookId;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setPickerBookId(b.id);
                          setPickerChapter(1);
                          setPickerStep('chapter');
                        }}
                        className="p-3 text-xs font-semibold rounded-2xl border text-left transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-98 flex items-center justify-between"
                        style={{
                          backgroundColor: isSelected ? theme.accentBg : theme.cardVariant,
                          borderColor: isSelected ? theme.accent : theme.cardBorder,
                          color: isSelected ? theme.accent : theme.text,
                        }}
                      >
                        <div className="truncate pr-1">
                          <span className="block font-bold truncate">{language === 'es' ? b.nameEs : b.nameEn}</span>
                          <span className="text-[10px] opacity-60 font-mono">
                            {b.chaptersCount} {language === 'es' ? 'caps.' : 'chs.'}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 uppercase opacity-75">
                          {b.isOldTestament ? 'AT' : 'NT'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT CHAPTER */}
            {pickerStep === 'chapter' && (() => {
              const activeBook = BIBLE_BOOKS.find((b) => b.id === pickerBookId) || currentBook;
              const activeBookName = language === 'es' ? activeBook.nameEs : activeBook.nameEn;

              return (
                <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.accent }}>
                        {activeBookName}
                      </h4>
                      <p className="text-[11px] opacity-60">
                        {language === 'es' ? `Selecciona un capítulo (1 a ${activeBook.chaptersCount}):` : `Select chapter (1 to ${activeBook.chaptersCount}):`}
                      </p>
                    </div>
                    <button
                      onClick={() => setPickerStep('book')}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      ← {language === 'es' ? 'Cambiar libro' : 'Change book'}
                    </button>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
                    {Array.from({ length: activeBook.chaptersCount }, (_, i) => i + 1).map((ch) => {
                      const isCurrent = ch === pickerChapter && activeBook.id === selectedBookId;
                      const isDone = completedChapters.includes(`${activeBook.id}_${ch}`);

                      return (
                        <button
                          key={ch}
                          onClick={() => {
                            setPickerChapter(ch);
                            setPickerStep('verse');
                          }}
                          className="h-12 rounded-2xl border flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                          style={{
                            backgroundColor: isCurrent
                              ? theme.accent
                              : isDone
                              ? theme.accentBg
                              : theme.cardVariant,
                            borderColor: isCurrent ? theme.accent : theme.cardBorder,
                            color: isCurrent
                              ? (theme.isDark ? '#000000' : '#FFFFFF')
                              : isDone
                              ? theme.accent
                              : theme.text,
                          }}
                        >
                          <span className="text-sm font-bold">{ch}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t flex justify-end" style={{ borderColor: theme.cardBorder }}>
                    <button
                      onClick={() => {
                        onSelectLocation(pickerBookId, pickerChapter);
                        setShowBookPicker(false);
                      }}
                      className="px-5 py-2.5 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer flex items-center gap-2 backdrop-blur-md"
                      style={{
                        backgroundColor: theme.accentBg,
                        borderColor: theme.accentBorder,
                        color: theme.accent,
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{language === 'es' ? `Abrir Capítulo ${pickerChapter}` : `Open Chapter ${pickerChapter}`}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* STEP 3: SELECT VERSE (Direct Jump like YouVersion) */}
            {pickerStep === 'verse' && (() => {
              const activeBook = BIBLE_BOOKS.find((b) => b.id === pickerBookId) || currentBook;
              const activeBookName = language === 'es' ? activeBook.nameEs : activeBook.nameEn;
              // Approximate verses count for active book & chapter
              const totalVersesInChapter = pickerBookId === 'MAT' && pickerChapter === 4 ? 25 : pickerBookId === 'PSA' && pickerChapter === 119 ? 176 : pickerBookId === 'PSA' && pickerChapter === 23 ? 6 : 30;

              return (
                <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.accent }}>
                        {activeBookName} {pickerChapter}
                      </h4>
                      <p className="text-[11px] opacity-60">
                        {language === 'es' ? 'Selecciona un versículo para enfocar directamente:' : 'Select verse to jump directly:'}
                      </p>
                    </div>
                    <button
                      onClick={() => setPickerStep('chapter')}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      ← {language === 'es' ? 'Volver a capítulos' : 'Back to chapters'}
                    </button>
                  </div>

                  {/* Read whole chapter button */}
                  <button
                    onClick={() => {
                      onSelectLocation(pickerBookId, pickerChapter);
                      setCurrentReadingVerse(null);
                      setShowBookPicker(false);
                    }}
                    className="w-full py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ borderColor: theme.accentBorder, color: theme.accent }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{language === 'es' ? `Leer todo el Capítulo ${pickerChapter} desde el inicio` : `Read entire Chapter ${pickerChapter} from start`}</span>
                  </button>

                  {/* Verses grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {Array.from({ length: totalVersesInChapter }, (_, i) => i + 1).map((vNum) => (
                      <button
                        key={vNum}
                        onClick={() => {
                          onSelectLocation(pickerBookId, pickerChapter);
                          setCurrentReadingVerse(vNum);
                          setShowBookPicker(false);
                        }}
                        className="h-11 rounded-2xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: vNum === 23 && pickerBookId === 'MAT' && pickerChapter === 4 ? theme.accentBg : theme.cardVariant,
                          borderColor: vNum === 23 && pickerBookId === 'MAT' && pickerChapter === 4 ? theme.accent : theme.cardBorder,
                          color: vNum === 23 && pickerBookId === 'MAT' && pickerChapter === 4 ? theme.accent : theme.text,
                        }}
                      >
                        v.{vNum}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Floating Scroll to Top button for long chapters */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-5 z-40 px-3 py-2 rounded-full border shadow-2xl backdrop-blur-xl transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-amber-500/20"
          style={{
            backgroundColor: theme.accent,
            color: theme.isDark ? '#000000' : '#FFFFFF',
            borderColor: theme.accentBorder
          }}
          title={language === 'es' ? 'Volver arriba' : 'Scroll to top'}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{language === 'es' ? 'Arriba' : 'Top'}</span>
        </button>
      )}
    </div>
  );
});

export default BibleScreen;
