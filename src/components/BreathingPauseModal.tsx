import React, { useState, useEffect } from 'react';
import { Wind, X, Volume2, VolumeX, RotateCcw, Sun, Moon } from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';

interface BreathingPauseModalProps {
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

export const BreathingPauseModal: React.FC<BreathingPauseModalProps> = ({
  language,
  theme,
  onClose,
}) => {
  const currentHour = new Date().getHours();
  // Automatic day/night detection based on local time (6:00 - 18:59 is Day)
  const autoIsDaytime = currentHour >= 6 && currentHour < 19;
  
  const [isDaytimeMode, setIsDaytimeMode] = useState<boolean>(autoIsDaytime);
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Play peaceful singing bowl chime using Web Audio API
  const playHarmonicChime = (freq = 280) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 3.2);
      osc2.stop(ctx.currentTime + 3.2);
    } catch {
      // Audio permission error catch
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (phase === 'inhale') {
          setPhase('hold');
          playHarmonicChime(320);
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          playHarmonicChime(240);
          return 8;
        } else {
          setPhase('inhale');
          setCyclesCompleted((c) => c + 1);
          playHarmonicChime(280);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, soundEnabled]);

  const phaseInstruction =
    phase === 'inhale'
      ? language === 'es'
        ? 'Inhala profundo... recibe Su paz'
        : 'Inhale deeply... receive His peace'
      : phase === 'hold'
      ? language === 'es'
        ? 'Sostén con calma... Dios está contigo'
        : 'Hold gently... God is with you'
      : language === 'es'
      ? 'Exhala despacio... suelta todo afán'
      : 'Exhale slowly... release all worry';

  const circleScale =
    phase === 'inhale' ? 'scale-125' : phase === 'hold' ? 'scale-125' : 'scale-90';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
        isDaytimeMode ? 'bg-sky-950/20' : 'bg-[#020510]/80'
      }`}
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-7 border shadow-2xl transition-all duration-700 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-2xl liquid-glass ${
          isDaytimeMode
            ? 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] text-[#0f172a] border-sky-300/80 shadow-[0_20px_60px_-10px_rgba(56,189,248,0.25)]'
            : 'bg-gradient-to-br from-[#0B0A26] via-[#120B38] to-[#061836] text-sky-100 border-cyan-400/40 shadow-[0_0_50px_rgba(56,189,248,0.30)]'
        }`}
      >
        {/* Dynamic Background Atmosphere */}
        {isDaytimeMode ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-sky-300/50 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-300/40 blur-3xl" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="/night-space.jpg"
              alt="Night Space"
              className="w-full h-full object-cover opacity-45 mix-blend-screen scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A26]/80 via-transparent to-[#061836]/90" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
          </div>
        )}

        {/* Top Header Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => setIsDaytimeMode(!isDaytimeMode)}
            className="px-3 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            style={{
              backgroundColor: isDaytimeMode ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.18)',
              borderColor: isDaytimeMode ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.40)',
              color: isDaytimeMode ? '#0284c7' : '#38BDF8',
            }}
            title={language === 'es' ? 'Cambiar ambiente Día/Noche' : 'Toggle Day/Night ambience'}
          >
            {isDaytimeMode ? <Sun className="w-3.5 h-3.5 text-sky-600" /> : <Moon className="w-3.5 h-3.5 text-sky-300" />}
            <span>
              {isDaytimeMode
                ? language === 'es' ? 'Pausa Diurna' : 'Daytime Pause'
                : language === 'es' ? 'Reposo Nocturno' : 'Night Rest'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sky-100/60 dark:hover:bg-white/10 cursor-pointer transition-colors"
            style={{ color: isDaytimeMode ? '#0369a1' : '#94A3B8' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full flex flex-col items-center mt-6">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2 shadow-sm border"
            style={{
              backgroundColor: isDaytimeMode ? 'rgba(147, 51, 234, 0.12)' : 'rgba(56, 189, 248, 0.18)',
              borderColor: isDaytimeMode ? 'rgba(192, 132, 252, 0.45)' : 'rgba(56, 189, 248, 0.40)',
              color: isDaytimeMode ? '#9333EA' : '#38BDF8',
            }}
          >
            <Wind className="w-5 h-5" />
          </div>

          <h3
            className="font-serif-scripture font-bold text-lg mb-1"
            style={{ color: isDaytimeMode ? '#1E112A' : '#F8FAFC' }}
          >
            {isDaytimeMode
              ? language === 'es' ? 'Pausa & Luz Diurna' : 'Daylight Pause'
              : language === 'es' ? 'Momento de Reposo Nocturno' : 'Night Rest Moment'}
          </h3>
          <p
            className="text-xs mb-5 max-w-xs leading-relaxed"
            style={{ color: isDaytimeMode ? '#7E5E9B' : '#94A3B8' }}
          >
            {isDaytimeMode
              ? language === 'es'
                ? 'Un minuto de luz y calma a mitad del día para renovar la mente.'
                : 'A moment of daylight calm to refresh your spirit.'
              : language === 'es'
              ? 'Desconecta de las pantallas, apaga el ruido y descansa bajo la paz de Dios.'
              : 'Disconnect from screens, turn off the noise, and rest under God’s peace.'}
          </p>

          {/* Breathing Animated Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-[3000ms] ease-in-out opacity-25 ${circleScale}`}
              style={{ backgroundColor: isDaytimeMode ? '#C084FC' : '#38BDF8' }}
            />
            <div
              className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-[2000ms] shadow-md ${circleScale}`}
              style={{
                backgroundColor: isDaytimeMode ? '#FAF5FF' : 'rgba(56, 189, 248, 0.18)',
                borderColor: isDaytimeMode ? '#9333EA' : '#38BDF8',
              }}
            >
              <span
                className="font-serif-scripture font-bold text-3xl transition-all"
                style={{ color: isDaytimeMode ? '#7E22CE' : '#38BDF8' }}
              >
                {secondsLeft}s
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: isDaytimeMode ? '#9333EA' : '#38BDF8' }}
              >
                {phase === 'inhale'
                  ? language === 'es' ? 'Inhala' : 'Inhale'
                  : phase === 'hold'
                  ? language === 'es' ? 'Sostén' : 'Hold'
                  : language === 'es' ? 'Exhala' : 'Exhale'}
              </span>
            </div>
          </div>

          <p
            className="font-serif-scripture italic text-sm my-4 transition-all duration-300 min-h-[2.5rem] flex items-center justify-center font-medium"
            style={{ color: isDaytimeMode ? '#1E112A' : '#F1F5F9' }}
          >
            «{phaseInstruction}»
          </p>

          {/* Controls */}
          <div
            className="flex items-center gap-4 pt-3 border-t w-full justify-center mt-2"
            style={{ borderColor: isDaytimeMode ? 'rgba(216, 180, 254, 0.45)' : 'rgba(56,189,248,0.25)' }}
          >
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full border transition-all cursor-pointer shadow-xs hover:scale-105"
              style={{
                backgroundColor: isDaytimeMode ? '#FFFFFF' : 'rgba(16, 23, 46, 0.8)',
                borderColor: isDaytimeMode ? 'rgba(216, 180, 254, 0.6)' : 'rgba(56,189,248,0.3)',
                color: soundEnabled ? (isDaytimeMode ? '#9333EA' : '#38BDF8') : (isDaytimeMode ? '#7E5E9B' : '#94A3B8'),
              }}
              title={soundEnabled ? 'Silenciar campanilla' : 'Activar campanilla suave'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 btn-holographic"
            >
              {isActive ? (language === 'es' ? 'Pausar' : 'Pause') : (language === 'es' ? 'Continuar' : 'Resume')}
            </button>

            <button
              onClick={() => {
                setPhase('inhale');
                setSecondsLeft(4);
                setCyclesCompleted(0);
              }}
              className="p-2 rounded-full border transition-all cursor-pointer shadow-xs hover:scale-105"
              style={{
                backgroundColor: isDaytimeMode ? '#FFFFFF' : 'rgba(16, 23, 46, 0.8)',
                borderColor: isDaytimeMode ? 'rgba(216, 180, 254, 0.6)' : 'rgba(56,189,248,0.3)',
                color: isDaytimeMode ? '#7E5E9B' : '#94A3B8',
              }}
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
