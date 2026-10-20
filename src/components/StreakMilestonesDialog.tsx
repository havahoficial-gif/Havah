import React from 'react';
import { Sparkles, Heart, Check, X, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { STREAK_MILESTONES } from '../data/havahData';
import { ThemeColors } from '../theme';

interface StreakMilestonesDialogProps {
  language: Language;
  theme: ThemeColors;
  currentStreak: number;
  onRecordToday: () => void;
  onClose: () => void;
}

export const StreakMilestonesDialog: React.FC<StreakMilestonesDialogProps> = ({
  language,
  theme,
  currentStreak,
  onRecordToday,
  onClose,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
        theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
      }`}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all max-h-[85vh] flex flex-col relative overflow-hidden backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
          color: theme.text,
        }}
      >
        {/* Dynamic Celestial Atmosphere Background */}
        {theme.isDark ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="/night-space.jpg"
              alt="Night Space"
              className="w-full h-full object-cover opacity-35 mix-blend-screen scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021]/80 via-transparent to-[#0B1021]/90" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-300/35 blur-3xl" />
          </div>
        )}

        <div className="relative z-10 flex flex-col max-h-[75vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-xs"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.accentBorder}`,
                }}
              >
                <Heart className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {language === 'es' ? 'Camino de Gracia y Paz' : 'Journey of Grace & Peace'}
                </h3>
                <p className="text-[11px]" style={{ color: theme.accent }}>
                  {language === 'es' ? 'La gracia nunca castiga la pausa' : 'Grace never penalizes rest'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              style={{ color: theme.textMuted }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grace & Welcome Banner (Anti-Streak Shaming) */}
          <div
            className="p-3.5 rounded-2xl border mb-3 flex items-start gap-2.5 liquid-glass-subtle"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.accent }} />
            <p className="text-xs leading-relaxed font-serif-scripture italic" style={{ color: theme.text }}>
              {language === 'es'
                ? '«Dios no pasa lista ni apaga fuegos. Si ayer descansaste o fue un día cargado, Su mesa te espera hoy con la misma ternura incondicional. En Su presencia no hay racha que perder: cada regreso es una fiesta de gracia.»'
                : '«God never keeps score of missed days. If you paused yesterday, His table welcomes you today with the very same tender love. Where grace abides, no streak is ever lost.»'}
            </p>
          </div>

          {/* Hero Summary Cards */}
          <div
            className="p-3.5 rounded-2xl border mb-3 flex items-center justify-around text-center"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
            }}
          >
            <div>
              <span className="font-serif-scripture font-bold text-3xl block" style={{ color: theme.accent }}>
                {currentStreak}
              </span>
              <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Días con Dios' : 'Days with God'}
              </span>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: theme.cardBorder }} />
            <div>
              <span className="font-serif-scripture font-bold text-3xl block" style={{ color: theme.accent }}>
                ∞
              </span>
              <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Gracia diaria' : 'Daily grace'}
              </span>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: theme.cardBorder }} />
            <div>
              <span className="font-serif-scripture font-bold text-3xl block" style={{ color: theme.accent }}>
                100%
              </span>
              <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Acogida en amor' : 'Welcomed in love'}
              </span>
            </div>
          </div>

          {/* Milestones list: Fruits & Moments of Growth */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
              {language === 'es' ? 'Tus pasos de crecimiento y bendición:' : 'Moments of growth & blessing:'}
            </p>
            {STREAK_MILESTONES.map((m) => {
              const isReached = currentStreak >= m.daysRequired;
              return (
                <div
                  key={m.daysRequired}
                  className="p-3 rounded-2xl border flex items-center gap-3 transition-all"
                  style={{
                    backgroundColor: isReached ? theme.accentBg : theme.cardVariant,
                    borderColor: isReached ? theme.accentBorder : theme.cardBorder,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs"
                    style={{
                      backgroundColor: isReached ? theme.accent : theme.card,
                      color: isReached ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                    }}
                  >
                    {isReached ? <Check className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5 opacity-60" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs" style={{ color: theme.text }}>
                        {language === 'es' ? m.titleEs : m.titleEn}
                      </h5>
                      <span className="text-[10px] font-bold" style={{ color: theme.accent }}>
                        {m.daysRequired} {language === 'es' ? 'pausas' : 'pauses'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: theme.textMuted }}>
                      {language === 'es' ? m.descriptionEs : m.descriptionEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t flex gap-2" style={{ borderColor: theme.cardBorder }}>
            <button
              onClick={() => {
                onRecordToday();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all btn-holographic"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{language === 'es' ? 'Anotar mi pausa de hoy' : 'Record today’s quiet pause'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border text-xs font-semibold cursor-pointer hover:opacity-80 transition-all"
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
    </div>
  );
};
