import React, { useState } from 'react';
import {
  Heart,
  Flame,
  Radio,
  Sparkles,
  Users,
  Home,
  Plus,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  Send,
  Flag,
  Check,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  PhoneOff,
  BookOpen,
  Lightbulb,
  Bookmark,
  Compass,
  Share2,
  Monitor,
  Grid,
  Wifi,
  Zap,
} from 'lucide-react';
import { Language, LivePrayerRoom, PrayerCommunityItem } from '../types';
import { COMMUNITY_PRAYERS, LIVE_PRAYER_ROOMS } from '../data/havahData';
import { ThemeColors } from '../theme';
import { storage } from '../utils/storage';

// Rich books & tips datasets with complete Spanish & English translations
const YOUNG_WOMEN_BOOKS = [
  {
    id: 'yb1',
    titleEs: 'El Arte de la Espera Activa',
    titleEn: 'The Art of Active Waiting',
    tagEs: 'Propósito & Libertad',
    tagEn: 'Purpose & Freedom',
    readingTimeEs: '6 min de lectura',
    readingTimeEn: '6 min read',
    authorEs: 'Ediciones HAVAH • Guía para Mujeres Jóvenes',
    authorEn: 'HAVAH Editions • Young Women Guide',
    summaryEs:
      'La soltería no es una sala de espera estática ni un estado incompleto. Es una temporada fértil para sembrar proyectos con audacia, cultivar amistades de valor y afirmarte en tu identidad sin depender de la aprobación ajena.',
    summaryEn:
      'Singleness is not a stagnant waiting room or an incomplete state. It is a fertile season to boldly cultivate projects, build noble friendships, and anchor your identity in God without needing external validation.',
    keyQuoteEs:
      '«Tu valor no se mide por las expectativas sociales ni por tu estado civil. Se construye en la dignidad de cada decisión que tomas hoy.»',
    keyQuoteEn:
      '“Your worth is not defined by social expectations or marital status. It is anchored in the dignity of every choice you make with God today.”',
    practicalTipEs:
      'Dedica esta semana una tarde libre a solas, sin pantallas ni ruido, para escribir en tu diario los tres sueños más importantes que deseas cosechar este año.',
    practicalTipEn:
      'Dedicate a quiet screen-free afternoon this week to write down in your journal the three most important dreams you wish to nurture this year.',
  },
  {
    id: 'yb2',
    titleEs: 'Límites del Corazón y Amistades Nobles',
    titleEn: 'Heart Boundaries & Noble Friendships',
    tagEs: 'Relaciones & Sabiduría',
    tagEn: 'Relationships & Wisdom',
    readingTimeEs: '5 min de lectura',
    readingTimeEn: '5 min read',
    authorEs: 'Manual de Cuidado Emocional',
    authorEn: 'Emotional Care Handbook',
    summaryEs:
      'Saber decir «no» con cortesía y serenidad es una de las evidencias más altas de madurez. Este compendio ofrece claves para cuidar tu paz, establecer fronteras sanas en tus relaciones y rodearte de personas que eleven tu fe.',
    summaryEn:
      'Knowing how to say “no” with gentle grace is a high mark of maturity. This guide offers insights to protect your peace, establish healthy relational boundaries, and walk with companions who lift your faith.',
    keyQuoteEs:
      '«Un no dicho a tiempo con paz preserva un sí lleno de verdad para tu futuro.»',
    keyQuoteEn:
      '“A timely ‘no’ spoken in peace preserves a truthful, life-giving ‘yes’ for your God-given future.”',
    practicalTipEs:
      'Haz un inventario consciente de tus círculos. Prioriza compartir tu vulnerabilidad con personas que demuestren lealtad y empatía constante.',
    practicalTipEn:
      'Take a mindful inventory of your inner circle. Share vulnerability only with friends who consistently demonstrate loyalty and tender empathy.',
  },
  {
    id: 'yb3',
    titleEs: 'Vocación, Mente y Claridad Profesional',
    titleEn: 'Vocation, Mind & Professional Clarity',
    tagEs: 'Trabajo & Paz Interior',
    tagEn: 'Work & Inner Peace',
    readingTimeEs: '7 min de lectura',
    readingTimeEn: '7 min read',
    authorEs: 'Guía de Excelencia con Propósito',
    authorEn: 'Purposeful Excellence Guide',
    summaryEs:
      'Herramientas sencillas para desarrollar tus talentos en el trabajo o en los estudios sin caer en el agotamiento ni en la comparación tóxica de las redes sociales.',
    summaryEn:
      'Practical wisdom to develop your talents in studies or career without falling prey to burnout or the toxic comparison of social media.',
    keyQuoteEs:
      '«El trabajo es una herramienta para crear y servir, jamás un pedestal para medir tu valor humano.»',
    keyQuoteEn:
      '“Work is a blessed instrument to create and serve, never a pedestal to measure your human soul worth.”',
    practicalTipEs:
      'Apaga las notificaciones de redes sociales al despertar y regálate 15 minutos de lectura o silencio antes de revisar pendientes laborales.',
    practicalTipEn:
      'Turn off social notifications upon waking and give yourself 15 minutes of scripture or quiet contemplation before checking work emails.',
  },
];

const YOUNG_WOMEN_TIPS = [
  {
    id: 'yt1',
    titleEs: 'El mito de la "antesala de la vida"',
    titleEn: 'The Myth of Life’s "Waiting Room"',
    categoryEs: 'Perspectiva',
    categoryEn: 'Perspective',
    textEs: 'La soltería no es un estado temporal mientras la vida real sucede. Es la vida real sucediendo ahora mismo. Disfruta de la libertad para crear, aprender, viajar y edificar tu carácter en paz.',
    textEn: 'Singleness is not an intermission while real life waits. Real life is happening right now. Enjoy the freedom to create, learn, travel, and anchor your character in peace.',
  },
  {
    id: 'yt2',
    titleEs: 'Criterio frente a la presión social',
    titleEn: 'Grace Under Social Pressure',
    categoryEs: 'Salud Emocional',
    categoryEn: 'Emotional Health',
    textEs: 'Cuando te pregunten sobre tus tiempos o proyectos personales, responde con serenidad: «Estoy disfrutando de construir mi presente en paz». No necesitas dar explicaciones ni apresurar tus etapas.',
    textEn: 'When asked intrusive questions about your personal timeline, smile and answer: “I am peacefully enjoying building my present.” You do not need to rush God’s seasons.',
  },
  {
    id: 'yt3',
    titleEs: 'Cultiva dos amistades de oro',
    titleEn: 'Nurture Two Golden Friendships',
    categoryEs: 'Comunidad',
    categoryEn: 'Community',
    textEs: 'No necesitas cientos de conocidos. Cultiva al menos dos amistades profundas con quienes puedas llorar, reír y orar sin máscaras ni temor al juicio.',
    textEn: 'You do not need hundreds of casual acquaintances. Cultivate at least two soul-deep friendships where you can weep, laugh, and pray without masks.',
  },
  {
    id: 'yt4',
    titleEs: 'El hábito de la belleza cotidiana',
    titleEn: 'The Habit of Everyday Beauty',
    categoryEs: 'Hogar & Bienestar',
    categoryEn: 'Home & Wellbeing',
    textEs: 'Aprende a cocinar para ti con esmero, prepara una mesa bonita para tus desayunos y mantén tu espacio ordenado. Cuidar de tu entorno es un acto diario de amor propio.',
    textEn: 'Cook nourishing meals for yourself with care, set a lovely table for morning tea, and keep your space ordered. Honoring your sanctuary is a daily act of grace.',
  },
];

const MARRIAGE_BOOKS = [
  {
    id: 'mb1',
    titleEs: 'La Arquitectura de la Escucha en el Hogar',
    titleEn: 'The Architecture of Gentle Listening',
    tagEs: 'Comunicación & Pareja',
    tagEn: 'Communication & Marriage',
    readingTimeEs: '8 min de lectura',
    readingTimeEn: '8 min read',
    authorEs: 'Manual de Inteligencia Matrimonial HAVAH',
    authorEn: 'HAVAH Marriage Wisdom Handbook',
    summaryEs:
      'Rara vez los desacuerdos matrimoniales ocurren por falta de amor; suelen surgir por falta de una escucha consciente. Este libro enseña a desarmar la actitud defensiva, comprender la necesidad detrás del enfado y dialogar con serenidad.',
    summaryEn:
      'Marital friction rarely stems from a lack of love; it often arises from hurried, defensive listening. Learn to soften defensiveness, discern the tender need beneath frustration, and speak in calm.',
    keyQuoteEs:
      '«Escuchar para comprender, jamás para responder. En el matrimonio, la meta nunca es ganar una discusión, sino cuidar el vínculo.»',
    keyQuoteEn:
      '“Listen to understand, never to defend. In marriage, the goal is never to win an argument, but to shelter the sacred bond.”',
    practicalTipEs:
      'Cuando surja un desacuerdo, tómense de las manos antes de responder. Hablar en un tono bajo y pausado desarma de inmediato la tensión.',
    practicalTipEn:
      'When tension surfaces, take each other’s hands before speaking. Speaking in a quiet, unhurried cadence dissolves defensiveness instantly.',
  },
  {
    id: 'mb2',
    titleEs: 'Transformar la Casa en un Hogar de Paz',
    titleEn: 'Turning a House into a Peaceful Home',
    tagEs: 'Cultura de Hogar',
    tagEn: 'Home Culture',
    readingTimeEs: '6 min de lectura',
    readingTimeEn: '6 min read',
    authorEs: 'Sanatorio Emocional para la Familia',
    authorEn: 'Family Emotional Sanctuary',
    summaryEs:
      'Un hogar es mucho más que un lugar físico con muebles. Es la atmósfera emocional que construyen cada día. Descubre cómo transformar la sala y la cocina en un espacio donde cada integrante anhele regresar a descansar.',
    summaryEn:
      'A home is far more than four walls and furniture. It is the emotional atmosphere you cultivate every sunrise. Discover how to make your home a refuge everyone longs to return to.',
    keyQuoteEs:
      '«La paz del hogar se siembra en los detalles: el tono de voz al saludarse, el olor a café y la paciencia compartida.»',
    keyQuoteEn:
      '“Home peace is seeded in small graces: the warm tone of greeting at the door, the aroma of tea, and patient tenderness.”',
    practicalTipEs:
      'Dejen los teléfonos móviles fuera de la mesa al cenar. Dediquen 20 minutos tranquilos para conversar sobre los momentos bonitos del día.',
    practicalTipEn:
      'Leave cell phones away from the dinner table. Spend 20 unhurried minutes asking about the sweetest, most comforting moments of each other’s day.',
  },
  {
    id: 'mb3',
    titleEs: 'El Milagro del Perdón Diario',
    titleEn: 'The Daily Miracle of Forgiveness',
    tagEs: 'Convivencia & Intimidad',
    tagEn: 'Everyday Grace & Intimacy',
    readingTimeEs: '5 min de lectura',
    readingTimeEn: '5 min read',
    authorEs: 'Restauración y Renovación del Amor',
    authorEn: 'Love Restoration & Renewal',
    summaryEs:
      'Mantener viva la complicidad y el afecto a lo largo de los años exige la disciplina humilde de soltar las pequeñas ofensas antes de que se conviertan en distancia.',
    summaryEn:
      'Sustaining closeness and romantic warmth across decades requires the humble daily habit of releasing petty irritations before they harden into emotional distance.',
    keyQuoteEs:
      '«No acumulen cuentas pendientes. El amor se renueva cada noche al elegir perdonar antes de cerrar los ojos.»',
    keyQuoteEn:
      '“Keep no scorecards. Love is reborn every evening when we choose gentle forgiveness before closing our eyes.”',
    practicalTipEs:
      'Si hubo un momento áspero durante el día, acércate antes de dormir con un gesto amable y di: «Te amo, estemos en paz».',
    practicalTipEn:
      'If friction occurred today, reach out tenderly before bedtime and whisper: “I love you dearly; let our home sleep in peace.”',
  },
];

const MARRIAGE_TIPS = [
  {
    id: 'mt1',
    titleEs: 'La regla de los 5 minutos de calma',
    titleEn: 'The 5-Minute Cool Down Rule',
    categoryEs: 'Resolución de Conflictos',
    categoryEn: 'Conflict Resolution',
    textEs: 'Si la conversación sobre presupuestos u hogar comienza a calentarse, pidan una pausa serena: «Nos amamos, tomemos 5 minutos de agua y calma antes de seguir conversando».',
    textEn: 'If a discussion about finances or chores starts to heat up, ask for a gentle pause: “We love each other deeply; let’s take 5 minutes with a glass of water before continuing.”',
  },
  {
    id: 'mt2',
    titleEs: 'La cita semanal no negociable',
    titleEn: 'The Non-Negotiable Weekly Date',
    categoryEs: 'Complicidad',
    categoryEn: 'Connection',
    textEs: 'Aunque sean 45 minutos para caminar juntos por el barrio o tomar un té en la terraza, protejan una cita semanal a solas sin hablar de facturas o tareas del hogar.',
    textEn: 'Even if it is just a 40-minute sunset stroll or tea on the porch, safeguard a weekly date with no talk of household chores or bills.',
  },
  {
    id: 'mt3',
    titleEs: 'Elogiar al cónyuge en público',
    titleEn: 'Honor Your Spouse in Public',
    categoryEs: 'Edificación',
    categoryEn: 'Edification',
    textEs: 'Hablar bien de tu pareja frente a amigos, familiares y en especial frente a los hijos, siembra una sensación de seguridad indestructible en toda la casa.',
    textEn: 'Speaking honorably of your spouse before friends, family, and especially your children plants an unbreakable foundation of emotional security at home.',
  },
  {
    id: 'mt4',
    titleEs: 'Pequeños detalles que renuevan el afecto',
    titleEn: 'Small Graces that Rekindle Affection',
    categoryEs: 'Cariño Cotidiano',
    categoryEn: 'Daily Affection',
    textEs: 'Un mensaje corto a mitad de la tarde que diga «estaba pensando en ti y dando gracias a Dios por tu vida» fortalece el corazón durante una jornada agotadora.',
    textEn: 'A midday text saying “I was just thanking God for you and praying over your day” restores the soul during a tiring afternoon.',
  },
];

interface CommunityScreenProps {
  language: Language;
  theme: ThemeColors;
  onOpenHavahPlus: () => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = React.memo(({
  language,
  theme,
  onOpenHavahPlus,
}) => {
  // Sub-view: null = Hub view, or 'peticiones' | 'ayuno' | 'envivo' | 'testimonios' | 'jovenes' | 'casadas' | 'todas'
  const [selectedSubView, setSelectedSubView] = useState<string | null>(null);
  const [circleSubTab, setCircleSubTab] = useState<'libros' | 'tips' | 'peticiones'>('libros');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Community Prayers State persisted to storage
  const [prayersList, setPrayersList] = useState<PrayerCommunityItem[]>(() => storage.getCommunityPrayers());

  React.useEffect(() => {
    storage.saveCommunityPrayers(prayersList);
  }, [prayersList]);

  const getTopicLabel = (topic: string) => {
    if (language === 'es') return topic;
    const map: Record<string, string> = {
      Peticiones: 'Requests',
      Ayuno: 'Fasting',
      Estudios: 'Studies',
      Solteras: 'Singles',
      Casadas: 'Families',
      Testimonio: 'Testimonies',
      General: 'General',
    };
    return map[topic] || topic;
  };

  const getRoomTypeLabel = (type: string) => {
    if (language === 'es') return type;
    const map: Record<string, string> = {
      'Videollamada en Vivo': 'Live HD Video Call',
      'Estudio en Video': 'Live Video Study',
      'Matrimonios HD': 'Marriage HD Video',
      'Videollamada de Jóvenes': 'Youth Video Call',
    };
    return map[type] || type;
  };

  // Interactive Live Room State (Zoom HD Multi-Participant Video Call)
  const [activeLiveRoom, setActiveLiveRoom] = useState<LivePrayerRoom | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoCallViewMode, setVideoCallViewMode] = useState<'grid' | 'speaker'>('grid');
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [amenCount, setAmenCount] = useState(240);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveChatMessages, setLiveChatMessages] = useState<string[]>(() => [
    language === 'es'
      ? 'Priscila: Amén, qué paz me da saber que no estamos solas en este camino.'
      : 'Priscilla: Amen, what peace knowing we do not walk alone on this path.',
    language === 'es'
      ? 'Débora M.: «El Señor cuidará de ti en cada paso, descansa en Su paz» (Salmos 121).'
      : 'Deborah M.: “The Lord will watch over you at each step, rest in His peace” (Psalm 121).',
    language === 'es'
      ? 'Abigail: Acompañamos con mucho cariño las peticiones que hoy compartieron.'
      : 'Abigail: Lovingly holding all the requests shared today before the Lord.',
    language === 'es'
      ? 'Rut: Qué regalo este espacio donde podemos orar y reflexionar juntas sin prisa.'
      : 'Ruth: What a gift this space is to pray and reflect together without hurry.',
    language === 'es'
      ? 'Noemí S.: Dios renueva nuestras fuerzas y llena el corazón de tranquilidad hoy.'
      : 'Naomi S.: God renews our strength and fills every heart with deep tranquility today.',
  ]);

  React.useEffect(() => {
    setLiveChatMessages([
      language === 'es'
        ? 'Priscila: Amén, qué paz me da saber que no estamos solas en este camino.'
        : 'Priscilla: Amen, what peace knowing we do not walk alone on this path.',
      language === 'es'
        ? 'Débora M.: «El Señor cuidará de ti en cada paso, descansa en Su paz» (Salmos 121).'
        : 'Deborah M.: “The Lord will watch over you at each step, rest in His peace” (Psalm 121).',
      language === 'es'
        ? 'Abigail: Acompañamos con mucho cariño las peticiones que hoy compartieron.'
        : 'Abigail: Lovingly holding all the requests shared today before the Lord.',
      language === 'es'
        ? 'Rut: Qué regalo este espacio donde podemos orar y reflexionar juntas sin prisa.'
        : 'Ruth: What a gift this space is to pray and reflect together without hurry.',
      language === 'es'
        ? 'Noemí S.: Dios renueva nuestras fuerzas y llena el corazón de tranquilidad hoy.'
        : 'Naomi S.: God renews our strength and fills every heart with deep tranquility today.',
    ]);
  }, [language]);

  // Pledge / Intercession Altar Dialog
  const [intercessionTarget, setIntercessionTarget] = useState<PrayerCommunityItem | null>(null);
  const [selectedPromise, setSelectedPromise] = useState(
    language === 'es'
      ? 'Salmos 91:4 — Con su amor te cubrirá, y bajo sus alas estarás en paz.'
      : 'Psalm 91:4 — He will cover you with His feathers, and under His wings you will find refuge.'
  );
  const [customEncouragement, setCustomEncouragement] = useState('');
  const [intercessionSubmitted, setIntercessionSubmitted] = useState(false);

  // New Prayer Dialog
  const [showAddPrayerModal, setShowAddPrayerModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState('Peticiones');

  // Report Modal
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Handle "Orando" button click
  const handleTogglePraying = (prayerId: string) => {
    setPrayersList((prev) =>
      prev.map((item) => {
        if (item.id === prayerId) {
          const isCurrentlyPraying = !!item.userIsStandingInTheGap;
          return {
            ...item,
            candlesLit: isCurrentlyPraying ? Math.max(0, item.candlesLit - 1) : item.candlesLit + 1,
            userIsStandingInTheGap: !isCurrentlyPraying,
          };
        }
        return item;
      })
    );
  };

  // Handle intercession confirm
  const handleConfirmIntercession = () => {
    if (!intercessionTarget) return;
    const verseToAttach = customEncouragement.trim() || selectedPromise;
    setPrayersList((prev) =>
      prev.map((item) => {
        if (item.id === intercessionTarget.id) {
          return {
            ...item,
            candlesLit: item.userIsStandingInTheGap ? item.candlesLit : item.candlesLit + 1,
            userIsStandingInTheGap: true,
            lastBlessingVerse: verseToAttach,
          };
        }
        return item;
      })
    );
    setIntercessionSubmitted(true);
  };

  // Handle add new prayer
  const handleCreatePrayer = () => {
    if (!newContent.trim()) return;
    const newPrayer: PrayerCommunityItem = {
      id: `prayer_${Date.now()}`,
      author: newAuthor.trim() || (language === 'es' ? 'Hermana en la fe' : 'Sister in faith'),
      titleEs: newTitle.trim() || (language === 'es' ? 'Motivo de oración' : 'Prayer Request'),
      titleEn: newTitle.trim() || 'Prayer Request',
      contentEs: newContent.trim(),
      contentEn: newContent.trim(),
      topic: newTopic,
      candlesLit: 1,
      timestampLabelEs: language === 'es' ? 'Hace un momento' : 'Just now',
      timestampLabelEn: 'Just now',
      userIsStandingInTheGap: true,
    };
    setPrayersList([newPrayer, ...prayersList]);
    setShowAddPrayerModal(false);
    setNewAuthor('');
    setNewTitle('');
    setNewContent('');
  };

  const promiseOptionsEs = [
    'Salmos 91:4 — Con su amor te cubrirá, y bajo sus alas estarás en paz.',
    'Isaías 41:10 — No temas, porque yo estoy contigo; confía, yo soy tu Dios y te sostengo.',
    'Éxodo 14:14 — El Señor peleará por ti; quédate tranquila y en calma.',
    'Filipenses 4:7 — La paz de Dios cuidará tu corazón y tus pensamientos.',
    'Proverbios 31:25 — Fuerza y dignidad son su vestidura; y mira el futuro con una sonrisa.',
  ];

  const promiseOptionsEn = [
    'Psalm 91:4 — He will cover you with His feathers, and under His wings you will find refuge.',
    'Isaiah 41:10 — Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you.',
    'Exodus 14:14 — The Lord will fight for you; you need only to be still.',
    'Philippians 4:7 — And the peace of God will guard your hearts and your minds in Christ Jesus.',
    'Proverbs 31:25 — She is clothed with strength and dignity; she can laugh at the days to come.',
  ];

  const promiseOptions = language === 'es' ? promiseOptionsEs : promiseOptionsEn;

  // Filtering prayers
  const query = searchQuery.trim().toLowerCase();
  const filteredPrayers = prayersList.filter((item) => {
    const itemTitle = language === 'es' ? item.titleEs : item.titleEn;
    const itemContent = language === 'es' ? item.contentEs : item.contentEn;
    const matchesQuery =
      !query ||
      item.author.toLowerCase().includes(query) ||
      itemTitle.toLowerCase().includes(query) ||
      itemContent.toLowerCase().includes(query) ||
      item.topic.toLowerCase().includes(query);

    if (!matchesQuery) return false;

    if (selectedSubView === 'peticiones') {
      return item.topic === 'Peticiones' || item.topic === 'General';
    }
    if (selectedSubView === 'ayuno') {
      return item.topic.includes('Ayuno') || item.contentEs.toLowerCase().includes('ayuno');
    }
    if (selectedSubView === 'testimonios') {
      return item.topic.includes('Testimonio');
    }
    if (selectedSubView === 'jovenes') {
      return item.topic === 'Solteras' || item.topic.includes('Jóvenes');
    }
    if (selectedSubView === 'casadas') {
      return item.topic === 'Casadas' || item.topic.includes('Familia');
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* ============================================================ */}
      {/* 1. DEDICATED SUB-VIEW (Full Category View)                    */}
      {/* ============================================================ */}
      {selectedSubView ? (
        <div className="space-y-4">
          {/* Sub-view Header */}
          <div
            className="rounded-2xl p-4 border shadow-sm flex items-center justify-between sticky top-14 z-20 backdrop-blur-md"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSubView(null)}
                className="p-1.5 rounded-xl border transition-all cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.accent,
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {selectedSubView === 'peticiones'
                    ? language === 'es' ? 'Peticiones de Oración' : 'Prayer Requests'
                    : selectedSubView === 'ayuno'
                    ? language === 'es' ? 'Círculos de Ayuno e Intercesión' : 'Fasting & Intercession'
                    : selectedSubView === 'envivo'
                    ? language === 'es' ? 'Salas de Oración en Vivo' : 'Live Prayer Rooms'
                    : selectedSubView === 'testimonios'
                    ? language === 'es' ? 'Testimonios y Gratitud' : 'Praise & Testimonies'
                    : selectedSubView === 'jovenes'
                    ? language === 'es' ? 'Jóvenes y Solteras' : 'Young Women & Singles'
                    : selectedSubView === 'casadas'
                    ? language === 'es' ? 'Matrimonios, Hogar y Familia' : 'Marriage & Family'
                    : language === 'es' ? 'Todas las Peticiones' : 'All Requests'}
                </h3>
                {/* Note: subtitle count rendered in DARK BRONZE in day mode, NOT yellow! */}
                <p className="text-[11px] font-semibold" style={{ color: theme.accent }}>
                  {selectedSubView === 'envivo'
                    ? `${LIVE_PRAYER_ROOMS.length} ${language === 'es' ? 'salas en vivo' : 'live rooms'}`
                    : `${filteredPrayers.length} ${language === 'es' ? 'motivos para sostener en oración' : 'petitions to uphold'}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl border transition-all cursor-pointer"
                style={{
                  backgroundColor: showSearch ? theme.accentBg : theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: showSearch ? theme.accent : theme.textMuted,
                }}
              >
                {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowAddPrayerModal(true)}
                className="p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: theme.accent,
                  borderColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
                title={language === 'es' ? 'Compartir petición' : 'Share request'}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          {showSearch && (
            <div
              className="rounded-2xl p-3 border animate-fade-in"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? 'Buscar por nombre, motivo o necesidad...'
                      : 'Search by name, request or need...'
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border outline-none"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: theme.textMuted }} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs opacity-70 hover:opacity-100 cursor-pointer"
                    style={{ color: theme.textMuted }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sub-view Category Switcher Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'peticiones', label: language === 'es' ? 'Peticiones' : 'Prayers' },
              { id: 'ayuno', label: language === 'es' ? 'Ayuno (Isaías 58)' : 'Fasting' },
              { id: 'envivo', label: language === 'es' ? 'Salas en Vivo' : 'Live Rooms' },
              { id: 'testimonios', label: language === 'es' ? 'Testimonios' : 'Praise' },
              { id: 'jovenes', label: language === 'es' ? 'Jóvenes' : 'Youth' },
              { id: 'casadas', label: language === 'es' ? 'Familias' : 'Families' },
              { id: 'todas', label: language === 'es' ? 'Todas' : 'All' },
            ].map((cat) => {
              const isSelected = selectedSubView === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSubView(cat.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: isSelected ? theme.accent : theme.cardVariant,
                    borderColor: isSelected ? theme.accent : theme.cardBorder,
                    color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sub-view content: Live Rooms, Specialized Circles (Jóvenes / Matrimonios) or Individual Prayer Boxes */}
          {selectedSubView === 'jovenes' || selectedSubView === 'casadas' ? (
            /* SPECIALIZED CIRCLE VIEW (BOOKS + TIPS + PRAYERS) */
            <div className="space-y-4">
              {/* Circle Sub-Navigation Bar */}
              <div
                className="p-1.5 rounded-2xl border flex items-center gap-1 liquid-glass-subtle"
                style={{ borderColor: theme.cardBorder }}
              >
                <button
                  onClick={() => setCircleSubTab('libros')}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    backgroundColor: circleSubTab === 'libros' ? theme.accent : 'transparent',
                    color: circleSubTab === 'libros' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Libros Recomendados' : 'Books'}</span>
                </button>

                <button
                  onClick={() => setCircleSubTab('tips')}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    backgroundColor: circleSubTab === 'tips' ? theme.accent : 'transparent',
                    color: circleSubTab === 'tips' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                  }}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Consejos & Tips' : 'Tips'}</span>
                </button>

                <button
                  onClick={() => setCircleSubTab('peticiones')}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    backgroundColor: circleSubTab === 'peticiones' ? theme.accent : 'transparent',
                    color: circleSubTab === 'peticiones' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                  }}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Oraciones' : 'Prayers'}</span>
                </button>
              </div>

              {/* 1. BOOKS TAB */}
              {circleSubTab === 'libros' && (
                <div className="space-y-3.5 animate-fade-in">
                  {(selectedSubView === 'jovenes' ? YOUNG_WOMEN_BOOKS : MARRIAGE_BOOKS).map((book) => (
                    <div
                      key={book.id}
                      className="rounded-3xl p-5 border shadow-md transition-all space-y-3 liquid-glass"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.cardBorder,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide uppercase inline-block mb-1.5"
                            style={{
                              backgroundColor: theme.accentBg,
                              color: theme.accent,
                              borderColor: theme.accentBorder,
                            }}
                          >
                            {language === 'es' ? book.tagEs : book.tagEn}
                          </span>
                          <h4 className="font-serif-scripture font-bold text-lg leading-snug" style={{ color: theme.text }}>
                            {language === 'es' ? book.titleEs : book.titleEn}
                          </h4>
                          <p className="text-xs font-medium" style={{ color: theme.accent }}>
                            {(language === 'es' ? book.authorEs : book.authorEn)} • {(language === 'es' ? book.readingTimeEs : book.readingTimeEn)}
                          </p>
                        </div>

                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: theme.accentBg,
                            borderColor: theme.accentBorder,
                          }}
                        >
                          <BookOpen className="w-5 h-5" style={{ color: theme.accent }} />
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                        {language === 'es' ? book.summaryEs : book.summaryEn}
                      </p>

                      {/* Key Quote */}
                      <div
                        className="p-3.5 rounded-2xl border font-serif-scripture italic text-xs leading-relaxed"
                        style={{
                          backgroundColor: theme.accentBg,
                          borderColor: theme.accentBorder,
                          color: theme.text,
                        }}
                      >
                        {language === 'es' ? book.keyQuoteEs : book.keyQuoteEn}
                      </div>

                      {/* Practical Tip */}
                      <div className="flex items-start gap-2.5 pt-1 text-xs" style={{ color: theme.textMuted }}>
                        <Compass className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.accent }} />
                        <span>
                          <strong style={{ color: theme.text }}>{language === 'es' ? 'Aplica hoy:' : 'Apply today:'}</strong>{' '}
                          {language === 'es' ? book.practicalTipEs : book.practicalTipEn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. TIPS TAB */}
              {circleSubTab === 'tips' && (
                <div className="space-y-3 animate-fade-in">
                  {(selectedSubView === 'jovenes' ? YOUNG_WOMEN_TIPS : MARRIAGE_TIPS).map((tip) => (
                    <div
                      key={tip.id}
                      className="rounded-2xl p-4.5 border shadow-sm transition-all space-y-2 liquid-glass-subtle"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.cardBorder,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                          style={{
                            backgroundColor: theme.accentBg,
                            color: theme.accent,
                            border: `1px solid ${theme.accentBorder}`,
                          }}
                        >
                          {language === 'es' ? tip.categoryEs : tip.categoryEn}
                        </span>
                        <Lightbulb className="w-4 h-4" style={{ color: theme.accent }} />
                      </div>

                      <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                        {language === 'es' ? tip.titleEs : tip.titleEn}
                      </h4>

                      <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                        {language === 'es' ? tip.textEs : tip.textEn}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. PRAYERS TAB */}
              {circleSubTab === 'peticiones' && (
                <div className="space-y-3.5 animate-fade-in">
                  {filteredPrayers.length === 0 ? (
                    <div
                      className="rounded-2xl p-8 border text-center"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.cardBorder,
                      }}
                    >
                      <p className="text-sm" style={{ color: theme.textMuted }}>
                        {language === 'es'
                          ? 'No hay peticiones registradas para este círculo aún.'
                          : 'No prayer requests in this circle yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredPrayers.map((prayer) => {
                      const isPraying = !!prayer.userIsStandingInTheGap;
                      return (
                        <div
                          key={prayer.id}
                          className="rounded-2xl p-5 border transition-all shadow-sm"
                          style={{
                            backgroundColor: theme.card,
                            borderColor: isPraying ? theme.accent : theme.cardBorder,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                  backgroundColor: theme.accentBg,
                                  color: theme.accent,
                                  border: `1px solid ${theme.accentBorder}`,
                                }}
                              >
                                {prayer.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold" style={{ color: theme.text }}>
                                  {prayer.author}
                                </h4>
                                <p className="text-[11px]" style={{ color: theme.textMuted }}>
                                  {language === 'es' ? prayer.timestampLabelEs : prayer.timestampLabelEn}
                                </p>
                              </div>
                            </div>

                            <span
                              className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                              style={{
                                backgroundColor: theme.accentBg,
                                color: theme.accent,
                                border: `1px solid ${theme.accentBorder}`,
                              }}
                            >
                              {prayer.topic}
                            </span>
                          </div>

                          <h4 className="font-serif-scripture font-bold text-base mb-1.5" style={{ color: theme.text }}>
                            {language === 'es' ? prayer.titleEs : prayer.titleEn}
                          </h4>

                          <p className="text-sm leading-relaxed mb-3" style={{ color: theme.textSecondary }}>
                            {language === 'es' ? prayer.contentEs : prayer.contentEn}
                          </p>

                          {prayer.lastBlessingVerse && (
                            <div
                              className="p-3 rounded-xl border mb-3 text-xs font-serif-scripture italic leading-relaxed"
                              style={{
                                backgroundColor: theme.accentBg,
                                borderColor: theme.accentBorder,
                                color: theme.accent,
                              }}
                            >
                              «{prayer.lastBlessingVerse}»
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.cardBorder }}>
                            <button
                              onClick={() => handleTogglePraying(prayer.id)}
                              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:opacity-90"
                              style={{
                                backgroundColor: isPraying ? theme.accent : theme.accentBg,
                                color: isPraying ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                                border: `1px solid ${isPraying ? theme.accent : theme.accentBorder}`,
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>
                                {isPraying
                                  ? language === 'es'
                                    ? `¡Orando por ti! (${prayer.candlesLit})`
                                    : `Praying for you! (${prayer.candlesLit})`
                                  : language === 'es'
                                  ? `Orando (${prayer.candlesLit})`
                                  : `Praying (${prayer.candlesLit})`}
                              </span>
                            </button>

                            <button
                              onClick={() => {
                                setIntercessionTarget(prayer);
                                setCustomEncouragement('');
                                setIntercessionSubmitted(false);
                              }}
                              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90"
                              style={{
                                backgroundColor: theme.cardVariant,
                                borderColor: theme.cardBorder,
                                color: theme.accent,
                              }}
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{language === 'es' ? 'Dejar versículo' : 'Send verse'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ) : selectedSubView === 'envivo' ? (
            /* LIVE ROOMS LIST */
            <div className="space-y-3">
              {LIVE_PRAYER_ROOMS.map((room) => (
                <div
                  key={room.id}
                  className="rounded-2xl p-5 border shadow-sm transition-all"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                        {room.type}
                      </span>
                    </div>
                    {/* Active count in dark bronze in day mode */}
                    <span className="text-xs font-bold" style={{ color: theme.accent }}>
                      {room.activeCount} {language === 'es' ? 'unidas' : 'joined'}
                    </span>
                  </div>

                  <h4 className="font-serif-scripture font-bold text-lg mb-1" style={{ color: theme.text }}>
                    {language === 'es' ? room.titleEs : room.titleEn}
                  </h4>

                  <p className="text-xs font-serif-scripture italic mb-2" style={{ color: theme.accent }}>
                    {room.scriptureFocus} • {language === 'es' ? `Guía: ${room.hostName}` : `Host: ${room.hostName}`}
                  </p>

                  <p className="text-xs leading-relaxed mb-4" style={{ color: theme.textMuted }}>
                    {language === 'es' ? room.descriptionEs : room.descriptionEn}
                  </p>

                  <button
                    onClick={() => setActiveLiveRoom(room)}
                    className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-sm hover:opacity-90"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.isDark ? '#000000' : '#FFFFFF',
                    }}
                  >
                    <Radio className="w-4 h-4" />
                    <span>{language === 'es' ? 'Entrar a la sala en vivo' : 'Join live prayer room'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* INDIVIDUAL PRAYER BOXES (Clean, high-contrast, comfortable to read) */
            <div className="space-y-3.5">
              {filteredPrayers.length === 0 ? (
                <div
                  className="rounded-2xl p-8 border text-center"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    {language === 'es'
                      ? 'No hay peticiones registradas con este filtro.'
                      : 'No prayer requests found for this filter.'}
                  </p>
                </div>
              ) : (
                filteredPrayers.map((prayer) => {
                  const isPraying = !!prayer.userIsStandingInTheGap;
                  return (
                    <div
                      key={prayer.id}
                      className="rounded-2xl p-5 border transition-all shadow-sm"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: isPraying ? theme.accent : theme.cardBorder,
                      }}
                    >
                      {/* Prayer Header: Avatar, Name, Time, Topic Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{
                              backgroundColor: theme.accentBg,
                              color: theme.accent,
                              border: `1px solid ${theme.accentBorder}`,
                            }}
                          >
                            {prayer.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold" style={{ color: theme.text }}>
                              {prayer.author}
                            </h4>
                            <p className="text-[11px]" style={{ color: theme.textMuted }}>
                              {language === 'es' ? prayer.timestampLabelEs : prayer.timestampLabelEn}
                            </p>
                          </div>
                        </div>

                        {/* Topic badge: uses theme.accent (dark bronze in Day mode, never yellow!) */}
                        <span
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: theme.accentBg,
                            color: theme.accent,
                            border: `1px solid ${theme.accentBorder}`,
                          }}
                        >
                          {prayer.topic}
                        </span>
                      </div>

                      {/* Prayer Title */}
                      <h4 className="font-serif-scripture font-bold text-base mb-1.5" style={{ color: theme.text }}>
                        {language === 'es' ? prayer.titleEs : prayer.titleEn}
                      </h4>

                      {/* Prayer Content */}
                      <p className="text-sm leading-relaxed mb-3" style={{ color: theme.textSecondary }}>
                        {language === 'es' ? prayer.contentEs : prayer.contentEn}
                      </p>

                      {/* Attached Blessing Verse (In dark bronze in Day mode, NOT yellow!) */}
                      {prayer.lastBlessingVerse && (
                        <div
                          className="p-3 rounded-xl border mb-3 text-xs font-serif-scripture italic leading-relaxed"
                          style={{
                            backgroundColor: theme.accentBg,
                            borderColor: theme.accentBorder,
                            color: theme.accent,
                          }}
                        >
                          «{prayer.lastBlessingVerse}»
                        </div>
                      )}

                      {/* Action Bar: "Orando" button + "Dejar versículo" + Report */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.cardBorder }}>
                        <button
                          onClick={() => handleTogglePraying(prayer.id)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:opacity-90"
                          style={{
                            backgroundColor: isPraying ? theme.accent : theme.accentBg,
                            color: isPraying ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                            border: `1px solid ${isPraying ? theme.accent : theme.accentBorder}`,
                          }}
                        >
                          <Heart className="w-4 h-4" />
                          <span>
                            {isPraying
                              ? language === 'es'
                                ? `¡Orando por ti! (${prayer.candlesLit})`
                                : `Praying for you! (${prayer.candlesLit})`
                              : language === 'es'
                              ? `Orando (${prayer.candlesLit})`
                              : `Praying (${prayer.candlesLit})`}
                          </span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setIntercessionTarget(prayer);
                              setCustomEncouragement('');
                              setIntercessionSubmitted(false);
                            }}
                            className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90"
                            style={{
                              backgroundColor: theme.cardVariant,
                              borderColor: theme.cardBorder,
                              color: theme.accent,
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{language === 'es' ? 'Dejar versículo' : 'Send verse'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setReportTargetId(prayer.id);
                              setReportReason('');
                              setReportSuccess(false);
                            }}
                            className="p-2 rounded-xl transition-colors hover:opacity-80 cursor-pointer"
                            style={{ color: theme.textMuted }}
                            title={language === 'es' ? 'Reportar petición' : 'Report request'}
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : (
        /* ============================================================ */
        /* 2. MAIN COMMUNITY HUB (Categorized Spaces Overview)          */
        /* ============================================================ */
        <div className="space-y-4">
          {/* Hub Header */}
          <div
            className="rounded-3xl p-5 border shadow-xl flex items-center justify-between backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.accentBorder}`,
                }}
              >
                <Heart className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                  {language === 'es' ? 'Comunidad y Acompañamiento' : 'Community & Fellowship'}
                </h3>
                <p className="text-xs" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Sostenernos en oración unas a otras' : 'Supporting one another in prayer'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddPrayerModal(true)}
              className="px-3.5 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: theme.accent,
                borderColor: theme.accent,
                color: theme.isDark ? '#000000' : '#FFFFFF',
              }}
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'es' ? 'Publicar' : 'Post'}</span>
            </button>
          </div>

          <div>
            <h4 className="font-serif-scripture font-bold text-base mb-1" style={{ color: theme.text }}>
              {language === 'es' ? 'Espacios de Acompañamiento y Fe' : 'Fellowship Spaces'}
            </h4>
            <p className="text-xs mb-3" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Toca cualquier espacio para abrirlo y leer los motivos de cada hermana.'
                : 'Tap any space to open and pray for every request.'}
            </p>
          </div>

          {/* 6 Category Hub Cards */}
          <div className="space-y-3.5">
            {/* 1. Peticiones de Oración */}
            <div
              onClick={() => setSelectedSubView('peticiones')}
              className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-2xl liquid-glass liquid-glass-interactive"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Heart className="w-5 h-5" style={{ color: theme.accent }} />
                  </div>
                  <div>
                    <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Peticiones de Oración' : 'Prayer Requests'}
                    </h4>
                    {/* Notice: in Day Mode, rendered in dark bronze, NOT yellow! */}
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      {prayersList.length} {language === 'es' ? 'peticiones de hermanas' : 'sister requests'}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Un espacio para compartir lo que pesa en el corazón y sentir el abrazo en oración de mujeres que creen juntas.'
                  : 'A space to share what weighs on your heart and feel the prayer support of women walking together.'}
              </p>
            </div>

            {/* 2. Círculos de Ayuno y Quietud (Isaías 58) */}
            <div
              onClick={() => setSelectedSubView('ayuno')}
              className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-2xl liquid-glass liquid-glass-interactive"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Flame className="w-5 h-5" style={{ color: theme.flame }} />
                  </div>
                  <div>
                    <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Círculos de Ayuno y Quietud' : 'Fasting & Quiet Circles'}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      {language === 'es' ? '35 unidas en consagración (Isaías 58)' : '35 joined in fasting'}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? '«El ayuno que Dios eligió: soltar ataduras, compartir el pan y cuidar el corazón» (Isaías 58). Aparta un tiempo en silencio para buscar paz y dirección.'
                  : '«The fast that God has chosen: to loose the chains of injustice and care for the heart» (Isaiah 58).'}
              </p>
            </div>

            {/* 3. Salas de Oración en Vivo */}
            <div
              onClick={() => setSelectedSubView('envivo')}
              className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-2xl liquid-glass liquid-glass-interactive"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Radio className="w-5 h-5" style={{ color: theme.accent }} />
                  </div>
                  <div>
                    <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Salas de Oración en Vivo' : 'Live Prayer Rooms'}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      {LIVE_PRAYER_ROOMS.length} {language === 'es' ? 'salas • 436 conectadas' : 'rooms • 436 joined'}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Encuentros de audio y devocional en tiempo real para leer la Palabra juntas y orar por nuestras familias.'
                  : 'Live audio and devotional spaces to read Scripture together and pray for families.'}
              </p>
            </div>

            {/* 4. Testimonios y Gratitud */}
            <div
              onClick={() => setSelectedSubView('testimonios')}
              className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-2xl liquid-glass liquid-glass-interactive"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: theme.accent }} />
                  </div>
                  <div>
                    <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Testimonios y Gratitud' : 'Praise & Testimonies'}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      {language === 'es' ? '18 oraciones contestadas' : '18 answered prayers'}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Historias reales de respuestas de Dios, gratitud por la salud, la restauración familiar y las pequeñas victorias de cada día.'
                  : 'Real stories of God’s faithfulness, gratitude for health, family healing, and daily victories.'}
              </p>
            </div>

            {/* 5. Jóvenes y Solteras */}
            <div
              onClick={() => setSelectedSubView('jovenes')}
              className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-2xl liquid-glass liquid-glass-interactive"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Users className="w-5 h-5" style={{ color: theme.accent }} />
                  </div>
                  <div>
                    <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Jóvenes y Solteras' : 'Young Women & Singles'}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      {language === 'es' ? 'Vocación, decisiones y paz interior' : 'Vocation, wise choices & peace'}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Conversaciones francas sobre tomar decisiones con sabiduría, aprender a esperar con calma y crecer en confianza con Dios.'
                  : 'Encouragement on making wise life choices, trusting God’s timing, and growing in inner strength.'}
              </p>
            </div>

            {/* 6. Matrimonios y Familias */}
            <div
              onClick={() => setSelectedSubView('casadas')}
              className="rounded-3xl p-5.5 border shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-2xl liquid-glass liquid-glass-interactive"
              style={{
                backgroundColor: theme.glassCard,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Home className="w-5 h-5" style={{ color: theme.accent }} />
                  </div>
                  <div>
                    <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Matrimonios, Hogar y Familias' : 'Marriage & Family'}
                    </h4>
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      {language === 'es' ? 'Sabiduría en la convivencia diaria' : 'Wisdom in daily home life'}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Acompañamiento en oración por nuestros hogares, hijos, relaciones conyugales y la prudencia para edificar en amor.'
                  : 'Standing in prayer for our households, children, relationships, and the wisdom to nurture love at home.'}
              </p>
            </div>
          </div>

          {/* 100% Transparente: Mayordomía Bíblica & Causas Sociales (Ubicación discreta y humilde al pie) */}
          <div
            className="rounded-2xl p-3.5 sm:p-4 border mt-6 transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b pb-2 mb-2" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.12)', color: theme.accent }}>
                  {language === 'es' ? '100% Transparente' : '100% Transparent'}
                </span>
                <span className="text-xs font-serif-scripture font-bold" style={{ color: theme.text }}>
                  {language === 'es' ? 'Causas Sociales e Impacto Comunitario' : 'Social Causes & Community Impact'}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-60" style={{ color: theme.textMuted }}>
                {language === 'es' ? '2 Corintios 8:21' : '2 Cor 8:21'}
              </span>
            </div>

            <p className="text-[11px] italic font-serif-scripture mb-1.5 opacity-80" style={{ color: theme.textMuted }}>
              «Having regard for honorable things, not only in the sight of the Lord, but also in the sight of men.»
            </p>

            <p className="text-[11px] leading-relaxed opacity-70" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Espacio de propósito futuro y mayordomía bíblica. Te invitamos a orar por los proyectos venideros. El Registro de Impacto Verificado se activará conforme consolidemos nuestra labor colectiva.'
                : 'Space of future purpose and biblical stewardship. The Verified Impact Log will activate as our collective mission grows.'}
            </p>

            <div className="flex items-center justify-between pt-2 mt-1 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <span className="text-[9px] font-mono opacity-50" style={{ color: theme.textMuted }}>
                {language === 'es' ? 'Bitácora en Preparación • Registro Abierto' : 'Log in Preparation • Open Registry'}
              </span>
              <span className="text-[9px] font-semibold opacity-60" style={{ color: theme.accent }}>
                {language === 'es' ? 'Mayordomía & Regalo' : 'Stewardship & Gift'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. INTERACTIVE LIVE ZOOM-GRADE HD VIDEO CALL MODAL          */}
      {/* ============================================================ */}
      {activeLiveRoom && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xl animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/90' : 'bg-sky-950/20'
        }`}>
          <div
            className="w-full max-w-2xl rounded-3xl p-4 sm:p-6 border shadow-2xl transition-all max-h-[95vh] flex flex-col backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Header with High-Capacity & Signal Reception Badges */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b mb-3 gap-2" style={{ borderColor: theme.cardBorder }}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-600 text-white uppercase tracking-wider animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    LIVE ZOOM HD
                  </span>
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accent,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{activeLiveRoom.activeCount} / {activeLiveRoom.maxCapacity} {language === 'es' ? 'conectadas (Capacidad 100+)' : 'joined (100+ capacity)'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    <span>{language === 'es' ? '1080p HD • Latencia 0ms' : '1080p HD • 0ms Latency'}</span>
                  </span>
                </div>

                <h3 className="font-serif-scripture font-bold text-base sm:text-lg mt-1" style={{ color: theme.text }}>
                  {language === 'es' ? activeLiveRoom.titleEs : activeLiveRoom.titleEn}
                </h3>
                <p className="text-xs opacity-75 font-serif-scripture italic" style={{ color: theme.accent }}>
                  {activeLiveRoom.scriptureFocus} • {language === 'es' ? `Guía: ${activeLiveRoom.hostName}` : `Host: ${activeLiveRoom.hostName}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVideoCallViewMode(m => m === 'grid' ? 'speaker' : 'grid')}
                  className="px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                  title={language === 'es' ? 'Cambiar vista' : 'Switch view'}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{videoCallViewMode === 'grid' ? (language === 'es' ? 'Vista Galería' : 'Gallery') : (language === 'es' ? 'Vista Orador' : 'Speaker')}</span>
                </button>
                <button
                  onClick={() => setActiveLiveRoom(null)}
                  className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                  style={{ color: theme.textMuted }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Screen Share Active Banner */}
            {isScreenSharing && (
              <div className="mb-3 p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-md">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>{language === 'es' ? `Compartiendo pantalla: Presentación Bíblica (${activeLiveRoom.scriptureFocus})` : `Sharing screen: Bible Study (${activeLiveRoom.scriptureFocus})`}</span>
                </div>
                <button
                  onClick={() => setIsScreenSharing(false)}
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-200 cursor-pointer"
                >
                  {language === 'es' ? 'Dejar de compartir' : 'Stop sharing'}
                </button>
              </div>
            )}

            {/* ZOOM MULTI-PARTICIPANT VIDEO GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 mb-3 flex-1 overflow-y-auto min-h-[16rem]">
              {/* Tile 1: Host / Guide */}
              <div
                className="relative rounded-2xl overflow-hidden border border-emerald-500/50 shadow-xl h-36 sm:h-44 group"
                style={{ backgroundColor: theme.isDark ? '#0f172a' : '#e0f2fe' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85"
                  alt="Host"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Speaking Ring Aura */}
                <div className="absolute inset-0 border-2 border-emerald-400 rounded-2xl pointer-events-none animate-pulse" />

                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>{language === 'es' ? 'Hablando' : 'Speaking'}</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <span className="font-bold drop-shadow-md truncate">{activeLiveRoom.hostName} (Guía)</span>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
              </div>

              {/* Tile 2: Mentor / Speaker */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl h-36 sm:h-44 group"
                style={{ backgroundColor: theme.isDark ? '#0f172a' : '#e0f2fe' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85"
                  alt="Mentor"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <span className="font-bold drop-shadow-md truncate">Débora R. (Mentora)</span>
                  <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                </div>
              </div>

              {/* Tile 3: Sister Intercessor */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl h-36 sm:h-44 group"
                style={{ backgroundColor: theme.isDark ? '#0f172a' : '#e0f2fe' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85"
                  alt="Sister"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <span className="font-bold drop-shadow-md truncate">Rut M. y Priscila</span>
                  <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                </div>
              </div>

              {/* Tile 4: User Selfie Video Frame */}
              <div
                className="relative rounded-2xl overflow-hidden border transition-all shadow-xl h-36 sm:h-44"
                style={{
                  borderColor: isVideoOn ? 'rgba(56, 189, 248, 0.8)' : theme.cardBorder,
                  backgroundColor: theme.isDark ? '#0f172a' : '#e0f2fe',
                }}
              >
                {isVideoOn ? (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
                      alt="User Video Feed"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  </>
                ) : (
                  <div className="text-center p-3">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-1 font-bold text-sm">
                      TÚ
                    </div>
                    <span className="text-[10px] opacity-60 uppercase font-bold text-white">
                      {language === 'es' ? 'Cámara apagada' : 'Camera off'}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <span className="font-bold drop-shadow-md truncate">{language === 'es' ? 'Tú (Presente)' : 'You (Present)'}</span>
                  {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                </div>
              </div>
            </div>

            {/* Multi-Participant Counter Pill */}
            <div className="mb-3 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: theme.accent }}>
                <Users className="w-3.5 h-3.5" />
                <span>+{activeLiveRoom.activeCount - 4} {language === 'es' ? 'participantes conectadas en directo' : 'sisters connected live'}</span>
              </span>
              <span className="text-[10px] font-mono opacity-70" style={{ color: theme.textMuted }}>
                {amenCount} {language === 'es' ? 'reacciones en vivo' : 'live reactions'}
              </span>
            </div>

            {/* Chat Stream */}
            <div
              className="p-3 rounded-xl border mb-3 space-y-1.5 max-h-32 overflow-y-auto text-xs"
              style={{
                backgroundColor: theme.cardVariant,
                borderColor: theme.cardBorder,
              }}
            >
              {liveChatMessages.map((msg, idx) => (
                <p key={idx} className="leading-relaxed" style={{ color: theme.text }}>
                  {msg}
                </p>
              ))}
            </div>

            {/* Quick Reactions Bar */}
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: 'Amén', text: '¡Amén! Me uno de corazón por esta petición.' },
                { label: 'Oración', text: 'Orando por las familias y los hogares.' },
                { label: 'Gloria a Dios', text: '¡Gloria a Dios por Su fidelidad!' },
                { label: 'Paz', text: 'Sintiendo la paz del Señor en este grupo.' },
              ].map((rec, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAmenCount(prev => prev + 1);
                    setLiveChatMessages([
                      ...liveChatMessages,
                      `Tú: ${rec.text}`
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold border whitespace-nowrap cursor-pointer hover:scale-105 transition-all shadow-xs"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                    color: theme.accent,
                  }}
                >
                  {rec.label}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={liveChatInput}
                onChange={(e) => setLiveChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && liveChatInput.trim()) {
                    setLiveChatMessages([
                      ...liveChatMessages,
                      `${language === 'es' ? 'Tú' : 'You'}: ${liveChatInput.trim()}`,
                    ]);
                    setLiveChatInput('');
                  }
                }}
                placeholder={language === 'es' ? 'Escribe en el chat en vivo...' : 'Type in live chat...'}
                className="flex-1 px-3 py-2 text-xs rounded-xl border outline-none"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              />
              <button
                onClick={() => {
                  if (liveChatInput.trim()) {
                    setLiveChatMessages([
                      ...liveChatMessages,
                      `${language === 'es' ? 'Tú' : 'You'}: ${liveChatInput.trim()}`,
                    ]);
                    setLiveChatInput('');
                  }
                }}
                className="p-2.5 rounded-xl text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FULL ZOOM CONTROLS BAR (Mic, Cam, Screen Share, Raise Hand, Leave) */}
            <div className="flex items-center justify-around pt-3 border-t" style={{ borderColor: theme.cardBorder }}>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className="p-3 rounded-full border transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: isMicOn ? theme.accent : theme.cardVariant,
                  borderColor: isMicOn ? theme.accent : theme.cardBorder,
                  color: isMicOn ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
                }}
                title={isMicOn ? 'Silenciar Micrófono' : 'Activar Micrófono'}
              >
                {isMicOn ? <Mic className="w-4.5 h-4.5" /> : <MicOff className="w-4.5 h-4.5 text-red-400" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="p-3 rounded-full border transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: isVideoOn ? theme.accent : theme.cardVariant,
                  borderColor: isVideoOn ? theme.accent : theme.cardBorder,
                  color: isVideoOn ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
                }}
                title={isVideoOn ? 'Apagar Cámara' : 'Encender Cámara'}
              >
                {isVideoOn ? <Video className="w-4.5 h-4.5" /> : <VideoOff className="w-4.5 h-4.5 text-red-400" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="p-3 rounded-full border transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: isScreenSharing ? '#06B6D4' : theme.cardVariant,
                  borderColor: isScreenSharing ? '#06B6D4' : theme.cardBorder,
                  color: isScreenSharing ? '#FFFFFF' : theme.text,
                }}
                title={language === 'es' ? 'Compartir Pantalla' : 'Share Screen'}
              >
                <Monitor className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => {
                  setHasRaisedHand(!hasRaisedHand);
                  if (!hasRaisedHand) {
                    setLiveChatMessages([
                      ...liveChatMessages,
                      language === 'es'
                        ? 'Hermana (Tú) ha levantado la mano para participar.'
                        : 'Sister (You) raised hand to speak.',
                    ]);
                  }
                }}
                className="p-3 rounded-full border transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: hasRaisedHand ? theme.accentBg : theme.cardVariant,
                  borderColor: hasRaisedHand ? theme.accent : theme.cardBorder,
                  color: hasRaisedHand ? theme.accent : theme.text,
                }}
                title={language === 'es' ? 'Levantar la mano' : 'Raise hand'}
              >
                <Hand className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => setActiveLiveRoom(null)}
                className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{language === 'es' ? 'Salir' : 'Leave'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. INTERCESSION ALTAR / PLEDGE MODAL                         */}
      {/* ============================================================ */}
      {intercessionTarget && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/20'
        }`}>
          <div
            className="w-full max-w-md rounded-3xl p-5 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {!intercessionSubmitted ? (
              <>
                <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4" style={{ color: theme.flame }} />
                    <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                      {language === 'es' ? 'Acompañar en Oración' : 'Stand in Prayer'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIntercessionTarget(null)}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: theme.textMuted }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs mb-3 italic font-serif-scripture" style={{ color: theme.accent }}>
                  {language === 'es'
                    ? `«Lleven las cargas los unos de los otros» — Acompañando a ${intercessionTarget.author}`
                    : `«Bear ye one another's burdens» — Praying for ${intercessionTarget.author}`}
                </p>

                <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Elige una promesa para bendecirla:' : 'Select a scripture promise:'}
                </p>

                <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
                  {promiseOptions.map((p, i) => {
                    const isSelected = selectedPromise === p;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedPromise(p)}
                        className="p-2.5 rounded-xl border text-xs cursor-pointer font-serif-scripture transition-all flex items-center justify-between"
                        style={{
                          backgroundColor: isSelected ? theme.accentBg : theme.cardVariant,
                          borderColor: isSelected ? theme.accent : theme.cardBorder,
                          color: isSelected ? theme.accent : theme.text,
                        }}
                      >
                        <span className="leading-snug">{p}</span>
                        {isSelected && <Check className="w-4 h-4 shrink-0" style={{ color: theme.accent }} />}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                    {language === 'es' ? 'Palabra de aliento o susurro de oración (opcional):' : 'Word of encouragement (optional):'}
                  </label>
                  <input
                    type="text"
                    value={customEncouragement}
                    onChange={(e) => setCustomEncouragement(e.target.value)}
                    placeholder={language === 'es' ? 'Escribe aquí tu susurro de amor...' : 'Write your encouragement...'}
                    className="w-full px-3 py-2 text-xs rounded-xl border outline-none"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmIntercession}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.isDark ? '#000000' : '#FFFFFF',
                    }}
                  >
                    <Flame className="w-4 h-4" />
                    <span>{language === 'es' ? 'Unirse en oración con amor' : 'Join in prayer with love'}</span>
                  </button>
                  <button
                    onClick={() => setIntercessionTarget(null)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    }}
                  >
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                  style={{
                    backgroundColor: theme.accentBg,
                    color: theme.accent,
                  }}
                >
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Unidas en oración' : 'United in prayer'}
                </h3>
                <p className="text-xs leading-relaxed font-serif-scripture italic" style={{ color: theme.textSecondary }}>
                  {language === 'es'
                    ? `Tu oración de apoyo por ${intercessionTarget.author} ha sido compartida con cariño. Que la paz del Señor guarde su corazón.`
                    : `Your prayer of support for ${intercessionTarget.author} has been shared. May God's peace guard her heart.`}
                </p>
                <button
                  onClick={() => setIntercessionTarget(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer mt-2"
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.isDark ? '#000000' : '#FFFFFF',
                  }}
                >
                  {language === 'es' ? 'Amén, en reposo' : 'Amen, in peace'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. ADD PRAYER MODAL                                          */}
      {/* ============================================================ */}
      {showAddPrayerModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/20'
        }`}>
          <div
            className="w-full max-w-md rounded-3xl p-5 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
              <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                {language === 'es' ? 'Compartir motivo en comunidad' : 'Share prayer request'}
              </h3>
              <button
                onClick={() => setShowAddPrayerModal(false)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: theme.textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Tu nombre (o Anónima):' : 'Your name (or Anonymous):'}
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder={language === 'es' ? 'Hermana en la fe' : 'Sister'}
                  className="w-full px-3 py-2 text-xs rounded-xl border outline-none"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'Título o resumen breve:' : 'Title / Short summary:'}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'es' ? 'Paz en la familia, salud, trabajo...' : 'Peace at home, health, work...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border outline-none"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: theme.textMuted }}>
                  {language === 'es' ? '¿Por qué podemos orar hoy contigo?' : 'How can we pray for you today?'}
                </label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={language === 'es' ? 'Comparte tu sentir con confianza...' : 'Share your request...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border outline-none resize-none"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Espacio comunitario:' : 'Category:'}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['Peticiones', 'Ayuno', 'Testimonio', 'Solteras', 'Casadas'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewTopic(c)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                      style={{
                        backgroundColor: newTopic === c ? theme.accent : theme.cardVariant,
                        borderColor: newTopic === c ? theme.accent : theme.cardBorder,
                        color: newTopic === c ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreatePrayer}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                {language === 'es' ? 'Publicar con bendición' : 'Post request'}
              </button>
              <button
                onClick={() => setShowAddPrayerModal(false)}
                className="px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer"
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

      {/* ============================================================ */}
      {/* 6. CONTENT REPORT MODAL                                      */}
      {/* ============================================================ */}
      {reportTargetId && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/20'
        }`}>
          <div
            className="w-full max-w-sm rounded-3xl p-5 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.glassCard,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {!reportSuccess ? (
              <>
                <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
                  <h3 className="font-bold text-sm" style={{ color: theme.text }}>
                    {language === 'es' ? 'Reportar contenido' : 'Report content'}
                  </h3>
                  <button
                    onClick={() => setReportTargetId(null)}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs mb-3" style={{ color: theme.textMuted }}>
                  {language === 'es'
                    ? 'Indica el motivo del reporte para moderación comunitaria:'
                    : 'Specify reason for community moderation:'}
                </p>

                <textarea
                  rows={2}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder={language === 'es' ? 'Contenido inapropiado, spam...' : 'Inappropriate, spam...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border outline-none mb-3 resize-none"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setReportSuccess(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white cursor-pointer hover:bg-red-700"
                  >
                    {language === 'es' ? 'Enviar reporte' : 'Submit report'}
                  </button>
                  <button
                    onClick={() => setReportTargetId(null)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    }}
                  >
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-3 space-y-2">
                <Check className="w-8 h-8 mx-auto text-green-500" />
                <p className="text-xs font-semibold" style={{ color: theme.text }}>
                  {language === 'es' ? 'Reporte recibido para moderación.' : 'Report submitted for review.'}
                </p>
                <button
                  onClick={() => setReportTargetId(null)}
                  className="w-full py-2 rounded-xl border text-xs font-bold cursor-pointer mt-2"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  }}
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default CommunityScreen;
