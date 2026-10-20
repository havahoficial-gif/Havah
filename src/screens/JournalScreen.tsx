import React, { useState, useEffect } from 'react';
import {
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Bookmark,
  Heart,
  X,
  Mail,
} from 'lucide-react';
import { JournalEntry, Language, MoodType, PersonalPrayerItem } from '../types';
import { MOODS } from '../data/havahData';
import { ThemeColors } from '../theme';
import { storage } from '../utils/storage';
import { SoulLettersModal } from '../components/SoulLettersModal';

interface JournalScreenProps {
  language: Language;
  theme: ThemeColors;
}

export const JournalScreen: React.FC<JournalScreenProps> = React.memo(({
  language,
  theme,
}) => {
  const [subTab, setSubTab] = useState<'journal' | 'prayers'>('journal');

  // Journal entries state persisted to storage
  const [entries, setEntries] = useState<JournalEntry[]>(() => storage.getJournalEntries());

  // Personal prayers state persisted to storage
  const [prayers, setPrayers] = useState<PersonalPrayerItem[]>(() => storage.getPersonalPrayers());

  useEffect(() => {
    storage.saveJournalEntries(entries);
  }, [entries]);

  useEffect(() => {
    storage.savePersonalPrayers(prayers);
  }, [prayers]);

  // Modals state
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryScripture, setEntryScripture] = useState('');
  const [entryMood, setEntryMood] = useState<MoodType>('peace');

  const [showAddPrayerModal, setShowAddPrayerModal] = useState(false);
  const [prayerTitle, setPrayerTitle] = useState('');
  const [prayerDesc, setPrayerDesc] = useState('');
  const [showSoulLetters, setShowSoulLetters] = useState(false);

  const handleCreateEntry = () => {
    if (!entryTitle.trim() || !entryContent.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now(),
      title: entryTitle.trim(),
      content: entryContent.trim(),
      moodId: entryMood,
      scriptureRef: entryScripture.trim() || undefined,
      timestamp: Date.now(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setEntryTitle('');
    setEntryContent('');
    setEntryScripture('');
    setShowAddEntryModal(false);
  };

  const handleDeleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreatePrayer = () => {
    if (!prayerTitle.trim()) return;

    const newPrayer: PersonalPrayerItem = {
      id: `prayer_${Date.now()}`,
      title: prayerTitle.trim(),
      description: prayerDesc.trim() || undefined,
      isAnswered: false,
      timestamp: Date.now(),
    };

    setPrayers((prev) => [newPrayer, ...prev]);
    setPrayerTitle('');
    setPrayerDesc('');
    setShowAddPrayerModal(false);
  };

  const handleToggleAnswered = (id: string) => {
    setPrayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAnswered: !p.isAnswered } : p))
    );
  };

  const handleDeletePrayer = (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4.5 pb-24">
      {/* Privacy Notice with Liquid Glass */}
      <div
        className="rounded-3xl p-4 border text-xs flex items-center gap-3 transition-all duration-300 shadow-md backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
          style={{
            backgroundColor: theme.accentBg,
            border: `1px solid ${theme.accentBorder}`,
          }}
        >
          <Lock className="w-4 h-4" style={{ color: theme.accent }} />
        </div>
        <span style={{ color: theme.textMuted }}>
          {language === 'es'
            ? 'Tu rincón íntimo: notas y oraciones guardadas con total privacidad entre tú y Dios.'
            : 'Your sacred space: notes and prayers kept strictly private between you and God.'}
        </span>
      </div>

      {/* Cápsula del Tiempo Banner */}
      <div
        onClick={() => setShowSoulLetters(true)}
        className="rounded-3xl p-4 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-2xl liquid-glass flex items-center justify-between group"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs border"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <Mail className="w-4.5 h-4.5" style={{ color: theme.accent }} />
          </div>
          <div>
            <h4 className="text-xs font-serif-scripture font-bold" style={{ color: theme.text }}>
              {language === 'es' ? 'Oraciones de la Cápsula del Tiempo' : 'Time Capsule Prayers'}
            </h4>
            <p className="text-[11px]" style={{ color: theme.textMuted }}>
              {language === 'es' ? 'Escribe cartas de fe para abrir en el futuro' : 'Write letters of faith to unlock later'}
            </p>
          </div>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-xl border shadow-xs transition-all group-hover:scale-105"
          style={{
            backgroundColor: theme.accent,
            color: theme.isDark ? '#000000' : '#FFFFFF',
            borderColor: theme.accent,
          }}
        >
          {language === 'es' ? 'Abrir cofre' : 'Open vault'}
        </span>
      </div>

      {/* Sub-tab Selector with Liquid Glass Pills */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab('journal')}
          className="flex-1 py-2.5 px-4 text-xs font-bold rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-98"
          style={{
            backgroundColor: subTab === 'journal' ? theme.accent : theme.cardVariant,
            borderColor: subTab === 'journal' ? theme.accent : theme.cardBorder,
            color: subTab === 'journal' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
            backdropFilter: 'blur(12px)',
          }}
        >
          {language === 'es' ? 'Mi Diario Íntimo' : 'My Journal'}
        </button>
        <button
          onClick={() => setSubTab('prayers')}
          className="flex-1 py-2.5 px-4 text-xs font-bold rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-98"
          style={{
            backgroundColor: subTab === 'prayers' ? theme.accent : theme.cardVariant,
            borderColor: subTab === 'prayers' ? theme.accent : theme.cardBorder,
            color: subTab === 'prayers' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
            backdropFilter: 'blur(12px)',
          }}
        >
          {language === 'es' ? 'Mis Oraciones Privadas' : 'My Prayers'}
        </button>
      </div>

      {/* Sub-tab 0: Mi Diario */}
      {subTab === 'journal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
              {language === 'es' ? 'Reflexiones Personales' : 'Personal Reflections'}
            </h3>
            <button
              onClick={() => setShowAddEntryModal(true)}
              className="px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.accent,
                borderColor: theme.accent,
                color: theme.isDark ? '#000000' : '#FFFFFF',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Nueva reflexión' : 'New entry'}</span>
            </button>
          </div>

          {entries.length === 0 ? (
            <div
              className="rounded-3xl p-8 border text-center space-y-2 shadow-xl backdrop-blur-2xl liquid-glass"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <p className="text-sm font-serif-scripture" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Aún no has escrito reflexiones. Aparta un momento para desahogar tu corazón.'
                  : 'No reflections yet. Take a moment to pour out your thoughts.'}
              </p>
            </div>
          ) : (
            entries.map((entry) => {
              const mood = MOODS.find((m) => m.id === entry.moodId) || MOODS[0];
              return (
                <div
                  key={entry.id}
                  className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 backdrop-blur-2xl liquid-glass"
                  style={{
                    backgroundColor: theme.glassCard,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xs"
                        style={{
                          backgroundColor: `${mood.colorHex}22`,
                          color: mood.colorHex,
                          border: `1px solid ${mood.colorHex}44`,
                        }}
                      >
                        {language === 'es' ? mood.labelEs : mood.labelEn}
                      </span>
                      <h4 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                        {entry.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1.5 rounded-full hover:text-red-500 transition-colors cursor-pointer hover:scale-105"
                      style={{ color: theme.textMuted }}
                      title={language === 'es' ? 'Eliminar' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {entry.scriptureRef && (
                    <p
                      className="text-xs font-serif-scripture italic mb-3 flex items-center gap-1.5"
                      style={{ color: theme.accent }}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{entry.scriptureRef}</span>
                    </p>
                  )}

                  <p className="text-sm leading-relaxed mb-3.5 whitespace-pre-line" style={{ color: theme.textSecondary }}>
                    {entry.content}
                  </p>

                  <div className="pt-2 border-t flex justify-end border-black/5 dark:border-white/5">
                    <span className="text-[11px]" style={{ color: theme.textMuted }}>
                      {new Date(entry.timestamp).toLocaleDateString(
                        language === 'es' ? 'es-ES' : 'en-US',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sub-tab 1: Mis Oraciones Privadas */}
      {subTab === 'prayers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
              {language === 'es' ? 'Motivos de Oración' : 'Prayer Petitions'}
            </h3>
            <button
              onClick={() => setShowAddPrayerModal(true)}
              className="px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.accent,
                borderColor: theme.accent,
                color: theme.isDark ? '#000000' : '#FFFFFF',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Nueva oración' : 'New prayer'}</span>
            </button>
          </div>

          {prayers.length === 0 ? (
            <div
              className="rounded-3xl p-8 border text-center space-y-2 shadow-xl backdrop-blur-2xl liquid-glass"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <p className="text-sm font-serif-scripture" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'No tienes peticiones guardadas. Presenta tus cargas ante Dios.'
                  : 'No petitions yet. Lay your heart’s desires before Him.'}
              </p>
            </div>
          ) : (
            prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="rounded-3xl p-5 border shadow-xl transition-all duration-300 backdrop-blur-2xl liquid-glass flex items-start justify-between gap-3"
                style={{
                  backgroundColor: theme.glassCard,
                  borderColor: theme.cardBorder,
                }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleAnswered(prayer.id)}
                    className="mt-0.5 transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      color: prayer.isAnswered ? theme.accent : theme.textMuted,
                    }}
                    title={
                      prayer.isAnswered
                        ? language === 'es'
                          ? 'Marcada como contestada'
                          : 'Marked answered'
                        : language === 'es'
                        ? 'Marcar como contestada'
                        : 'Mark as answered'
                    }
                  >
                    {prayer.isAnswered ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: theme.accent }} />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <h4
                      className={`text-sm font-semibold transition-all ${
                        prayer.isAnswered ? 'line-through opacity-75' : ''
                      }`}
                      style={{ color: theme.text }}
                    >
                      {prayer.title}
                    </h4>

                    {prayer.description && (
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                        {prayer.description}
                      </p>
                    )}

                    {prayer.isAnswered && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg inline-block mt-2"
                        style={{
                          backgroundColor: theme.accentBg,
                          color: theme.accent,
                          border: `1px solid ${theme.accentBorder}`,
                        }}
                      >
                        {language === 'es' ? '¡Oración contestada! Gloria a Dios' : 'Answered! Praise God'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeletePrayer(prayer.id)}
                  className="p-1.5 hover:text-red-500 transition-colors cursor-pointer hover:scale-105"
                  style={{ color: theme.textMuted }}
                  title={language === 'es' ? 'Eliminar' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal New Entry (Liquid Glass Modal) */}
      {showAddEntryModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/20'
        }`}>
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
              <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                {language === 'es' ? 'Escribir en mi Diario Íntimo' : 'New Journal Entry'}
              </h3>
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mb-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Título o tema:' : 'Title:'}
                </label>
                <input
                  type="text"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder={language === 'es' ? 'Paz hoy, gratitud...' : 'Peace today...'}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border outline-none liquid-glass-subtle shadow-inner"
                  style={{
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Versículo asociado (opcional):' : 'Scripture reference:'}
                </label>
                <input
                  type="text"
                  value={entryScripture}
                  onChange={(e) => setEntryScripture(e.target.value)}
                  placeholder={language === 'es' ? 'Ej. Salmos 23:1' : 'e.g. Psalm 23:1'}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border outline-none liquid-glass-subtle shadow-inner"
                  style={{
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Tus reflexiones y oración con Dios:' : 'Your reflections:'}
                </label>
                <textarea
                  rows={4}
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  placeholder={language === 'es' ? 'Desahoga tu corazón en paz...' : 'Write your thoughts...'}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border outline-none resize-none liquid-glass-subtle shadow-inner"
                  style={{
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateEntry}
                className="flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer shadow-md hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                {language === 'es' ? 'Guardar reflexión' : 'Save entry'}
              </button>
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="px-4 py-2.5 rounded-2xl border text-xs font-semibold cursor-pointer active:scale-95"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal New Prayer (Liquid Glass Modal) */}
      {showAddPrayerModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/20'
        }`}>
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
              <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                {language === 'es' ? 'Nueva petición personal' : 'New personal prayer'}
              </h3>
              <button
                onClick={() => setShowAddPrayerModal(false)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mb-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Título de la petición:' : 'Prayer title:'}
                </label>
                <input
                  type="text"
                  value={prayerTitle}
                  onChange={(e) => setPrayerTitle(e.target.value)}
                  placeholder={language === 'es' ? 'Sanidad, familia, paz interior...' : 'Family, healing, peace...'}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border outline-none liquid-glass-subtle shadow-inner"
                  style={{
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Detalles de tu oración (opcional):' : 'Details (optional):'}
                </label>
                <textarea
                  rows={3}
                  value={prayerDesc}
                  onChange={(e) => setPrayerDesc(e.target.value)}
                  placeholder={language === 'es' ? 'Detalla tu sentir...' : 'Add details...'}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border outline-none resize-none liquid-glass-subtle shadow-inner"
                  style={{
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreatePrayer}
                className="flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer shadow-md hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                {language === 'es' ? 'Guardar petición' : 'Save prayer'}
              </button>
              <button
                onClick={() => setShowAddPrayerModal(false)}
                className="px-4 py-2.5 rounded-2xl border text-xs font-semibold cursor-pointer active:scale-95"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      <SoulLettersModal
        isOpen={showSoulLetters}
        language={language}
        theme={theme}
        onClose={() => setShowSoulLetters(false)}
      />
    </div>
  );
});

export default JournalScreen;
