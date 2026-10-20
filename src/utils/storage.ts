import {
  FavoriteVerse,
  HavahTab,
  JournalEntry,
  Language,
  PersonalPrayerItem,
  PrayerCommunityItem,
  ResourceComment,
  SharedResourceItem,
  UserProfile,
  VerseAnnotation,
} from '../types';
import { COMMUNITY_PRAYERS } from '../data/havahData';

const KEYS = {
  JOURNAL: 'havah_journal_entries',
  PERSONAL_PRAYERS: 'havah_personal_prayers',
  COMMUNITY_PRAYERS: 'havah_community_prayers',
  RESOURCE_COMMENTS: 'havah_resource_comments',
  USER_RESOURCES: 'havah_user_resources',
  ANNOTATIONS: 'havah_verse_annotations',
  COMPLETED_CHAPTERS: 'havah_completed_chapters',
  STREAK: 'havah_reading_streak',
  FAVORITES: 'havah_favorite_verses',
  THEME: 'havah_theme_is_dark',
  LANGUAGE: 'havah_language',
};

let inMemoryTheme: boolean | null = null;
let inMemoryTab: HavahTab | null = null;
let inMemoryBibleLoc: { bookId: string; chapter: number } | null = null;

export const storage = {
  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(KEYS.JOURNAL);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading journal entries', e);
    }
    return [];
  },

  saveJournalEntries(entries: JournalEntry[]) {
    try {
      localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
    } catch (e) {
      console.error('Error saving journal entries', e);
    }
  },

  getPersonalPrayers(): PersonalPrayerItem[] {
    try {
      const data = localStorage.getItem(KEYS.PERSONAL_PRAYERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading personal prayers', e);
    }
    return [];
  },

  savePersonalPrayers(prayers: PersonalPrayerItem[]) {
    try {
      localStorage.setItem(KEYS.PERSONAL_PRAYERS, JSON.stringify(prayers));
    } catch (e) {
      console.error('Error saving personal prayers', e);
    }
  },

  getCommunityPrayers(): PrayerCommunityItem[] {
    try {
      const data = localStorage.getItem(KEYS.COMMUNITY_PRAYERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading community prayers', e);
    }
    return COMMUNITY_PRAYERS;
  },

  saveCommunityPrayers(prayers: PrayerCommunityItem[]) {
    try {
      localStorage.setItem(KEYS.COMMUNITY_PRAYERS, JSON.stringify(prayers));
    } catch (e) {
      console.error('Error saving community prayers', e);
    }
  },

  getResourceComments(resourceId: string, language: Language = 'es'): ResourceComment[] {
    try {
      const data = localStorage.getItem(`${KEYS.RESOURCE_COMMENTS}_${resourceId}`);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading resource comments', e);
    }

    if (language === 'en') {
      const defaultsMapEn: Record<string, ResourceComment[]> = {
        res_1: [
          {
            id: 'c1',
            resourceId: 'res_1',
            author: 'Sophia M.',
            content: 'Such a blessed guide. I came home from work with my mind racing, and reading this before bed restored my breath and peace.',
            timestamp: Date.now() - 3600000 * 4,
            likes: 14,
          },
          {
            id: 'c2',
            resourceId: 'res_1',
            author: 'Carmen Elena',
            content: 'The phrase "God never slumbers so you can truly rest" touched my heart so deeply. Thank you for this gorgeous reminder.',
            timestamp: Date.now() - 3600000 * 18,
            likes: 23,
          },
        ],
        res_2: [
          {
            id: 'c3',
            resourceId: 'res_2',
            author: 'Valentina R.',
            content: 'Listened to the audio while having morning coffee. The gentle voice and Psalm 23 brought tears of pure relief. God is so faithful.',
            timestamp: Date.now() - 3600000 * 8,
            likes: 31,
          },
        ],
        res_3: [
          {
            id: 'c4',
            resourceId: 'res_3',
            author: 'Deborah K.',
            content: 'I always struggled with fasting without feeling guilty. This perspective of fasting from complaint and blessing my home truly transformed me.',
            timestamp: Date.now() - 3600000 * 12,
            likes: 19,
          },
        ],
        res_4: [
          {
            id: 'c5',
            resourceId: 'res_4',
            author: 'Mariana P.',
            content: 'Finally a study on Proverbs 31 that does not make us feel inadequate! I felt so wrapped in the Lord\'s love. Shared it with my sisters right away.',
            timestamp: Date.now() - 3600000 * 2,
            likes: 42,
          },
        ],
      };

      return defaultsMapEn[resourceId] || [
        {
          id: `c_default_${resourceId}`,
          resourceId,
          author: 'Sister in Faith',
          content: 'This resource arrived right when I needed to hear God\'s voice. Such a wonderful encouragement!',
          timestamp: Date.now() - 3600000 * 6,
          likes: 9,
        },
      ];
    }

    // Default warm seed comments in Spanish
    const defaultsMap: Record<string, ResourceComment[]> = {
      res_1: [
        {
          id: 'c1',
          resourceId: 'res_1',
          author: 'Sofía M.',
          content: 'Qué bendición esta guía. Llegaba de la oficina con la cabeza a mil por hora y leer esto antes de acostarme me devolvió la respiración y la paz.',
          timestamp: Date.now() - 3600000 * 4,
          likes: 14,
        },
        {
          id: 'c2',
          resourceId: 'res_1',
          author: 'Carmen Elena',
          content: 'Me tocó el corazón la frase: «Dios no duerme para que tú puedas descansar». Cuántas noches pasamos afanadas. Gracias por este recordatorio tan hermoso.',
          timestamp: Date.now() - 3600000 * 18,
          likes: 23,
        },
      ],
      res_2: [
        {
          id: 'c3',
          resourceId: 'res_2',
          author: 'Valentina R.',
          content: 'Escuché el audio mientras me tomaba un café por la mañana. La voz, la música suave y el Salmo 23 me hicieron llorar de puro alivio. Dios es fiel.',
          timestamp: Date.now() - 3600000 * 8,
          likes: 31,
        },
      ],
      res_3: [
        {
          id: 'c4',
          resourceId: 'res_3',
          author: 'Débora K.',
          content: 'Siempre me costaba entender el ayuno sin sentir culpa o hambre amarga. Esta perspectiva de ayunar de la queja y bendecir la casa me transformó.',
          timestamp: Date.now() - 3600000 * 12,
          likes: 19,
        },
      ],
      res_4: [
        {
          id: 'c5',
          resourceId: 'res_4',
          author: 'Mariana P.',
          content: '¡Al fin un estudio de Proverbios 31 que no nos hace sentir insuficientes! Me sentí tan abrazada por el amor del Señor. Ya se lo compartí a mis hermanas.',
          timestamp: Date.now() - 3600000 * 2,
          likes: 42,
        },
      ],
    };

    return defaultsMap[resourceId] || [
      {
        id: `c_default_${resourceId}`,
        resourceId,
        author: 'Hermana en la Fe',
        content: 'Este recurso llegó justo en el momento en que más necesitaba escuchar la voz de Dios. ¡Qué hermoso estudio!',
        timestamp: Date.now() - 3600000 * 6,
        likes: 9,
      },
    ];
  },

  saveResourceComments(resourceId: string, comments: ResourceComment[]) {
    try {
      localStorage.setItem(`${KEYS.RESOURCE_COMMENTS}_${resourceId}`, JSON.stringify(comments));
    } catch (e) {
      console.error('Error saving resource comments', e);
    }
  },

  addResourceComment(resourceId: string, author: string, content: string): ResourceComment {
    const comments = this.getResourceComments(resourceId);
    const newComment: ResourceComment = {
      id: 'c_' + Date.now(),
      resourceId,
      author: author.trim() || 'Anónima',
      content: content.trim(),
      timestamp: Date.now(),
      likes: 1,
      userLiked: true,
    };
    const updated = [newComment, ...comments];
    this.saveResourceComments(resourceId, updated);
    return newComment;
  },

  toggleCommentLike(resourceId: string, commentId: string): ResourceComment[] {
    const comments = this.getResourceComments(resourceId);
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const isLiked = !c.userLiked;
        return {
          ...c,
          userLiked: isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      }
      return c;
    });
    this.saveResourceComments(resourceId, updated);
    return updated;
  },

  getUserResources(): SharedResourceItem[] {
    try {
      const data = localStorage.getItem(KEYS.USER_RESOURCES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading user resources', e);
    }
    return [];
  },

  addUserResource(resource: SharedResourceItem): SharedResourceItem[] {
    const list = this.getUserResources();
    const updated = [resource, ...list];
    try {
      localStorage.setItem(KEYS.USER_RESOURCES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving user resource', e);
    }
    return updated;
  },

  getAnnotations(): VerseAnnotation[] {
    try {
      const data = localStorage.getItem(KEYS.ANNOTATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading annotations', e);
    }
    return [];
  },

  saveAnnotations(annotations: VerseAnnotation[]) {
    try {
      localStorage.setItem(KEYS.ANNOTATIONS, JSON.stringify(annotations));
    } catch (e) {
      console.error('Error saving annotations', e);
    }
  },

  getCompletedChapters(): string[] {
    try {
      const data = localStorage.getItem(KEYS.COMPLETED_CHAPTERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading completed chapters', e);
    }
    return [];
  },

  saveCompletedChapters(chapters: string[]) {
    try {
      localStorage.setItem(KEYS.COMPLETED_CHAPTERS, JSON.stringify(chapters));
    } catch (e) {
      console.error('Error saving completed chapters', e);
    }
  },

  getReadingStreak(): number {
    try {
      const data = localStorage.getItem(KEYS.STREAK);
      if (data) return parseInt(data, 10);
    } catch (e) {
      console.error('Error reading streak', e);
    }
    return 1;
  },

  saveReadingStreak(streak: number) {
    try {
      localStorage.setItem(KEYS.STREAK, streak.toString());
    } catch (e) {
      console.error('Error saving streak', e);
    }
  },

  getFavoriteVerses(): FavoriteVerse[] {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading favorite verses', e);
    }
    return [];
  },

  saveFavoriteVerses(verses: FavoriteVerse[]) {
    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(verses));
    } catch (e) {
      console.error('Error saving favorite verses', e);
    }
  },

  isVerseFavorite(bookId: string, chapter: number, verseNumber: number): boolean {
    const id = `${bookId}_${chapter}_${verseNumber}`;
    return this.getFavoriteVerses().some((v) => v.id === id);
  },

  toggleFavoriteVerse(
    verse: {
      bookId: string;
      bookNameEs: string;
      bookNameEn: string;
      chapter: number;
      verseNumber: number;
      textEs: string;
      textEn: string;
    },
    note?: string,
    category?: string
  ): { isFavorite: boolean; favorites: FavoriteVerse[] } {
    const favorites = this.getFavoriteVerses();
    const id = `${verse.bookId}_${verse.chapter}_${verse.verseNumber}`;
    const exists = favorites.some((v) => v.id === id);

    let updated: FavoriteVerse[];
    if (exists) {
      updated = favorites.filter((v) => v.id !== id);
    } else {
      const newFav: FavoriteVerse = {
        id,
        bookId: verse.bookId,
        bookNameEs: verse.bookNameEs,
        bookNameEn: verse.bookNameEn,
        chapter: verse.chapter,
        verseNumber: verse.verseNumber,
        textEs: verse.textEs,
        textEn: verse.textEn,
        timestamp: Date.now(),
        personalNote: note,
        category: category || 'Paz',
      };
      updated = [newFav, ...favorites];
    }
    this.saveFavoriteVerses(updated);
    return { isFavorite: !exists, favorites: updated };
  },

  removeFavoriteVerse(id: string): FavoriteVerse[] {
    const favorites = this.getFavoriteVerses().filter((v) => v.id !== id);
    this.saveFavoriteVerses(favorites);
    return favorites;
  },

  updateFavoriteNote(id: string, note: string): FavoriteVerse[] {
    const favorites = this.getFavoriteVerses().map((v) => (v.id === id ? { ...v, personalNote: note } : v));
    this.saveFavoriteVerses(favorites);
    return favorites;
  },

  getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem('havah_user_profile');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading profile', e);
    }
    return null;
  },

  saveUserProfile(profile: UserProfile) {
    try {
      localStorage.setItem('havah_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile', e);
    }
  },

  getTheme(): boolean {
    if (inMemoryTheme !== null) return inMemoryTheme;
    try {
      // Check if user has explicitly confirmed their choice in current session/version
      const inflightApplied = localStorage.getItem('havah_theme_inflight_default_v1');
      if (!inflightApplied) {
        // First load of Inflight Sky update: automatically activate Day Mode!
        localStorage.setItem('havah_theme_inflight_default_v1', 'true');
        localStorage.setItem(KEYS.THEME, JSON.stringify(false));
        inMemoryTheme = false;
        return false;
      }

      const data = localStorage.getItem(KEYS.THEME);
      if (data !== null) {
        const val = JSON.parse(data);
        inMemoryTheme = val;
        return val;
      }
    } catch (e) {
      console.error('Error reading theme', e);
    }
    // Default to false (Day Mode - Inflight Sky)
    inMemoryTheme = false;
    return false;
  },

  saveTheme(isDark: boolean) {
    inMemoryTheme = isDark;
    try {
      localStorage.setItem('havah_theme_inflight_default_v1', 'true');
      localStorage.setItem(KEYS.THEME, JSON.stringify(isDark));
    } catch (e) {
      console.error('Error saving theme', e);
    }
  },

  getCurrentTab(): HavahTab {
    if (inMemoryTab !== null) return inMemoryTab;
    try {
      const data = localStorage.getItem('havah_current_tab') as HavahTab;
      if (data && ['inicio', 'biblia', 'estudios', 'comunidad', 'dialogo', 'diario'].includes(data)) {
        inMemoryTab = data;
        return data;
      }
    } catch (e) {
      console.error('Error reading current tab', e);
    }
    inMemoryTab = 'inicio';
    return 'inicio';
  },

  saveCurrentTab(tab: HavahTab) {
    inMemoryTab = tab;
    try {
      localStorage.setItem('havah_current_tab', tab);
    } catch (e) {
      console.error('Error saving current tab', e);
    }
  },

  getBibleLocation(): { bookId: string; chapter: number } {
    if (inMemoryBibleLoc !== null) return inMemoryBibleLoc;
    try {
      const data = localStorage.getItem('havah_bible_location');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.bookId && parsed.chapter) {
          inMemoryBibleLoc = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading bible location', e);
    }
    const defaultLoc = { bookId: 'MAT', chapter: 4 };
    inMemoryBibleLoc = defaultLoc;
    return defaultLoc;
  },

  saveBibleLocation(bookId: string, chapter: number) {
    const loc = { bookId, chapter };
    inMemoryBibleLoc = loc;
    try {
      localStorage.setItem('havah_bible_location', JSON.stringify(loc));
    } catch (e) {
      console.error('Error saving bible location', e);
    }
  },

  getFontSize(): number {
    try {
      const data = localStorage.getItem('havah_font_size');
      if (data) return parseInt(data, 10);
    } catch (e) {
      console.error('Error reading font size', e);
    }
    return 18;
  },

  saveFontSize(size: number) {
    try {
      localStorage.setItem('havah_font_size', size.toString());
    } catch (e) {
      console.error('Error saving font size', e);
    }
  },

  getLanguage(): Language {
    try {
      const data = localStorage.getItem(KEYS.LANGUAGE) as Language;
      if (data && (data === 'es' || data === 'en')) return data;
    } catch (e) {
      console.error('Error reading language', e);
    }
    return 'es';
  },

  saveLanguage(lang: Language) {
    try {
      localStorage.setItem(KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Error saving language', e);
    }
  },

  getDaySkyStyle(): 'sparkles' | 'dreamy' | 'harmonized' {
    try {
      const data = localStorage.getItem('havah_day_sky_style');
      if (data === 'sparkles' || data === 'dreamy' || data === 'harmonized') return data;
    } catch (e) {
      console.error('Error reading day sky style', e);
    }
    return 'harmonized';
  },

  saveDaySkyStyle(style: 'sparkles' | 'dreamy' | 'harmonized') {
    try {
      localStorage.setItem('havah_day_sky_style', style);
    } catch (e) {
      console.error('Error saving day sky style', e);
    }
  },
};
