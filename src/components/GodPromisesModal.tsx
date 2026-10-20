import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Shield, Anchor, Sun, Zap, Check, Share2, X, Volume2, Calendar } from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';
import { speechEngine } from '../utils/speechEngine';
import { getTodayPromise, getDailyRecord } from '../data/dailyCalendarData';

interface GodPromisesModalProps {
  isOpen: boolean;
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
  onOpenShareCard?: () => void;
}

export interface PromiseItem {
  id: string;
  categoryEs: string;
  categoryEn: string;
  icon: React.ElementType;
  verse: string;
  passageEs: string;
  passageEn: string;
  meditationEs: string;
  meditationEn: string;
  declarationEs: string;
  declarationEn: string;
}

export const GOD_PROMISES: PromiseItem[] = [
  {
    id: 'ansiedad',
    categoryEs: 'En la Ansiedad',
    categoryEn: 'In Anxiety',
    icon: Shield,
    verse: 'Isaías 41:10',
    passageEs: '«No tengas miedo, porque estoy contigo. No mires a tu alrededor con angustia, porque soy tu Dios. Te daré fuerza y te ayudaré; sí, mi mano derecha fiel te sostendrá.»',
    passageEn: '«Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.»',
    meditationEs: 'Dios no te pide que seas fuerte por tus propias fuerzas hoy. Su mano derecha sostiene tu vida en este preciso instante.',
    meditationEn: 'God is not asking you to be strong in your own power today. His right hand holds your life at this very moment.',
    declarationEs: 'Hoy suelto la angustia. El Creador del universo cuida de mi mente y de mi futuro.',
    declarationEn: 'Today I release anxiety. The Creator of the universe watches over my mind and my future.',
  },
  {
    id: 'cansancio',
    categoryEs: 'En el Cansancio',
    categoryEn: 'In Weariness',
    icon: Anchor,
    verse: 'Mateo 11:28',
    passageEs: '«Vengan a mí todos los que están cansados y cargados, y yo les daré descanso. Tomen mi yugo sobre ustedes y aprendan de mí… y hallarán descanso para sus almas.»',
    passageEn: '«Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you... and you will find rest for your souls.»',
    meditationEs: 'Puedes quitarte la armadura ante Su presencia. Hay un reposo verdadero y profundo esperando por ti.',
    meditationEn: 'You can lay down your armor in His presence. True and deep rest awaits you.',
    declarationEs: 'Entrego las cargas que no me pertenecen. Mi alma descansa en la gracia de Jesús.',
    declarationEn: 'I hand over the burdens that do not belong to me. My soul rests in the grace of Jesus.',
  },
  {
    id: 'soledad',
    categoryEs: 'En la Soledad',
    categoryEn: 'In Loneliness',
    icon: Heart,
    verse: 'Hebreos 13:5',
    passageEs: '«Nunca te dejaré ni te abandonaré. Así podemos decir con confianza: El Señor es mi ayudador; no temeré. ¿Qué me puede hacer el hombre?»',
    passageEn: '«I will never leave you nor forsake you; so we can confidently say, "The Lord is my helper; I will not fear."»',
    meditationEs: 'Aun cuando te sientas incomprendida por el mundo, Jesús camina al lado tuyo en el silencio.',
    meditationEn: 'Even when you feel misunderstood by the world, Jesus walks beside you in the quiet.',
    declarationEs: 'Nunca estoy sola. La presencia dulce de Dios llena cada rincón de mi vida.',
    declarationEn: 'I am never alone. God’s sweet presence fills every corner of my life.',
  },
  {
    id: 'futuro',
    categoryEs: 'Miedo al Futuro',
    categoryEn: 'Fear of Future',
    icon: Sun,
    verse: 'Jeremías 29:11',
    passageEs: '«Yo conozco mis pensamientos acerca de ustedes, dice el Señor. Son pensamientos de paz y no de desgracia, para darles esperanza al final.»',
    passageEn: '«For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.»',
    meditationEs: 'Tu historia no está a la deriva. Dios ya ha diseñado un camino de paz y esperanza para ti.',
    meditationEn: 'Your story is not drifting. God has already designed a path of peace and hope for you.',
    declarationEs: 'Mi mañana está seguro en las manos del Padre. Camino con fe y sin pánico.',
    declarationEn: 'My tomorrow is secure in the Father’s hands. I walk in faith without panic.',
  },
  {
    id: 'necesidad',
    categoryEs: 'En la Necesidad',
    categoryEn: 'In Need',
    icon: Zap,
    verse: 'Filipenses 4:19',
    passageEs: '«Mi Dios suplirá todo lo que les falte, conforme a sus riquezas en gloria en Cristo Jesús.»',
    passageEn: '«And my God will supply every need of yours according to his riches in glory in Christ Jesus.»',
    meditationEs: 'Los recursos terrenales son limitados, pero las riquezas celestiales de Dios jamás se agotan.',
    meditationEn: 'Earthly resources are limited, but God’s heavenly riches never run dry.',
    declarationEs: 'Confío en la provisión perfecta de mi Padre celestial. Él proveerá a Su tiempo.',
    declarationEn: 'I trust my heavenly Father’s perfect provision. He will supply in His time.',
  },
  {
    id: 'dolor',
    categoryEs: 'En el Dolor o Duelo',
    categoryEn: 'In Grief or Pain',
    icon: Sparkles,
    verse: 'Salmos 34:18',
    passageEs: '«El Señor está cerca de los de corazón quebrantado; salva a quienes tienen el espíritu abatido. Muchas son las angustias del justo, pero el Señor lo saca a salvo de todas ellas.»',
    passageEn: '«The Lord is near to the brokenhearted and saves the crushed in spirit. Many are the afflictions of the righteous, but the Lord delivers him out of them all.»',
    meditationEs: 'Tus lágrimas son sagradas para Dios. Él no mira de lejos tu dolor; se acerca y abraza tu corazón.',
    meditationEn: 'Your tears are sacred to God. He does not watch your pain from afar; He draws near and holds your heart.',
    declarationEs: 'Mi corazón roto está protegido por Dios. Él restaura mis fuerzas y me consuela.',
    declarationEn: 'My broken heart is sheltered by God. He restores my strength and comforts me.',
  },
];

export const GodPromisesModal: React.FC<GodPromisesModalProps> = ({
  isOpen,
  language,
  theme,
  onClose,
  onOpenShareCard,
}) => {
  const [selectedPromiseId, setSelectedPromiseId] = useState<string>('hoy');
  const [claimedPromises, setClaimedPromises] = useState<Record<string, boolean>>({});
  const [isPlayingAudioSim, setIsPlayingAudioSim] = useState(false);

  if (!isOpen) return null;

  const dailyPromiseData = getTodayPromise();
  const dailyRecord = getDailyRecord();

  const todayPromiseItem: PromiseItem = {
    id: 'hoy',
    categoryEs: `Promesa de Hoy (${dailyRecord.dateFormattedEs})`,
    categoryEn: `Today's Promise (${dailyRecord.dateFormattedEn})`,
    icon: Sparkles,
    verse: dailyPromiseData.verseRefEs,
    passageEs: dailyPromiseData.passageEs,
    passageEn: dailyPromiseData.passageEn,
    meditationEs: dailyPromiseData.meditationEs,
    meditationEn: dailyPromiseData.meditationEn,
    declarationEs: dailyPromiseData.declarationEs,
    declarationEn: dailyPromiseData.declarationEn,
  };

  const allPromises = [todayPromiseItem, ...GOD_PROMISES];

  const currentPromise = allPromises.find((p) => p.id === selectedPromiseId) || allPromises[0];
  const isClaimed = !!claimedPromises[currentPromise.id];

  const handleClaim = () => {
    setClaimedPromises((prev) => ({
      ...prev,
      [currentPromise.id]: true,
    }));
  };

  // Preload promise audio for zero latency
  useEffect(() => {
    const textToSpeak = language === 'es'
      ? `${currentPromise.verse}. ${currentPromise.passageEs}. Reflexión: ${currentPromise.meditationEs}`
      : `${currentPromise.verse}. ${currentPromise.passageEn}. Reflection: ${currentPromise.meditationEn}`;
    speechEngine.preload(textToSpeak, undefined, language);
  }, [currentPromise, language]);

  const handleSimulateAudio = () => {
    if (isPlayingAudioSim) {
      speechEngine.stop();
      setIsPlayingAudioSim(false);
      return;
    }

    setIsPlayingAudioSim(true);
    const textToSpeak = language === 'es'
      ? `${currentPromise.verse}. ${currentPromise.passageEs}. Reflexión: ${currentPromise.meditationEs}`
      : `${currentPromise.verse}. ${currentPromise.passageEn}. Reflection: ${currentPromise.meditationEn}`;

    speechEngine.speak({
      text: textToSpeak,
      language,
      onEnd: () => setIsPlayingAudioSim(false),
      onError: () => setIsPlayingAudioSim(false),
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
        theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
      }`}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col transition-all backdrop-blur-2xl liquid-glass"
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

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: theme.cardBorder,
            color: theme.text,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md p-2 border"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <Sparkles className="w-6 h-6" style={{ color: theme.accent }} />
          </div>
          <div>
            <h2 className="font-serif-scripture font-bold text-xl" style={{ color: theme.text }}>
              {language === 'es' ? 'Promesas del Padre para tu Alma' : 'Father’s Promises for Your Soul'}
            </h2>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'es' ? 'Encuentra consuelo y verdad según lo que sientes hoy' : 'Find comfort and truth for what you feel today'}
            </p>
          </div>
        </div>

        {/* Promise Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
          {allPromises.map((p) => {
            const isSelected = p.id === selectedPromiseId;
            const IconComp = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPromiseId(p.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shadow-sm active:scale-95"
                style={{
                  backgroundColor: isSelected ? theme.accent : theme.accentBg,
                  color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                  borderColor: isSelected ? theme.accent : theme.accentBorder,
                }}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{language === 'es' ? p.categoryEs : p.categoryEn}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Promise Main Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Scripture Card */}
          <div
            className="p-5 rounded-2xl border liquid-glass-subtle space-y-3 relative overflow-hidden"
            style={{ borderColor: theme.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border shadow-sm"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.accent,
                  borderColor: theme.accentBorder,
                }}
              >
                {currentPromise.verse}
              </span>

              {/* Audio Meditation Trigger */}
              <button
                onClick={handleSimulateAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm active:scale-95"
                style={{
                  backgroundColor: isPlayingAudioSim ? theme.accent : theme.accentBg,
                  color: isPlayingAudioSim ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                  borderColor: theme.accentBorder,
                }}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudioSim ? (language === 'es' ? 'Detener' : 'Stop') : (language === 'es' ? 'Escuchar' : 'Listen')}</span>
              </button>
            </div>

            <p
              className="font-serif-scripture italic text-base sm:text-lg leading-relaxed font-semibold"
              style={{ color: theme.text }}
            >
              {language === 'es' ? currentPromise.passageEs : currentPromise.passageEn}
            </p>

            <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2">
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                <span className="font-bold">{language === 'es' ? 'Reflexión:' : 'Reflection:'}</span>{' '}
                {language === 'es' ? currentPromise.meditationEs : currentPromise.meditationEn}
              </p>
            </div>
          </div>

          {/* Faith Declaration Box */}
          <div
            className="p-4 rounded-2xl border liquid-glass-subtle"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: theme.accent }}>
              {language === 'es' ? 'Declaración de fe para proclamar:' : 'Faith declaration to proclaim:'}
            </p>
            <p className="text-xs font-serif-scripture italic font-bold" style={{ color: theme.text }}>
              «{language === 'es' ? currentPromise.declarationEs : currentPromise.declarationEn}»
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-2">
          <button
            onClick={handleClaim}
            className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            style={{
              backgroundColor: isClaimed ? '#10B981' : theme.accent,
              color: '#FFFFFF',
            }}
          >
            <Check className="w-4 h-4" />
            <span>
              {isClaimed
                ? language === 'es'
                  ? '¡Promesa reclamada en fe!'
                  : 'Promise claimed in faith!'
                : language === 'es'
                ? 'Reclamar esta Promesa en mi corazón'
                : 'Claim this Promise in my heart'}
            </span>
          </button>

          {onOpenShareCard && (
            <button
              onClick={() => {
                onClose();
                onOpenShareCard();
              }}
              className="p-3 rounded-2xl border cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
              style={{
                backgroundColor: theme.accentBg,
                borderColor: theme.accentBorder,
                color: theme.accent,
              }}
              title={language === 'es' ? 'Compartir en tarjeta' : 'Share as card'}
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
