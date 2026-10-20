import React, { useState } from 'react';
import { Heart, Sparkles, X, Check } from 'lucide-react';
import { Language, MoodType } from '../types';
import { MOODS } from '../data/havahData';
import { ThemeColors } from '../theme';

interface MoodSelectorProps {
  selectedMood: MoodType;
  language: Language;
  theme: ThemeColors;
  progress: number; // 0-100
  onSelectMood: (mood: MoodType) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  language,
  theme,
  progress,
  onSelectMood,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentMoodConfig = MOODS.find((m) => m.id === selectedMood) || MOODS[0];

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Trigger Bar with Iridescent Liquid Glass & Progress Ring */}
      <div
        onClick={() => setIsOpen(true)}
        className="rounded-3xl p-4 border transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg backdrop-blur-2xl liquid-glass liquid-glass-interactive"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 flex items-center justify-center">
              {/* Circular Progress Bar */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  fill="transparent"
                  stroke={theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                  strokeWidth="3"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  fill="transparent"
                  stroke={theme.accent}
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: `${currentMoodConfig.colorHex}22`,
                }}
              >
                <Heart
                  className="w-4 h-4"
                  style={{ color: currentMoodConfig.colorHex }}
                />
              </div>
            </div>
            <div>
              <p
                className="text-xs transition-colors"
                style={{ color: theme.textMuted }}
              >
                {language === 'es' ? '¿Cómo está tu corazón hoy?' : 'How is your heart today?'}
              </p>
              <h4
                className="text-sm font-semibold transition-colors flex items-center gap-1.5 mt-0.5"
                style={{ color: theme.text }}
              >
                <span className="font-bold" style={{ color: theme.accent }}>
                  {language === 'es' ? currentMoodConfig.labelEs : currentMoodConfig.labelEn}
                </span>
                <span
                  className="text-xs font-serif-scripture italic"
                  style={{ color: theme.accent }}
                >
                  ({language === 'es' ? currentMoodConfig.scriptureAnchorEs : currentMoodConfig.scriptureAnchorEn})
                </span>
              </h4>
            </div>
          </div>

          <div
            className="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs border btn-holographic-pill cursor-pointer"
            style={{
              color: theme.accent,
            }}
          >
            {language === 'es' ? 'Cambiar' : 'Change'}
          </div>
        </div>
      </div>

      {/* Mood Selection Dialog */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
            theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
          }`}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all relative overflow-hidden backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Background Atmosphere */}
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

            <div className="relative z-10">
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: theme.accent }} />
                  <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                    {language === 'es' ? 'Estado del Corazón' : 'Heart Sanctuary'}
                  </h3>
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-bold ml-1"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accent,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    {theme.isDark ? (language === 'es' ? 'Noche' : 'Night') : (language === 'es' ? 'Día' : 'Day')}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-sky-100/50 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  style={{ color: theme.textMuted }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs mt-3 mb-4 leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Elige cómo te sientes. El devocional y los versículos del día se adaptarán a la necesidad de tu alma.'
                  : 'Select how you feel. Today’s devotional and scriptures will gently align with your soul’s season.'}
              </p>

              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {MOODS.map((mood) => {
                  const isSelected = selectedMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => {
                        onSelectMood(mood.id);
                        setIsOpen(false);
                      }}
                      className="w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer group hover:scale-[1.01] shadow-xs"
                      style={{
                        backgroundColor: isSelected
                          ? `${mood.colorHex}18`
                          : theme.isDark
                          ? 'rgba(16, 23, 46, 0.75)'
                          : 'rgba(250, 248, 245, 0.90)',
                        borderColor: isSelected
                          ? mood.colorHex
                          : theme.isDark
                          ? 'rgba(56,189,248,0.2)'
                          : 'rgba(231,226,222,0.85)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                          style={{
                            backgroundColor: `${mood.colorHex}22`,
                            border: `1px solid ${mood.colorHex}55`,
                          }}
                        >
                          <Heart className="w-4 h-4" style={{ color: mood.colorHex }} />
                        </div>
                        <div>
                          <span
                            className="font-semibold text-sm block"
                            style={{
                              color: isSelected ? theme.accent : theme.text,
                            }}
                          >
                            {language === 'es' ? mood.labelEs : mood.labelEn}
                          </span>
                          <span
                            className="text-xs font-serif-scripture italic"
                            style={{ color: theme.accent }}
                          >
                            {language === 'es' ? mood.scriptureAnchorEs : mood.scriptureAnchorEn}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shadow-xs"
                          style={{
                            backgroundColor: theme.accent,
                            color: theme.isDark ? '#000000' : '#FFFFFF',
                          }}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
