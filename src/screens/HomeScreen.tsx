import React, { useState, useEffect } from 'react';
import {
  Flame,
  BookOpen,
  ArrowRight,
  Sparkles,
  Wind,
  Share2,
  Mic,
  Volume2,
  Heart,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { Devotional, Language, MoodType } from '../types';
import { ThemeColors } from '../theme';
import { MoodSelector } from '../components/MoodSelector';
import { DailyPrayerCard } from '../components/DailyPrayerCard';
import { getTodayPromise, getDailyRecord, getDayOfYear, DailyPromiseEntry } from '../data/dailyCalendarData';
import { speechEngine } from '../utils/speechEngine';
import { triggerHaptic } from '../utils/haptics';

interface HomeScreenProps {
  language: Language;
  theme: ThemeColors;
  selectedMood: MoodType;
  devotional: Devotional;
  targetDay?: number;
  onSelectDay?: (day: number) => void;
  readingStreak: number;
  readingProgress: number;
  onSelectMood: (mood: MoodType) => void;
  onContinueReading: (bookId: string, chapter: number) => void;
  onOpenStreakDialog: () => void;
  onOpenBreathingPause: () => void;
  onOpenShareCard: () => void;
  onOpenGodPromises?: () => void;
  onOpenVoicePrayer?: () => void;
  onOpenHavahPlus?: () => void;
}

// Envuelve en « » sin duplicar comillas que ya vengan en el texto.
const quoted = (t?: string): string => {
  const clean = (t ?? '').trim().replace(/^«+\s*/, '').replace(/\s*»+$/, '');
  return `«${clean}»`;
};

export const HomeScreen: React.FC<HomeScreenProps> = React.memo(({
  language,
  theme,
  selectedMood,
  devotional,
  targetDay,
  onSelectDay,
  readingStreak,
  readingProgress,
  onSelectMood,
  onContinueReading,
  onOpenStreakDialog,
  onOpenBreathingPause,
  onOpenShareCard,
  onOpenGodPromises,
  onOpenVoicePrayer,
  onOpenHavahPlus,
}) => {
  const [isSpeakingDevotional, setIsSpeakingDevotional] = useState(false);
  const [isSpeakingPromise, setIsSpeakingPromise] = useState(false);
  const [claimedPromise, setClaimedPromise] = useState(false);

  const currentDayNum = targetDay || getDayOfYear();
  const todayRealDay = getDayOfYear();
  const isToday = currentDayNum === todayRealDay;
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  const totalDaysInYear = isLeapYear ? 366 : 365;
  const dailyRecord = getDailyRecord(currentDayNum);
  const dailyPromise: DailyPromiseEntry = getTodayPromise(currentDayNum);

  // Deferred neural audio caching during idle time (prevents startup network congestion)
  useEffect(() => {
    let idleTimer: any;
    const runDeferred = () => {
      const promiseText = language === 'es'
        ? `Promesa de Dios para hoy: ${dailyPromise.categoryEs}. ${dailyPromise.verseRefEs}: ${dailyPromise.passageEs}. Meditación: ${dailyPromise.meditationEs}. Declaración de fe: ${dailyPromise.declarationEs}`
        : `God’s Promise for today: ${dailyPromise.categoryEn}. ${dailyPromise.verseRefEn}: ${dailyPromise.passageEn}. Meditation: ${dailyPromise.meditationEn}. Declaration: ${dailyPromise.declarationEn}`;
      speechEngine.preload(promiseText, undefined, language);

      const devText = language === 'es'
        ? `${devotional.titleEs}. Pasaje: ${devotional.passageRefEs}. ${devotional.passageTextEs}. Reflexión: ${devotional.reflectionEs}. Oración: ${devotional.prayerEs}`
        : `${devotional.titleEn}. Passage: ${devotional.passageRefEn}. ${devotional.passageTextEn}. Reflection: ${devotional.reflectionEn}. Prayer: ${devotional.prayerEn}`;
      speechEngine.preload(devText, undefined, language);
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        idleTimer = (window as any).requestIdleCallback(runDeferred, { timeout: 3000 });
      } else {
        idleTimer = setTimeout(runDeferred, 1500);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        if ('cancelIdleCallback' in window && typeof idleTimer === 'number') {
          (window as any).cancelIdleCallback(idleTimer);
        } else {
          clearTimeout(idleTimer);
        }
      }
    };
  }, [currentDayNum, language]);

  const handleNavigateDay = (delta: number) => {
    triggerHaptic('light');
    if (!onSelectDay) return;
    let nextDay = currentDayNum + delta;
    if (nextDay < 1) nextDay = totalDaysInYear;
    if (nextDay > totalDaysInYear) nextDay = 1;
    onSelectDay(nextDay);
  };

  const handleGoToToday = () => {
    triggerHaptic('success');
    if (onSelectDay) {
      onSelectDay(todayRealDay);
    }
  };

  const handleToggleSpeakPromise = () => {
    triggerHaptic('light');
    if (isSpeakingPromise) {
      speechEngine.stop();
      setIsSpeakingPromise(false);
    } else {
      setIsSpeakingPromise(true);
      const text = language === 'es'
        ? `Promesa de Dios para hoy: ${dailyPromise.categoryEs}. ${dailyPromise.verseRefEs}: ${dailyPromise.passageEs}. Meditación: ${dailyPromise.meditationEs}. Declaración de fe: ${dailyPromise.declarationEs}`
        : `God’s Promise for today: ${dailyPromise.categoryEn}. ${dailyPromise.verseRefEn}: ${dailyPromise.passageEn}. Meditation: ${dailyPromise.meditationEn}. Declaration: ${dailyPromise.declarationEn}`;
      speechEngine.speak({
        text,
        language,
        onEnd: () => setIsSpeakingPromise(false),
        onError: () => setIsSpeakingPromise(false),
      });
    }
  };

  const handleClaimPromise = () => {
    triggerHaptic('success');
    setClaimedPromise(true);
    setTimeout(() => setClaimedPromise(false), 3000);
  };

  const handleSharePromise = async () => {
    triggerHaptic('light');
    const shareText = `HAVAH • Promesa de Dios para Hoy (${dailyRecord.dateFormattedEs})\n\n«${dailyPromise.categoryEs}»\n${dailyPromise.verseRefEs}: ${dailyPromise.passageEs}\n\nMeditación: ${dailyPromise.meditationEs}\n\nDeclaración de fe: ${dailyPromise.declarationEs}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Promesa de Dios: ${dailyPromise.categoryEs}`,
          text: shareText,
        });
        return;
      } catch {
        // Fallback
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // ignore
    }
  };

  const handleToggleSpeakDevotional = () => {
    triggerHaptic('light');
    if (isSpeakingDevotional) {
      speechEngine.stop();
      setIsSpeakingDevotional(false);
    } else {
      setIsSpeakingDevotional(true);
      const textToSpeak = language === 'es'
        ? `${devotional.titleEs}. Pasaje: ${devotional.passageRefEs}. ${devotional.passageTextEs}. Reflexión: ${devotional.reflectionEs}. Oración: ${devotional.prayerEs}`
        : `${devotional.titleEn}. Passage: ${devotional.passageRefEn}. ${devotional.passageTextEn}. Reflection: ${devotional.reflectionEn}. Prayer: ${devotional.prayerEn}`;

      speechEngine.speak({
        text: textToSpeak,
        language,
        onEnd: () => setIsSpeakingDevotional(false),
        onError: () => setIsSpeakingDevotional(false),
      });
    }
  };

  return (
    <div className="pb-20 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 items-start">
      {/* Left Column: Core Devotional & Reading (spans 7 cols on lg, 8 cols on xl) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-5">
        {/* 1. Mood Check-in Bar (Liquid Glass) */}
        <MoodSelector
          selectedMood={selectedMood}
          language={language}
          theme={theme}
          progress={readingProgress}
          onSelectMood={onSelectMood}
        />

        {/* 2. Oración del Día con Contador / Temporizador de Pausa Guiada */}
        <DailyPrayerCard language={language} theme={theme} targetDay={currentDayNum} />

        {/* 3. "Tu pausa con la Palabra" (Liquid Glass Card) */}
        <div
          className="rounded-3xl p-5.5 border transition-all duration-300 shadow-xl backdrop-blur-2xl liquid-glass"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.accentBorder}`,
                }}
              >
                <BookOpen className="w-4.5 h-4.5" style={{ color: theme.accent }} />
              </div>
              <div>
                <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {language === 'es' ? 'Tu pausa con la Palabra' : 'Your quiet pause with Scripture'}
                </h3>
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl border shadow-sm"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.accent,
                borderColor: theme.accentBorder,
              }}
            >
              Salmos 23
            </span>
          </div>

          {/* Verse Highlight Card (Liquid Glass subtle) */}
          <div
            className="p-4.5 rounded-2xl border mb-4 liquid-glass-subtle"
            style={{
              borderColor: theme.cardBorder,
            }}
          >
            <p
              className="font-serif-scripture italic text-base sm:text-lg font-medium leading-relaxed"
              style={{ color: theme.text }}
            >
              «Jehová es mi pastor; nada me faltará. Me hace descansar en verdes campos y me guía junto a aguas tranquilas...»
            </p>
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5 dark:border-white/5">
              <span
                className="text-xs font-bold"
                style={{ color: theme.accent }}
              >
                Salmos 23:1-2 · Español Sencillo
              </span>
              <span className="text-xs" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Tiempo de lectura: 2 min' : 'Read time: 2 min'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onContinueReading('PSA', 23)}
            className="w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 btn-holographic"
          >
            <span>{language === 'es' ? 'Continuar lectura bíblica' : 'Continue reading Scripture'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Devocional del Día (Liquid Glass Card) */}
        <div
          className="rounded-3xl p-5.5 border transition-all duration-300 shadow-xl backdrop-blur-2xl liquid-glass"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
          }}
        >
          {/* Calendar Day Header & Navigation */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: theme.accent }}>
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{dailyRecord.dateFormattedEs || devotional.dateFormattedEs}</span>
              <span className="counter-badge-holographic text-[10px] font-semibold ml-1">
                {language === 'es' ? 'Día' : 'Day'} <span className="font-bold" style={{ color: theme.accent }}>{currentDayNum}</span> / {totalDaysInYear}
              </span>
            </div>

            {/* Day Switcher Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNavigateDay(-1)}
                className="p-1 rounded-lg border transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                  color: theme.accent,
                }}
                title={language === 'es' ? 'Día anterior' : 'Previous day'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {!isToday && (
                <button
                  onClick={handleGoToToday}
                  className="px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 btn-holographic-pill"
                  style={{
                    color: theme.accent,
                  }}
                >
                  {language === 'es' ? 'Hoy' : 'Today'}
                </button>
              )}

              <button
                onClick={() => handleNavigateDay(1)}
                className="p-1 rounded-lg border transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                  color: theme.accent,
                }}
                title={language === 'es' ? 'Día siguiente' : 'Next day'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-xl border shadow-sm"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.accent,
                borderColor: theme.accentBorder,
              }}
            >
              {language === 'es' ? 'Reflexión para hoy' : 'Today’s Devotional'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSpeakDevotional}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isSpeakingDevotional ? 'ring-2 ring-cyan-400' : ''
                }`}
                style={{
                  backgroundColor: isSpeakingDevotional ? theme.accentBg : theme.isDark ? 'rgba(21, 34, 56, 0.6)' : 'rgba(255, 255, 255, 0.65)',
                  borderColor: isSpeakingDevotional ? theme.accent : theme.cardBorder,
                  color: theme.accent,
                  backdropFilter: 'blur(8px)',
                }}
                title={language === 'es' ? 'Escuchar Devocional con Voz Humana' : 'Listen with Human Voice'}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {isSpeakingDevotional
                    ? (language === 'es' ? 'Detener' : 'Stop')
                    : (language === 'es' ? 'Escuchar' : 'Listen')}
                </span>
              </button>

              <button
                onClick={onOpenShareCard}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: theme.isDark ? 'rgba(21, 34, 56, 0.6)' : 'rgba(255, 255, 255, 0.65)',
                  borderColor: theme.cardBorder,
                  color: theme.accent,
                  backdropFilter: 'blur(8px)',
                }}
                title={language === 'es' ? 'Compartir tarjeta' : 'Share card'}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Compartir' : 'Share'}</span>
              </button>
            </div>
          </div>

          <h3
            className="font-serif-scripture font-bold text-xl sm:text-2xl mb-1.5 leading-snug"
            style={{ color: theme.text }}
          >
            {language === 'es' ? devotional.titleEs : devotional.titleEn}
          </h3>

          {/* Passage Ref in high contrast dark bronze, NOT yellow in day mode */}
          <p
            className="text-xs font-semibold mb-3.5 tracking-wide"
            style={{ color: theme.accent }}
          >
            {language === 'es' ? devotional.passageRefEs : devotional.passageRefEn}
          </p>

          <div
            className="p-4.5 rounded-2xl border mb-3.5 liquid-glass-subtle"
            style={{
              borderColor: theme.cardBorder,
            }}
          >
            <p
              className="font-serif-scripture italic text-base sm:text-lg leading-relaxed font-medium"
              style={{ color: theme.text }}
            >
              {quoted(language === 'es' ? devotional.passageTextEs : devotional.passageTextEn)}
            </p>
          </div>

          <p
            className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line font-normal"
            style={{ color: theme.textSecondary }}
          >
            {language === 'es' ? devotional.reflectionEs : devotional.reflectionEn}
          </p>

          {/* Heart Prayer */}
          <div
            className="p-4.5 rounded-2xl border liquid-glass-subtle"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <p
              className="text-xs font-bold mb-1.5 uppercase tracking-wider"
              style={{ color: theme.accent }}
            >
              {language === 'es' ? 'Oración para tu corazón:' : 'A prayer for your heart:'}
            </p>
            <p
              className="text-sm sm:text-base font-serif-scripture italic leading-relaxed font-medium"
              style={{ color: theme.text }}
            >
              {language === 'es' ? devotional.prayerEs : devotional.prayerEn}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Promesa de Dios, Pausa Serena y Racha (spans 5 cols on lg, 4 cols on xl) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-5">
        {/* Promesa de Dios para Hoy (Liquid Glass Card) */}
        <div
          className="rounded-3xl p-5 border transition-all duration-300 shadow-xl backdrop-blur-2xl liquid-glass space-y-3.5 relative overflow-hidden"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs border shrink-0"
                style={{
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                }}
              >
                <Sparkles className="w-4.5 h-4.5" style={{ color: theme.accent }} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border whitespace-nowrap"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accent,
                      borderColor: theme.accentBorder,
                    }}
                  >
                    {language === 'es' ? 'Promesa de Hoy' : 'Today’s Promise'}
                  </span>
                  <span className="text-[10px] whitespace-nowrap" style={{ color: theme.textMuted }}>
                    {dailyRecord.dateFormattedEs}
                  </span>
                </div>
                <h4 className="text-base font-serif-scripture font-bold mt-1" style={{ color: theme.text }}>
                  {language === 'es' ? dailyPromise.categoryEs : dailyPromise.categoryEn}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleSpeakPromise}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isSpeakingPromise ? 'ring-2 ring-cyan-400 animate-pulse' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: isSpeakingPromise ? theme.accentBg : theme.isDark ? 'rgba(21, 34, 56, 0.6)' : 'rgba(255, 255, 255, 0.65)',
                  borderColor: isSpeakingPromise ? theme.accent : theme.cardBorder,
                  color: theme.accent,
                }}
                title={language === 'es' ? 'Escuchar promesa' : 'Listen to promise'}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleSharePromise}
                className="p-1.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.isDark ? 'rgba(21, 34, 56, 0.6)' : 'rgba(255, 255, 255, 0.65)',
                  borderColor: theme.cardBorder,
                  color: theme.textMuted,
                }}
                title={language === 'es' ? 'Compartir promesa' : 'Share promise'}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scripture Passage */}
          <div
            className="p-4 rounded-2xl border liquid-glass-subtle space-y-1.5"
            style={{ borderColor: theme.cardBorder }}
          >
            <span className="text-xs font-bold" style={{ color: theme.accent }}>
              {language === 'es' ? dailyPromise.verseRefEs : dailyPromise.verseRefEn}
            </span>
            <p className="text-sm sm:text-base font-serif-scripture italic leading-relaxed font-medium" style={{ color: theme.text }}>
              {quoted(language === 'es' ? dailyPromise.passageEs : dailyPromise.passageEn)}
            </p>
          </div>

          {/* Meditation & Declaration */}
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
            {language === 'es' ? dailyPromise.meditationEs : dailyPromise.meditationEn}
          </p>

          <div
            className="p-3.5 rounded-2xl border flex items-start gap-2.5"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: theme.accent }} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: theme.accent }}>
                {language === 'es' ? 'Declaración para hoy:' : 'Today’s Declaration:'}
              </span>
              <p className="text-xs sm:text-sm font-semibold italic mt-0.5" style={{ color: theme.text }}>
                {quoted(language === 'es' ? dailyPromise.declarationEs : dailyPromise.declarationEn)}
              </p>
            </div>
          </div>

          {/* Bottom actions: Claim & View All */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleClaimPromise}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                claimedPromise ? 'scale-98 ring-2 ring-emerald-400 bg-emerald-600 text-white' : 'btn-holographic'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${claimedPromise ? 'fill-current' : ''}`} />
              <span>
                {claimedPromise
                  ? (language === 'es' ? '¡Promesa reclamada en tu corazón!' : 'Claimed in your heart!')
                  : (language === 'es' ? 'Reclamar en mi corazón' : 'Claim this promise')}
              </span>
            </button>

            {onOpenGodPromises && (
              <button
                onClick={onOpenGodPromises}
                className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.accent,
                }}
                title={language === 'es' ? 'Ver todas las promesas del Padre' : 'View all Father’s promises'}
              >
                {language === 'es' ? 'Todas' : 'All'}
              </button>
            )}
          </div>
        </div>

        {/* Gentle Breathing Pause Quick Action (Liquid Glass) */}
        <div
          onClick={onOpenBreathingPause}
          className="rounded-3xl p-4 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-2xl liquid-glass liquid-glass-interactive flex items-center justify-between"
          style={{
            backgroundColor: theme.glassCard,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
              style={{
                backgroundColor: theme.accentBg,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <Wind className="w-5 h-5" style={{ color: theme.accent }} />
            </div>
            <div>
              <h4 className="text-xs font-bold" style={{ color: theme.text }}>
                {language === 'es' ? 'Pausa Serena (1 min)' : '1-Min Peaceful Breathing'}
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Para soltar la ansiedad y descansar' : 'Slow down, release worry and rest'}
              </p>
            </div>
          </div>
          <span
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl border shadow-sm btn-holographic cursor-pointer"
          >
            {language === 'es' ? 'Iniciar' : 'Start'}
          </span>
        </div>

        {/* Camino de Gracia y Acogida (Liquid Glass Card) */}
        <div
          onClick={onOpenStreakDialog}
          className="rounded-3xl p-4.5 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-2xl liquid-glass liquid-glass-interactive flex items-center justify-between"
          style={{
            backgroundColor: theme.glassCard,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: theme.accentBg,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <Heart className="w-5 h-5 fill-current" style={{ color: theme.accent }} />
            </div>
            <div>
              <h4 className="text-sm font-semibold leading-tight" style={{ color: theme.text }}>
                <span className="font-bold text-lg mr-1" style={{ color: theme.accent }}>{readingStreak}</span>
                {language === 'es' ? 'encuentros en Su gracia' : 'moments in His grace'}
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'La gracia nunca castiga la pausa' : 'Grace welcomes every return'}
              </p>
            </div>
          </div>

          <span
            className="text-xs font-bold px-3 py-1.5 rounded-xl border shadow-sm shrink-0"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accent,
              borderColor: theme.accentBorder,
              backdropFilter: 'blur(8px)',
            }}
          >
            {language === 'es' ? 'Camino de paz' : 'Path of peace'}
          </span>
        </div>

        {/* Módulo de Transparencia de Apoyo y Causas Sociales ("Impact Wall") */}
        {onOpenHavahPlus && (
          <div
            onClick={onOpenHavahPlus}
            className="rounded-3xl p-5 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-2xl liquid-glass liquid-glass-interactive space-y-3"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: theme.accentBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: theme.accentBg,
                        color: theme.accent,
                        borderColor: theme.accentBorder,
                      }}
                    >
                      {language === 'es' ? 'IMPACT WALL • MAYORDOMÍA' : 'IMPACT WALL • STEWARDSHIP'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold leading-tight mt-0.5" style={{ color: theme.text }}>
                    {language === 'es' ? '65% Causas Sociales • 35% Sostenibilidad' : '65% Social Causes • 35% Upkeep'}
                  </h4>
                </div>
              </div>

              <span
                className="text-xs font-bold px-3 py-1.5 rounded-xl border shadow-sm shrink-0"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.accent,
                  borderColor: theme.accentBorder,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {language === 'es' ? 'Ver Impacto' : 'View Impact'}
              </span>
            </div>

            {/* Quick Live Impact Metrics */}
            <div className="py-4 px-2 text-center">
              <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                {language === 'es' 
                  ? 'Este es un espacio de propósito futuro. Te invitamos a orar por la expansión de nuestra misión y por los proyectos venideros. El Registro de Impacto Verificado se activará conforme nuestra comunidad crezca y consolidemos la labor colectiva.' 
                  : 'This is a space of future purpose. We invite you to pray for the expansion of our mission and for upcoming projects. The Verified Impact Log will be activated as our community grows and we consolidate our collective labor.'}
              </p>
            </div>

            <p className="text-[11px] leading-relaxed italic" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Mayordomía abierta y transparente: cada ofrenda apoyará directamente a familias necesitadas y preservará este santuario libre de publicidad.'
                : 'Radical open stewardship: your gifts will directly sustain families in need and maintain this ad-free sanctuary.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default HomeScreen;
