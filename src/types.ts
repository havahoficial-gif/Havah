export type Language = 'es' | 'en';

export type MoodType = 'peace' | 'gratitude' | 'anxious' | 'tired' | 'grief' | 'seeking';

export interface MoodConfig {
  id: MoodType;
  labelEs: string;
  labelEn: string;
  scriptureAnchorEs: string;
  scriptureAnchorEn: string;
  colorHex: string;
}

export interface BibleBook {
  id: string;
  nameEs: string;
  nameEn: string;
  isOldTestament: boolean;
  chaptersCount: number;
}

export interface BibleVerse {
  bookId: string;
  bookNameEs: string;
  bookNameEn: string;
  chapter: number;
  verseNumber: number;
  textEs: string;
  textEn: string;
}

export interface FavoriteVerse {
  id: string; // `${bookId}_${chapter}_${verseNumber}`
  bookId: string;
  bookNameEs: string;
  bookNameEn: string;
  chapter: number;
  verseNumber: number;
  textEs: string;
  textEn: string;
  timestamp: number;
  personalNote?: string;
  category?: string;
}

export interface Devotional {
  id: string;
  titleEs: string;
  titleEn: string;
  passageRefEs: string;
  passageRefEn: string;
  passageTextEs: string;
  passageTextEn: string;
  reflectionEs: string;
  reflectionEn: string;
  prayerEs: string;
  prayerEn: string;
  moodCategory: MoodType;
  topic: string;
  dayOfYear?: number;
  dateFormattedEs?: string;
  dateFormattedEn?: string;
}

export interface StreakMilestone {
  daysRequired: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  badgeIconName: string;
}

export interface SeminarLesson {
  id: string;
  order: number;
  titleEs: string;
  titleEn: string;
  focusEs: string;
  focusEn: string;
  scriptures: string[];
  practiceEs: string;
  practiceEn: string;
  finalPromptEs: string;
  finalPromptEn: string;
}

export interface SeminarCourse {
  id: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  levelEs: string;
  levelEn: string;
  hoursEstimated: number;
  lessonCount: number;
  topics: string[];
  descriptionEs: string;
  descriptionEn: string;
  bibliography: string[];
  lessons: SeminarLesson[];
  imageUrl?: string;
}

export interface LivePrayerRoom {
  id: string;
  titleEs: string;
  titleEn: string;
  hostName: string;
  descriptionEs: string;
  descriptionEn: string;
  activeCount: number;
  maxCapacity: number;
  isLive: boolean;
  type: string;
  scriptureFocus: string;
}

export interface PrayerCommunityItem {
  id: string;
  author: string;
  titleEs: string;
  titleEn: string;
  contentEs: string;
  contentEn: string;
  topic: string;
  candlesLit: number;
  timestampLabelEs: string;
  timestampLabelEn: string;
  isReported?: boolean;
  userIsStandingInTheGap?: boolean;
  lastBlessingVerse?: string | null;
}

export interface SharedResourceItem {
  id: string;
  titleEs: string;
  titleEn: string;
  type: 'PDF' | 'Audio' | 'Video' | 'Ayuno' | 'Guía';
  durationEs: string;
  durationEn: string;
  descriptionEs: string;
  descriptionEn: string;
  biblicalAnchor: string;
  fullContentEs: string;
  fullContentEn: string;
  practicalStepsEs: string[];
  practicalStepsEn: string[];
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  videoDuration?: string;
  sisterTakeawayEs?: string;
  sisterTakeawayEn?: string;
  shareableQuote?: string;
  reactionTags?: string[];
}

export interface ResourceComment {
  id: string;
  resourceId: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  userLiked?: boolean;
}

export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  moodId: MoodType;
  scriptureRef?: string;
  timestamp: number;
}

export interface PersonalPrayerItem {
  id: string;
  title: string;
  description?: string;
  isAnswered: boolean;
  timestamp: number;
}

export interface VerseAnnotation {
  bookId: string;
  chapter: number;
  verseNumber: number;
  colorHex: string;
  personalNote: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  email?: string;
  avatarBadge: string;
  securityPin?: string;
  isAnonymous: boolean;
  createdAt: number;
}

export type HavahTab = 'inicio' | 'biblia' | 'estudios' | 'comunidad' | 'dialogo' | 'diario';
