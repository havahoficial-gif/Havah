import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Share2,
  Calendar,
} from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';
import { getTodayPrayer, DailyPrayerEntry } from '../data/dailyCalendarData';
import { speechEngine } from '../utils/speechEngine';
import { triggerHaptic } from '../utils/haptics';

interface DailyPrayerCardProps {
  language: Language;
  theme: ThemeColors;
  targetDay?: number;
}

export const DailyPrayerCard: React.FC<DailyPrayerCardProps> = ({
  language,
  theme,
  targetDay,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpeakingPrayer, setIsSpeakingPrayer] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dailyPrayer: DailyPrayerEntry = getTodayPrayer(targetDay);

  // Pre-load prayer audio for 0ms instant click playback
  useEffect(() => {
    const textToSpeak = `${dailyPrayer.titleEs}. ${dailyPrayer.verseRefEs}. ${dailyPrayer.verseTextEs}. ${dailyPrayer.prayerEs}`;
    speechEngine.preload(textToSpeak, undefined, language);
  }, [dailyPrayer, language]);

  // Stop speech if prayer changes or component unmounts
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  const handleToggleSpeakPrayer = () => {
    triggerHaptic('light');
    if (isSpeakingPrayer) {
      speechEngine.stop();
      setIsSpeakingPrayer(false);
      return;
    }

    const textToSpeak = `${dailyPrayer.titleEs}. ${dailyPrayer.verseRefEs}. ${dailyPrayer.verseTextEs}. ${dailyPrayer.prayerEs}`;
    setIsSpeakingPrayer(true);
    speechEngine.speak({
      text: textToSpeak,
      language,
      onEnd: () => setIsSpeakingPrayer(false),
      onError: () => setIsSpeakingPrayer(false),
    });
  };

  const handleSharePrayer = async () => {
    triggerHaptic('light');
    const shareText = `HAVAH • Oración del Día (${dailyPrayer.dateFormattedEs})\n\n«${dailyPrayer.titleEs}»\n${dailyPrayer.verseRefEs}: ${dailyPrayer.verseTextEs}\n\n${dailyPrayer.prayerEs}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: dailyPrayer.titleEs,
          text: shareText,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch {
      // ignore
    }
  };

  // Play soft chime on completion using Web Audio API (no external asset needed)
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Peaceful chord)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.18 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 2.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 2.6);
      });
    } catch {
      // Ignore audio policy blocks
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            setIsCompleted(true);
            playCompletionChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, soundEnabled]);

  const handleSelectDuration = (seconds: number) => {
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
    setIsCompleted(false);
    setIsImmersiveMode(true);
  };

  const handleToggleTimer = () => {
    if (isCompleted) {
      setTimeLeft(selectedDuration);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPct = ((selectedDuration - timeLeft) / selectedDuration) * 100;

  return (
    <div
      className="rounded-3xl p-5 sm:p-6 border transition-all duration-300 shadow-xl backdrop-blur-2xl liquid-glass relative overflow-hidden space-y-4"
      style={{
        backgroundColor: theme.glassCard,
        borderColor: theme.cardBorder,
      }}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 mt-0.5"
            style={{
              backgroundColor: theme.accentBg,
              border: `1.5px solid ${theme.accentBorder}`,
            }}
          >
            <Heart className="w-5 h-5 fill-current" style={{ color: theme.accent }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-scripture font-bold text-lg leading-tight" style={{ color: theme.text }}>
                {language === 'es' ? 'Oración del Día' : 'Prayer of the Day'}
              </h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border badge-holographic"
                style={{
                  color: theme.accent,
                }}
              >
                {language === 'es' ? dailyPrayer.dateFormattedEs : dailyPrayer.dateFormattedEn}
              </span>
            </div>
            <h4 className="text-xs font-semibold mt-1" style={{ color: theme.accent }}>
              {language === 'es' ? dailyPrayer.titleEs : dailyPrayer.titleEn} • {language === 'es' ? dailyPrayer.verseRefEs : dailyPrayer.verseRefEn}
            </h4>
          </div>
        </div>

        {/* Action icons: Single Audio Icon & Share */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleToggleSpeakPrayer}
            className={`p-2 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
              isSpeakingPrayer ? 'ring-2 ring-cyan-400 animate-pulse' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: isSpeakingPrayer ? theme.accentBg : theme.cardVariant,
              borderColor: isSpeakingPrayer ? theme.accent : theme.cardBorder,
              color: theme.accent,
            }}
            title={
              isSpeakingPrayer
                ? language === 'es'
                  ? 'Detener voz'
                  : 'Stop audio'
                : language === 'es'
                ? 'Escuchar oración'
                : 'Listen to prayer'
            }
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleSharePrayer}
            className="p-2 rounded-2xl border transition-all cursor-pointer shadow-xs hover:scale-105"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.textMuted,
            }}
            title={language === 'es' ? 'Compartir oración' : 'Share prayer'}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-xs text-center text-cyan-200 animate-fade-in font-medium">
          {language === 'es' ? '✓ Oración copiada al portapapeles' : '✓ Prayer copied to clipboard'}
        </div>
      )}

      {/* Scripture & Heart Prayer Focus */}
      <div
        className="p-4.5 sm:p-5 rounded-2xl border liquid-glass-subtle space-y-4"
        style={{
          borderColor: theme.cardBorder,
        }}
      >
        {/* Versículo Bíblico: Tamaño equilibrado y cómodo */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: theme.accent }}>
            {language === 'es' ? dailyPrayer.verseRefEs : dailyPrayer.verseRefEn}
          </span>
          <p
            className="text-base sm:text-lg font-serif-scripture italic font-medium leading-relaxed"
            style={{ color: theme.text }}
          >
            «{language === 'es' ? dailyPrayer.verseTextEs : dailyPrayer.verseTextEn}»
          </p>
        </div>

        {/* Oración de Cobertura: Tamaño equilibrado y armonioso con el versículo */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: theme.accent }}>
            {language === 'es' ? 'Oración de Cobertura' : 'Covering Prayer'}
          </span>
          <p
            className="text-base sm:text-lg font-serif-scripture italic font-medium leading-relaxed"
            style={{ color: theme.text }}
          >
            «{language === 'es' ? dailyPrayer.prayerEs : dailyPrayer.prayerEn}»
          </p>
        </div>
      </div>

      {/* Timer Section */}
      <div
        className="p-4 rounded-2xl border liquid-glass-subtle flex flex-col items-center justify-center space-y-3 relative overflow-hidden"
        style={{
          backgroundColor: theme.accentBg,
          borderColor: theme.accentBorder,
        }}
      >
        {/* Progress Bar Header */}
        <div className="w-full flex items-center justify-between text-xs font-bold">
          <span style={{ color: theme.accent }}>
            {language === 'es' ? 'Duración de oración:' : 'Prayer timer:'}
          </span>
          <div className="flex gap-1 overflow-x-auto max-w-[220px] no-scrollbar py-0.5">
            {[
              { sec: 300, label: '5m' },
              { sec: 900, label: '15m' },
              { sec: 1800, label: '30m' },
              { sec: 3600, label: '1h' },
            ].map(({ sec, label }) => (
              <button
                key={sec}
                onClick={() => handleSelectDuration(sec)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold border whitespace-nowrap transition-all cursor-pointer ${
                  selectedDuration === sec ? 'btn-holographic scale-105 shadow-md' : 'opacity-70 hover:opacity-100'
                }`}
                style={selectedDuration === sec ? {} : {
                  backgroundColor: 'transparent',
                  color: theme.text,
                  borderColor: theme.cardBorder,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display & Controls */}
        <div className="flex flex-col items-center justify-center space-y-2 my-1">
          <div className="relative flex items-center justify-center">
            {/* Countdown Text */}
            <span
              className="font-mono font-extrabold text-3xl sm:text-4xl tracking-tight"
              style={{ color: theme.text }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Progress Bar Indicator */}
          <div className="w-48 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPct}%`,
                backgroundColor: theme.accent,
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <button
            onClick={() => {
              if (isCompleted) {
                setTimeLeft(selectedDuration);
                setIsCompleted(false);
                setIsRunning(true);
              } else if (!isRunning) {
                setIsRunning(true);
              }
              setIsImmersiveMode(true);
            }}
            className="px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95 btn-holographic"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{language === 'es' ? 'Ver Modo Inmersivo' : 'Open Immersive View'}</span>
              </>
            ) : isCompleted ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'es' ? 'Repetir en Inmersión' : 'Repeat Immersive'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{language === 'es' ? 'Comenzar Oración' : 'Begin Prayer'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsImmersiveMode(true)}
            className="px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {language === 'es' ? 'Modo Inmersivo' : 'Immersive Mode'}
          </button>

          {(isRunning || timeLeft < selectedDuration) && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-2xl border transition-colors cursor-pointer hover:scale-105"
              style={{
                backgroundColor: theme.cardVariant,
                borderColor: theme.cardBorder,
                color: theme.textMuted,
              }}
              title={language === 'es' ? 'Reiniciar temporizador' : 'Reset timer'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Completion Blessing */}
        {isCompleted && (
          <div className="flex items-center gap-2 text-xs font-bold pt-1 animate-fade-in" style={{ color: theme.accent }}>
            <Sparkles className="w-4 h-4" />
            <span>
              {language === 'es'
                ? '¡Momento de oración completado! Que la paz de Dios te acompañe.'
                : 'Prayer moment complete! May God’s peace abide with you.'}
            </span>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMMERSIVE PRAYER MODE OVERLAY */}
      {isImmersiveMode && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden animate-fade-in bg-[#030712]/95 backdrop-blur-3xl text-slate-100">
          {/* Ambient Glow background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[120px] animate-pulse" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px]" />
          </div>

          {/* Top Zone: Title & Subtitle */}
          <div className="relative z-10 text-center max-w-md pt-6 sm:pt-10 space-y-2">
            <h2 className="font-serif-scripture text-2xl sm:text-3xl font-bold tracking-wide text-cyan-200">
              {language === 'es' ? 'Espacio de Oración y Silencio' : 'Prayer & Quiet Space'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {language === 'es'
                ? 'Coloca tu teléfono a un lado y descansa en Su presencia. No hay prisa.'
                : 'Set your phone aside and rest in His presence. There is no rush.'}
            </p>
          </div>

          {/* Center Zone: Big Timer Ring & Scripture Focus */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full my-auto space-y-8 text-center">
            {/* Soft Breathing Ring with Timer */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-2 border-cyan-400/30 transition-all duration-[4000ms] ease-in-out ${
                  isRunning ? 'scale-110 opacity-70 animate-ping-slow' : 'scale-100 opacity-30'
                }`}
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)' }}
              />
              <div
                className="w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-cyan-400/40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)] backdrop-blur-2xl"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
              >
                <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-1">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-cyan-300/80">
                  {isRunning
                    ? language === 'es' ? 'En Oración' : 'In Prayer'
                    : language === 'es' ? 'En Pausa' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Scripture snippet */}
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl text-center space-y-2 max-w-md"
              style={{
                backgroundColor: theme.isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(240, 249, 255, 0.85)',
                borderColor: theme.isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(56, 189, 248, 0.3)',
                color: theme.text,
              }}
            >
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: theme.accent }}>
                {language === 'es' ? dailyPrayer.verseRefEs : dailyPrayer.verseRefEn}
              </span>
              <p className="text-sm sm:text-base font-serif-scripture italic leading-relaxed" style={{ color: theme.textSecondary }}>
                «{language === 'es' ? dailyPrayer.verseTextEs : dailyPrayer.verseTextEn}»
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleToggleTimer}
                className="px-8 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-all active:scale-95 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>{language === 'es' ? 'Pausar' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{language === 'es' ? 'Reanudar' : 'Resume'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleSpeakPrayer}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSpeakingPrayer
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 animate-pulse'
                    : theme.isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-sky-100/80 border-sky-300 text-sky-900 hover:text-slate-950'
                }`}
                title={language === 'es' ? 'Escuchar oración' : 'Listen prayer'}
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleReset}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  theme.isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-sky-100/80 border-sky-300 text-sky-900 hover:text-slate-950'
                }`}
                title={language === 'es' ? 'Reiniciar' : 'Reset'}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Zone: Discreet Exit Button */}
          <div className="relative z-10 pb-4 sm:pb-8">
            <button
              onClick={() => setIsImmersiveMode(false)}
              className="px-6 py-2.5 rounded-full border text-xs font-medium transition-all cursor-pointer backdrop-blur-xl"
              style={{
                backgroundColor: theme.isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(240, 249, 255, 0.8)',
                borderColor: theme.cardBorder,
                color: theme.textMuted,
              }}
            >
              {language === 'es' ? 'Finalizar pausa' : 'End pause'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
