import React, { useState, useEffect } from 'react';
import { Mail, Heart, Sparkles, X, Plus, Calendar, Lock, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';

interface SoulLettersModalProps {
  isOpen: boolean;
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

interface SoulLetterItem {
  id: string;
  title: string;
  content: string;
  targetDays: number;
  createdAt: number;
  unlockDate: number;
}

export const SoulLettersModal: React.FC<SoulLettersModalProps> = ({
  isOpen,
  language,
  theme,
  onClose,
}) => {
  const [letters, setLetters] = useState<SoulLetterItem[]>(() => {
    try {
      const stored = localStorage.getItem('havah_soul_letters');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [targetDays, setTargetDays] = useState<number>(30);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('havah_soul_letters', JSON.stringify(letters));
    } catch {}
  }, [letters]);

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const now = Date.now();
    const newLetter: SoulLetterItem = {
      id: 'letter_' + now,
      title: newTitle,
      content: newContent,
      targetDays,
      createdAt: now,
      unlockDate: now + targetDays * 86400000,
    };

    setLetters([newLetter, ...letters]);
    setNewTitle('');
    setNewContent('');
    setShowNewForm(false);
    setToast(language === 'es' ? 'Carta guardada en tu cofre secreto del alma' : 'Letter saved in your secret soul vault');
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
      theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
    }`}>
      <div
        className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl transition-all max-h-[90vh] flex flex-col relative overflow-hidden backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
          color: theme.text,
        }}
      >
        {/* Dynamic Atmosphere */}
        {theme.isDark ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img src="/night-space.jpg" alt="Space" className="w-full h-full object-cover opacity-35 mix-blend-screen scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021]/80 via-transparent to-[#0B1021]/90" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-300/35 blur-3xl" />
          </div>
        )}

        <div className="relative z-10 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md border"
                style={{ backgroundColor: theme.accentBg, borderColor: theme.accentBorder }}
              >
                <Mail className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {language === 'es' ? 'Oraciones de la Cápsula del Tiempo' : 'Time Capsule Prayers'}
                </h3>
                <p className="text-[11px]" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Cartas de fe para tu yo del futuro' : 'Letters of faith to your future self'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-sky-100/50 dark:hover:bg-white/10 cursor-pointer"
              style={{ color: theme.textMuted }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {toast && (
            <div className="mb-3 p-2.5 rounded-2xl bg-sky-600/95 text-white text-xs text-center font-semibold animate-fade-in flex items-center justify-center gap-2 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{toast}</span>
            </div>
          )}

          {/* Action Header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Escribe una carta de fe o gratitud para leerla en el futuro cuando tu alma necesite un recordatorio de la paz de Dios.'
                : 'Write a letter of faith to read in the future when your soul needs a reminder of God’s peace.'}
            </p>
            {!showNewForm && (
              <button
                onClick={() => setShowNewForm(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Nueva carta' : 'New letter'}</span>
              </button>
            )}
          </div>

          {/* New Letter Form */}
          {showNewForm ? (
            <form onSubmit={handleCreateLetter} className="space-y-3 p-4 rounded-2xl border liquid-glass-subtle mb-3" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold" style={{ color: theme.text }}>
                  {language === 'es' ? 'Escribir carta al futuro' : 'Write future letter'}
                </h4>
                <button type="button" onClick={() => setShowNewForm(false)} className="text-xs" style={{ color: theme.textMuted }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={language === 'es' ? 'Título (ej. Para cuando sienta temor...)' : 'Title...'}
                className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                style={{ borderColor: theme.cardBorder, color: theme.text }}
              />

              <textarea
                required
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={language === 'es' ? 'Escribe aquí tu carta desde el corazón...' : 'Write your letter...'}
                className="w-full text-xs p-3 rounded-2xl border bg-transparent outline-none font-serif-scripture resize-none leading-relaxed"
                style={{ borderColor: theme.cardBorder, color: theme.text }}
              />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Abrir en:' : 'Unlock in:'}
                </span>
                <div className="flex gap-1.5">
                  {[30, 90, 365].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTargetDays(d)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                      style={{
                        backgroundColor: targetDays === d ? theme.accentBg : theme.cardVariant,
                        borderColor: targetDays === d ? theme.accent : theme.cardBorder,
                        color: targetDays === d ? theme.accent : theme.textMuted,
                      }}
                    >
                      {d} {language === 'es' ? 'días' : 'days'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-3 py-1.5 rounded-xl text-xs border cursor-pointer"
                  style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                  style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
                >
                  {language === 'es' ? 'Guardar en el cofre' : 'Save in vault'}
                </button>
              </div>
            </form>
          ) : null}

          {/* Letters List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {letters.length === 0 && !showNewForm ? (
              <div
                className="rounded-2xl p-6 border text-center space-y-3"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border"
                  style={{ backgroundColor: theme.accentBg, borderColor: theme.accentBorder }}
                >
                  <Mail className="w-6 h-6" style={{ color: theme.accent }} />
                </div>
                <div>
                  <h4 className="font-serif-scripture font-bold text-sm" style={{ color: theme.text }}>
                    {language === 'es' ? 'Tu cofre del alma está listo' : 'Your soul vault is ready'}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                    {language === 'es'
                      ? 'Escribe tu primera carta de fe para sellarla y abrirla en el futuro.'
                      : 'Write your first time capsule letter to seal and unlock in the future.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md hover:scale-105"
                  style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
                >
                  {language === 'es' ? 'Escribir mi primera carta' : 'Write my first letter'}
                </button>
              </div>
            ) : (
              letters.map((letter) => {
              const isUnlocked = Date.now() >= letter.unlockDate;
              const daysLeft = Math.ceil((letter.unlockDate - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={letter.id}
                  className="p-4 rounded-2xl border liquid-glass-subtle space-y-2 relative overflow-hidden"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-500" />
                      )}
                      <h4 className="font-serif-scripture font-bold text-sm" style={{ color: theme.text }}>
                        {letter.title}
                      </h4>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: isUnlocked ? 'rgba(16, 185, 129, 0.1)' : theme.accentBg,
                        color: isUnlocked ? '#10B981' : theme.accent,
                        borderColor: isUnlocked ? 'rgba(16, 185, 129, 0.3)' : theme.accentBorder,
                      }}
                    >
                      {isUnlocked ? (language === 'es' ? 'Carta Desbloqueada' : 'Unlocked') : (language === 'es' ? `Faltan ${daysLeft} días` : `${daysLeft} days left`)}
                    </span>
                  </div>

                  <div
                    className="p-3 rounded-xl border flex items-center gap-2.5 text-xs italic"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                      color: theme.textMuted,
                    }}
                  >
                    <Lock className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                    <span>
                      {language === 'es'
                        ? 'Carta sellada en la cápsula del tiempo. Se revelará cuando se cumpla el plazo de gracia.'
                        : 'Sealed time capsule letter. It will unlock when the grace period arrives.'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]" style={{ color: theme.textMuted }}>
                    <span>{language === 'es' ? 'Escrita el ' + new Date(letter.createdAt).toLocaleDateString() : 'Written'}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {language === 'es' ? `Se abre el ${new Date(letter.unlockDate).toLocaleDateString()}` : 'Unlock date'}
                    </span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>
    </div>
  );
};
