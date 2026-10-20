import React, { useState } from 'react';
import { Share2, Copy, Check, X, Flame } from 'lucide-react';
import { Devotional, Language } from '../types';
import { ThemeColors } from '../theme';

interface ShareCardModalProps {
  devotional: Devotional;
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  devotional,
  language,
  theme,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const textToCopy = `«${language === 'es' ? devotional.passageTextEs : devotional.passageTextEn}»\n— ${language === 'es' ? devotional.passageRefEs : devotional.passageRefEn}\n\n"${language === 'es' ? devotional.titleEs : devotional.titleEn}"\n\nQue la paz de Dios cuide tu corazón hoy. Compartido con amor desde HAVAH.`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 19;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
        theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
      }`}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl transition-all relative overflow-hidden backdrop-blur-2xl liquid-glass"
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

        <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4" style={{ color: theme.accent }} />
            <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
              {language === 'es' ? 'Compartir Tarjeta de Bendición' : 'Share Blessing Card'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-sky-100/50 dark:hover:bg-white/10 cursor-pointer"
            style={{ color: theme.textMuted }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Card Preview */}
        <div
          className={`rounded-3xl p-6 border shadow-xs space-y-4 text-center relative overflow-hidden`}
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
            color: theme.text,
          }}
        >
          <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
            <Flame className="w-4 h-4" style={{ color: theme.flame }} />
          </div>

          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block uppercase tracking-wider"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.accent,
              border: `1px solid ${theme.accentBorder}`,
            }}
          >
            {devotional.topic}
          </span>

          <p
            className="font-serif-scripture italic text-base leading-relaxed"
            style={{ color: theme.text }}
          >
            «{language === 'es' ? devotional.passageTextEs : devotional.passageTextEn}»
          </p>

          <p className="text-xs font-semibold" style={{ color: theme.accent }}>
            {language === 'es' ? devotional.passageRefEs : devotional.passageRefEn}
          </p>

          <div className="pt-2 border-t flex items-center justify-center gap-1.5" style={{ borderColor: theme.cardBorder }}>
            <span className="font-serif-scripture tracking-widest text-[11px] font-bold" style={{ color: theme.accent }}>
              HAVAH
            </span>
            <span className="text-[10px]" style={{ color: theme.textMuted }}>
              • Calma y fe diaria
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleCopyText}
            className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:opacity-90 transition-all"
            style={{
              backgroundColor: theme.accent,
              color: theme.isDark ? '#000000' : '#FFFFFF',
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>
              {copied
                ? language === 'es'
                  ? '¡Mensaje copiado para WhatsApp!'
                  : 'Copied for WhatsApp!'
                : language === 'es'
                ? 'Copiar mensaje para compartir'
                : 'Copy message to share'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl border text-xs font-semibold cursor-pointer"
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
