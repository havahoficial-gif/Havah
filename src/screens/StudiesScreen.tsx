import React, { useState, useEffect } from 'react';
import {
  Map,
  FileText,
  Headphones,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle,
  X,
  Play,
  Pause,
  Download,
  Flame,
  Share2,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  Check,
  Video,
  Volume2,
  Copy,
  Users,
  Plus,
  ShieldCheck,
  Loader2,
  MessageSquareHeart,
} from 'lucide-react';
import { Language, SeminarCourse, SharedResourceItem, ResourceComment } from '../types';
import { SHARED_RESOURCES, SEMINAR_COURSES, TOPICS_LIST } from '../data/havahData';
import { ThemeColors } from '../theme';
import { storage } from '../utils/storage';
import { speechEngine } from '../utils/speechEngine';
import { ambientAudioEngine } from '../utils/ambientAudio';

// High-quality image management system for Nordic/Devotional aesthetic
const STUDY_IMAGES = [
  'https://images.unsplash.com/photo-1549449347-f4955b2559ec?q=85&w=1600&auto=format&fit=crop', // Organic Texture
  'https://images.unsplash.com/photo-1533745892437-0599a0715396?q=85&w=1600&auto=format&fit=crop', // Minimalist Nordic
  'https://images.unsplash.com/photo-1601042879364-612525a9757f?q=85&w=1600&auto=format&fit=crop', // Soft Light
  'https://images.unsplash.com/photo-1493246337532-6839d0d34195?q=85&w=1600&auto=format&fit=crop', // Cozy Nature
  'https://images.unsplash.com/photo-1583521235655-b461f8796850?q=85&w=1600&auto=format&fit=crop', // Clean Detail
  'https://images.unsplash.com/photo-1616486701833-0498b8ec0139?q=85&w=1600&auto=format&fit=crop', // Bright Room
  'https://images.unsplash.com/photo-1517649763964-0c96d566b96e?q=85&w=1600&auto=format&fit=crop', // Authentic
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1600&auto=format&fit=crop', // Serene Landscape
  'https://images.unsplash.com/photo-1519710162234-a39a74353678?q=85&w=1600&auto=format&fit=crop', // Book Corner
  'https://images.unsplash.com/photo-1549449347-f4955b2559ec?q=85&w=1600&auto=format&fit=crop', // Texture 2
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=85&w=1600&auto=format&fit=crop', // Soft Living
  'https://images.unsplash.com/photo-1503788311183-fa3cd9c4bc06?q=85&w=1600&auto=format&fit=crop', // Textures
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=85&w=1600&auto=format&fit=crop', // Community
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=85&w=1600&auto=format&fit=crop', // Light Simple
  'https://images.unsplash.com/photo-1506765518984-768132e03259?q=85&w=1600&auto=format&fit=crop', // Quiet
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=85&w=1600&auto=format&fit=crop', // Landscape
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=85&w=1600&auto=format&fit=crop', // Nature
  'https://images.unsplash.com/photo-1469474968028-56653f0e2011?q=85&w=1600&auto=format&fit=crop', // Mountains
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=85&w=1600&auto=format&fit=crop', // Forest
];

// Asignación determinista robusta basada en ID
const getStudyImage = (id: string) => {
  let hash = 0;
  // Añadimos un salto de complejidad al hash para evitar colisiones en IDs similares
  const salt = 'havah-nordic-v2';
  const saltedId = id + salt;
  
  for (let i = 0; i < saltedId.length; i++) {
    hash = ((hash << 5) - hash) + saltedId.charCodeAt(i);
    hash |= 0;
  }
  return STUDY_IMAGES[Math.abs(hash) % STUDY_IMAGES.length];
};

interface StudiesScreenProps {
  language: Language;
  theme: ThemeColors;
  onOpenAtlas: () => void;
}

function playPeacefulAmbient() {
  try {
    ambientAudioEngine.play('piano');
  } catch (err) {
    console.log('Ambient sound', err);
  }
}

function stopPeacefulAmbient() {
  try {
    ambientAudioEngine.stop();
  } catch {}
}

export const StudiesScreen: React.FC<StudiesScreenProps> = React.memo(({
  language,
  theme,
  onOpenAtlas,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'audio' | 'pdf' | 'ayuno'>('all');
  const [activeResource, setActiveResource] = useState<SharedResourceItem | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<SeminarCourse | null>(null);

  // All resources including user community uploads
  const [allResources, setAllResources] = useState<SharedResourceItem[]>(() => {
    const userRes = storage.getUserResources();
    return [...userRes, ...SHARED_RESOURCES];
  });

  // Audio Player State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);

  // Video Player State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoSeconds, setVideoSeconds] = useState(0);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);

  // Sharing & Sisterhood encouragement modal
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sisterShareResource, setSisterShareResource] = useState<SharedResourceItem | null>(null);
  const [friendNickname, setFriendNickname] = useState('');
  const [senderNickname, setSenderNickname] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSavedOffline, setIsSavedOffline] = useState(false);

  // Upload Resource Modal with AI Moderation
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'PDF' | 'Audio' | 'Video' | 'Guía' | 'Ayuno'>('Guía');
  const [uploadAnchor, setUploadAnchor] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [isModerating, setIsModerating] = useState(false);
  const [moderationFeedback, setModerationFeedback] = useState<string | null>(null);

  // Comments state for modal
  const [modalComments, setModalComments] = useState<ResourceComment[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Active target ID for comments (either activeResource or selectedCourse)
  const activeItemId = activeResource ? activeResource.id : selectedCourse ? selectedCourse.id : null;

  // Sync comments
  useEffect(() => {
    if (activeItemId) {
      setModalComments(storage.getResourceComments(activeItemId, language));
    }
  }, [activeItemId, language]);

  // Audio timer & ambient sound sync
  useEffect(() => {
    let interval: any = null;
    if (isAudioPlaying) {
      playPeacefulAmbient();
      interval = setInterval(() => {
        setAudioSeconds((s) => (s >= 1080 ? 0 : s + 1));
      }, 1000 / playbackSpeed);
    } else {
      stopPeacefulAmbient();
    }
    return () => {
      clearInterval(interval);
    };
  }, [isAudioPlaying, playbackSpeed]);

  // Video simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoSeconds((s) => {
          if (s >= 260) {
            setIsVideoPlaying(false);
            return 0;
          }
          const next = s + 1;
          setActiveSubtitleIndex(Math.floor((next / 260) * 4));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Initialize and update natural edification message whenever the selected resource or nicknames change
  useEffect(() => {
    if (sisterShareResource) {
      const greeting = friendNickname.trim() ? `Hola ${friendNickname.trim()}` : 'Hola';
      const sender = senderNickname.trim() ? `\n\nCon cariño,\n${senderNickname.trim()}` : '';
      
      const naturalTemplate = `${greeting}, ¿cómo estás? Mira, estaba escuchando esto recién en HAVAH y me acordé de ti.

Sé que a veces uno anda con mil cosas en la cabeza y el día a día se vuelve una carrera pesada con tantas responsabilidades, pero quería recordarte que Dios tiene el control de todo y que no tienes que llevar todas las cargas en tus propias fuerzas. Respira hondo y descansa en Su paz. Te mando un abrazo grande y te tengo presente en mis oraciones.

«${sisterShareResource.titleEs}»
${sisterShareResource.biblicalAnchor}${sender}`;

      setCustomMessage(naturalTemplate);
    }
  }, [sisterShareResource, friendNickname, senderNickname]);

  // Stop media when modal is closed
  const handleCloseResourceModal = () => {
    setIsAudioPlaying(false);
    setIsVideoPlaying(false);
    stopPeacefulAmbient();
    speechEngine.stop();
    setActiveResource(null);
  };

  const handleToggleVideoPlay = () => {
    const next = !isVideoPlaying;
    setIsVideoPlaying(next);
    if (next) {
      playPeacefulAmbient();
      const title = language === 'es' ? activeResource?.titleEs : activeResource?.titleEn;
      const desc = language === 'es' ? activeResource?.descriptionEs : activeResource?.descriptionEn;
      const anchor = activeResource?.biblicalAnchor ? `${activeResource.biblicalAnchor}. ` : '';
      const rawTakeaway = language === 'es' ? activeResource?.sisterTakeawayEs : activeResource?.sisterTakeawayEn;
      const takeaway = rawTakeaway ? `${rawTakeaway}. ` : '';
      const full = language === 'es' ? (activeResource?.fullContentEs || '') : (activeResource?.fullContentEn || '');
      const stepsList = language === 'es' ? activeResource?.practicalStepsEs : activeResource?.practicalStepsEn;
      const steps = stepsList && stepsList.length > 0
        ? ` ${language === 'es' ? 'Pasos prácticos:' : 'Practical steps:'} ${stepsList.join('. ')}`
        : '';
      const textToSpeak = `${title || 'Cápsula en video'}. ${anchor}${desc || ''}. ${takeaway}${full}${steps}`;

      speechEngine.speak({
        text: textToSpeak,
        language,
        onEnd: () => setIsVideoPlaying(false),
      });
    } else {
      stopPeacefulAmbient();
      speechEngine.stop();
    }
  };

  const handleToggleAudioPlay = () => {
    const next = !isAudioPlaying;
    setIsAudioPlaying(next);
    if (next) {
      playPeacefulAmbient();
      const title = language === 'es' ? activeResource?.titleEs : activeResource?.titleEn;
      const desc = language === 'es' ? activeResource?.descriptionEs : activeResource?.descriptionEn;
      const anchor = activeResource?.biblicalAnchor ? `${activeResource.biblicalAnchor}. ` : '';
      const rawTakeaway = language === 'es' ? activeResource?.sisterTakeawayEs : activeResource?.sisterTakeawayEn;
      const takeaway = rawTakeaway ? `${rawTakeaway}. ` : '';
      const full = language === 'es' ? (activeResource?.fullContentEs || '') : (activeResource?.fullContentEn || '');
      const stepsList = language === 'es' ? activeResource?.practicalStepsEs : activeResource?.practicalStepsEn;
      const steps = stepsList && stepsList.length > 0
        ? ` ${language === 'es' ? 'Pasos prácticos:' : 'Practical steps:'} ${stepsList.join('. ')}`
        : '';
      const textToSpeak = `${title || 'Audio de reflexión'}. ${anchor}${desc || ''}. ${takeaway}${full}${steps}`;

      speechEngine.speak({
        text: textToSpeak,
        language,
        onEnd: () => setIsAudioPlaying(false),
      });
    } else {
      stopPeacefulAmbient();
      speechEngine.stop();
    }
  };

  const handleShare = async (e: React.MouseEvent, title: string, description: string, anchor?: string) => {
    e.stopPropagation();
    const textToShare = `${title}\n${anchor ? `${anchor}\n\n` : ''}${description}\n\nCompartido desde HAVAH`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: textToShare,
        });
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setToastMessage(language === 'es' ? 'Mensaje copiado para compartir' : 'Copied to share');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopySisterMessage = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setToastMessage(language === 'es' ? 'Mensaje copiado. Listo para enviar por WhatsApp o mensaje' : 'Message copied. Ready to paste in WhatsApp');
      setTimeout(() => setToastMessage(null), 3500);
      setSisterShareResource(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeItemId) return;

    const posted = storage.addResourceComment(activeItemId, newCommentAuthor, newCommentText);
    setModalComments((prev) => [posted, ...prev]);
    setNewCommentText('');
    setToastMessage(language === 'es' ? 'Tu reflexión fue compartida con la comunidad' : 'Your reflection was shared');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleCommentLike = (commentId: string) => {
    if (!activeItemId) return;
    const updated = storage.toggleCommentLike(activeItemId, commentId);
    setModalComments(updated);
  };

  const handleAddQuickTag = (tag: string) => {
    setNewCommentText((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  // Submit User Resource with Automated AI Moderation
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim()) return;

    setIsModerating(true);
    setModerationFeedback(null);

    try {
      const resp = await fetch('/api/moderate-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          type: uploadType,
          biblicalAnchor: uploadAnchor,
          author: uploadAuthor || 'Hermana en la Fe',
          content: uploadContent,
        }),
      });

      const data = await resp.json();

      if (data.approved) {
        // Choose image according to type with Pinterest Elite high resolution URLs
        const defaultImg =
          uploadType === 'Video'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85'
            : uploadType === 'Audio'
            ? 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=1600&q=85'
            : uploadType === 'Ayuno'
            ? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85'
            : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=85';

        const newResource: SharedResourceItem = {
          id: 'user_res_' + Date.now(),
          titleEs: uploadTitle,
          titleEn: uploadTitle,
          type: uploadType,
          durationEs:
            uploadType === 'Audio'
              ? 'Audio de la comunidad'
              : uploadType === 'Video'
              ? 'Cápsula de la comunidad'
              : 'Tratado de 5 min',
          durationEn: 'Community reflection',
          descriptionEs: uploadContent.slice(0, 160) + (uploadContent.length > 160 ? '...' : ''),
          descriptionEn: uploadContent.slice(0, 160) + (uploadContent.length > 160 ? '...' : ''),
          biblicalAnchor: uploadAnchor || 'Filipenses 4:6-7',
          sisterTakeawayEs: data.suggestedTakeaway || 'La gracia de Dios camina contigo en cada paso.',
          sisterTakeawayEn: data.suggestedTakeaway || 'God\'s grace walks with you every step.',
          shareableQuote: uploadAnchor ? `«${uploadAnchor}»` : undefined,
          fullContentEs: uploadContent,
          fullContentEn: uploadContent,
          practicalStepsEs: [
            'Respira hondo y entrega esta situación en las manos del Padre.',
            'Comparte una palabra de amabilidad con tu familia hoy.',
          ],
          practicalStepsEn: [
            'Take a deep breath and place this situation in the Father\'s hands.',
            'Share a word of kindness with your family today.',
          ],
          imageUrl: defaultImg,
        };

        const updated = storage.addUserResource(newResource);
        setAllResources([newResource, ...SHARED_RESOURCES]);
        setIsUploadModalOpen(false);
        setUploadTitle('');
        setUploadAnchor('');
        setUploadAuthor('');
        setUploadContent('');
        setToastMessage(data.feedback || 'Tu recurso fue verificado con éxito y publicado para la comunidad de edificación');
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setModerationFeedback(data.feedback || 'El contenido necesita revisión para estar alineado con la comunidad.');
      }
    } catch (err) {
      console.error(err);
      // Fallback approval if offline or server issue
      const newResource: SharedResourceItem = {
        id: 'user_res_' + Date.now(),
        titleEs: uploadTitle,
        titleEn: uploadTitle,
        type: uploadType,
        durationEs: 'Tratado de la comunidad',
        durationEn: 'Community reflection',
        descriptionEs: uploadContent.slice(0, 160) + (uploadContent.length > 160 ? '...' : ''),
        descriptionEn: uploadContent.slice(0, 160) + (uploadContent.length > 160 ? '...' : ''),
        biblicalAnchor: uploadAnchor || 'Salmos 34:18',
        sisterTakeawayEs: 'Dios tiene cuidado de tu hogar.',
        sisterTakeawayEn: 'God watches over your home.',
        fullContentEs: uploadContent,
        fullContentEn: uploadContent,
        practicalStepsEs: ['Respira hondo y confía en el Señor.'],
        practicalStepsEn: ['Take a deep breath and trust in the Lord.'],
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=85',
      };
      storage.addUserResource(newResource);
      setAllResources([newResource, ...SHARED_RESOURCES]);
      setIsUploadModalOpen(false);
      setToastMessage('Recurso publicado para edificar a la comunidad');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsModerating(false);
    }
  };

  // Filter guides by media type
  const filteredGuides = allResources.filter((res) => {
    if (mediaFilter === 'all') return true;
    if (mediaFilter === 'video') return res.type === 'Video';
    if (mediaFilter === 'audio') return res.type === 'Audio';
    if (mediaFilter === 'pdf') return res.type === 'PDF' || res.type === 'Guía';
    if (mediaFilter === 'ayuno') return res.type === 'Ayuno';
    return true;
  });

  const filteredCourses = selectedTopic
    ? SEMINAR_COURSES.filter((c) => c.topics.includes(selectedTopic))
    : SEMINAR_COURSES;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5 pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-2xl border border-purple-300/30 text-xs font-semibold bg-purple-950/90 text-white">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Atlas Banner (Liquid Glass) */}
      <div
        onClick={onOpenAtlas}
        className="rounded-3xl p-5 border transition-all duration-300 cursor-pointer shadow-xl backdrop-blur-2xl liquid-glass liquid-glass-interactive flex items-center justify-between"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: theme.accentBg,
              border: `1px solid ${theme.accentBorder}`,
            }}
          >
            <Map className="w-5 h-5" style={{ color: theme.accent }} />
          </div>
          <div>
            <h4 className="text-base font-serif-scripture font-bold" style={{ color: theme.text }}>
              {language === 'es' ? 'Atlas Bíblico y Lugares Sagrados' : 'Biblical Atlas & Sacred Sites'}
            </h4>
            <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Láminas exegéticas: Palestina, Templo, Tabernáculo, Genealogía y Rutas'
                : 'Interactive plates: Palestine, Temple, Tabernacle, Genealogy & Journeys'}
            </p>
          </div>
        </div>

        <button
          className="p-2.5 rounded-2xl border flex items-center justify-center shadow-sm hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
            color: theme.accent,
          }}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. SUBIR CONTENIDO PARA EDIFICAR CON REVISIÓN IA (Banner Destacado) */}
      <div
        className="rounded-3xl p-5 border shadow-lg backdrop-blur-2xl liquid-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.accentBorder,
        }}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              backgroundColor: theme.accentBg,
              border: `1px solid ${theme.accentBorder}`,
            }}
          >
            <MessageSquareHeart className="w-6 h-6" style={{ color: theme.accent }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-serif-scripture font-bold" style={{ color: theme.text }}>
                {language === 'es' ? '¿Tienes una reflexión o testimonio para edificar a la comunidad?' : 'Have a testimony to encourage the community?'}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{language === 'es' ? 'Filtro de Edificación de HAVAH' : 'HAVAH Edification Filter'}</span>
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Sube tu contenido (escrito, audio o video). El sistema de edificación y gracia de HAVAH verifica al instante el tono de gracia, respeto y fundamento bíblico antes de publicarlo en la comunidad.'
                : 'Upload your reflection. HAVAH instantly validates biblical grace and respectful tone.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4.5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer shadow-md active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 transition-all hover:scale-102 btn-holographic"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'es' ? 'Subir mi contenido' : 'Upload reflection'}</span>
        </button>
      </div>

      {/* 3. Media Hub Dinámico: Videos, Audios, Tratados y Ayuno (Liquid Glass) */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                {language === 'es' ? 'Recursos y Estudios' : 'Resources & Studies'}
              </h3>
            </div>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Estudios bíblicos, guías prácticas y audios de reflexión.'
                : 'Biblical studies, practical guides, and audio reflections.'}
            </p>
          </div>
        </div>

        {/* Media Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {[
            { id: 'all', labelEs: `Todos (${allResources.length})`, labelEn: `All (${allResources.length})` },
            { id: 'video', labelEs: 'Videos', labelEn: 'Videos' },
            { id: 'audio', labelEs: 'Audios', labelEn: 'Audio' },
            { id: 'pdf', labelEs: 'Guías', labelEn: 'Guides' },
            { id: 'ayuno', labelEs: 'Ayuno', labelEn: 'Fasting' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setMediaFilter(cat.id as any)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-2xl whitespace-nowrap border transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              style={{
                backgroundColor: mediaFilter === cat.id ? theme.accent : theme.cardVariant,
                borderColor: mediaFilter === cat.id ? theme.accent : theme.cardBorder,
                color: mediaFilter === cat.id ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                backdropFilter: 'blur(10px)',
              }}
            >
              <span>{language === 'es' ? cat.labelEs : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Media Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map((res, index) => {
            const isVideo = res.type === 'Video';
            const isAudio = res.type === 'Audio';
            const isAyuno = res.type === 'Ayuno';
            const Icon = isVideo ? Video : isAudio ? Volume2 : isAyuno ? Flame : FileText;
            const commentsCount = storage.getResourceComments(res.id).length;
            const isCommunityUserUpload = res.id.startsWith('user_res_');

            return (
              <div
                key={res.id}
                onClick={() => {
                  setActiveResource(res);
                  setIsAudioPlaying(false);
                  setIsVideoPlaying(false);
                }}
                className="group rounded-3xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl backdrop-blur-2xl liquid-glass liquid-glass-interactive flex flex-col justify-between"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: isCommunityUserUpload ? theme.accentBorder : theme.cardBorder,
                }}
              >
                <div>
                  {/* Visual Poster Container */}
                  <div className="mb-4 overflow-hidden rounded-2xl aspect-[16/9] w-full relative shadow-md bg-stone-900/20 dark:bg-stone-950/50 border border-black/5 dark:border-white/10">
                    <img
                      src={res.imageUrl}
                      alt={language === 'es' ? res.titleEs : res.titleEn}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallbacks: Record<string, string> = {
                          res_1: '/scandi_woman_evening_journal_1791706585608.jpg',
                          res_2: '/scandi_woman_green_pastures_1791706608738.jpg',
                          res_3: '/scandi_woman_wholesome_kitchen_1791706623152.jpg',
                          res_4: '/scandi_woman_proverbs_working_1791706637976.jpg',
                          res_5: '/scandi_woman_healing_hope_1791706651354.jpg',
                          res_6: '/scandi_woman_confident_peace_1791706667544.jpg',
                          res_7: '/scandi_mother_praying_child_1791706685382.jpg',
                          res_8: '/scandi_woman_studying_bible_1791706703342.jpg',
                        };
                        target.src = fallbacks[res.id] || '/seminar_family_grace.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                    {/* Media Type Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md backdrop-blur-md flex items-center gap-1.5"
                        style={{
                          backgroundColor: theme.isDark ? 'rgba(3, 7, 18, 0.85)' : 'rgba(255, 255, 255, 0.90)',
                          color: theme.accent,
                          border: `1px solid ${theme.accentBorder}`,
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{res.type}</span>
                      </span>

                      {isCommunityUserUpload && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-xl shadow-md backdrop-blur-md bg-emerald-600/90 text-white flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{language === 'es' ? 'Moderado con Gracia' : 'Grace Moderated'}</span>
                        </span>
                      )}
                    </div>

                    {/* Quick Edify Sister Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSisterShareResource(res);
                      }}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-xl backdrop-blur-md text-white text-xs font-semibold bg-rose-600/85 hover:bg-rose-600 border border-white/20 shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      title={language === 'es' ? 'Edificar a...' : 'Edify...'}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current text-white" />
                      <span>{language === 'es' ? 'Edificar a...' : 'Edify...'}</span>
                    </button>

                    {/* Video / Audio Dynamic Play Indicator overlay */}
                    {(isVideo || isAudio) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md bg-white/30 border border-white/50 text-white group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 pl-0.5 fill-current" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-serif-scripture italic drop-shadow-md">
                        {res.biblicalAnchor}
                      </span>
                      <span className="flex items-center gap-1 drop-shadow-md text-[10px] opacity-90">
                        <Clock className="w-3 h-3" />
                        {language === 'es' ? res.durationEs : res.durationEn}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-serif-scripture font-bold text-base mb-1 line-clamp-2" style={{ color: theme.text }}>
                    {language === 'es' ? res.titleEs : res.titleEn}
                  </h4>
                  <p className="text-xs mb-3 leading-relaxed line-clamp-3" style={{ color: theme.textMuted }}>
                    {language === 'es' ? res.descriptionEs : res.descriptionEn}
                  </p>

                  {/* Sister takeaway pill if available */}
                  {(language === 'es' ? res.sisterTakeawayEs : res.sisterTakeawayEn) && (
                    <div className="mb-3 p-2.5 rounded-xl border text-[11px] font-serif-scripture italic liquid-glass-subtle" style={{ borderColor: theme.accentBorder, color: theme.accent }}>
                      "{language === 'es' ? res.sisterTakeawayEs : res.sisterTakeawayEn}"
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3 text-xs font-semibold" style={{ color: theme.accent }}>
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>
                        {isVideo
                          ? (language === 'es' ? 'Ver cápsula' : 'Watch video')
                          : isAudio
                          ? (language === 'es' ? 'Escuchar nota' : 'Listen audio')
                          : (language === 'es' ? 'Abrir tratado' : 'Open guide')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-normal" style={{ color: theme.textMuted }}>
                      <MessageCircle className="w-3 h-3" />
                      <span>{commentsCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleShare(e, language === 'es' ? res.titleEs : res.titleEn, language === 'es' ? res.descriptionEs : res.descriptionEn, res.biblicalAnchor)}
                      className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
                      style={{ color: theme.textMuted }}
                      title={language === 'es' ? 'Compartir' : 'Share'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Cursos de Seminario Bíblico (Liquid Glass) */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
              {language === 'es' ? 'Seminario & Cursos del Corazón' : 'Heart Seminary & Courses'}
            </h3>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Aprender juntas a caminar en gracia, soltar el control y edificar la familia'
                : 'Learning together to walk in grace, release control, and build home'}
            </p>
          </div>
          <span className="text-[11px] font-mono opacity-70" style={{ color: theme.accent }}>
            {filteredCourses.length} {language === 'es' ? 'cursos' : 'courses'}
          </span>
        </div>

        {/* Topic Filters in Liquid Glass Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedTopic(null)}
            className="px-3 py-1.5 text-xs font-semibold rounded-2xl whitespace-nowrap border transition-all cursor-pointer shadow-xs active:scale-95"
            style={{
              backgroundColor: selectedTopic === null ? theme.accent : theme.cardVariant,
              borderColor: selectedTopic === null ? theme.accent : theme.cardBorder,
              color: selectedTopic === null ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
              backdropFilter: 'blur(10px)',
            }}
          >
            {language === 'es' ? 'Todos los temas' : 'All topics'}
          </button>
          {TOPICS_LIST.slice(0, 10).map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
              className="px-3 py-1.5 text-xs font-semibold rounded-2xl whitespace-nowrap border transition-all cursor-pointer shadow-xs active:scale-95"
              style={{
                backgroundColor: selectedTopic === topic ? theme.accent : theme.cardVariant,
                borderColor: selectedTopic === topic ? theme.accent : theme.cardBorder,
                color: selectedTopic === topic ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                backdropFilter: 'blur(10px)',
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Course Cards (Liquid Glass) */}
        <div className="space-y-4">
          {filteredCourses.map((course, index) => {
            const courseCommentsCount = storage.getResourceComments(course.id).length;

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group rounded-3xl p-5 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl backdrop-blur-2xl liquid-glass liquid-glass-interactive"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                }}
              >
                <div className="mb-4 overflow-hidden rounded-2xl aspect-[16/9] w-full relative shadow-md bg-stone-900/20 dark:bg-stone-950/50 border border-black/5 dark:border-white/10">
                  <img
                    src={course.imageUrl}
                    alt={language === 'es' ? course.titleEs : course.titleEn}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbacks: Record<string, string> = {
                        sem_1: '/seminar_night_calm.jpg',
                        sem_2: '/seminar_family_grace.jpg',
                        sem_3: '/seminar_woman_identity.jpg',
                        sem_nocturne: '/seminar_night_calm.jpg',
                        sem_family: '/seminar_family_grace.jpg',
                        sem_identity: '/seminar_woman_identity.jpg',
                      };
                      target.src = fallbacks[course.id] || '/seminar_night_calm.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                  <span
                    className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md backdrop-blur-md"
                    style={{
                      backgroundColor: theme.isDark ? 'rgba(3, 7, 18, 0.85)' : 'rgba(255, 255, 255, 0.90)',
                      color: theme.accent,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    {language === 'es' ? course.levelEs : course.levelEn}
                  </span>

                  <button
                    onClick={(e) => handleShare(e, language === 'es' ? course.titleEs : course.titleEn, language === 'es' ? course.descriptionEs : course.descriptionEn)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md text-white/90 hover:text-white bg-black/40 hover:bg-black/60 border border-white/20 shadow-md transition-all active:scale-90"
                    title={language === 'es' ? 'Compartir' : 'Share'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90">
                    <span className="font-medium drop-shadow-md">
                      {course.lessonCount} {language === 'es' ? 'lecciones prácticas' : 'practical lessons'}
                    </span>
                    <span className="flex items-center gap-1 drop-shadow-md text-[10px]">
                      <Clock className="w-3 h-3" />
                      {course.hoursEstimated}h
                    </span>
                  </div>
                </div>

                <h4 className="font-serif-scripture font-bold text-lg mb-1" style={{ color: theme.text }}>
                  {language === 'es' ? course.titleEs : course.titleEn}
                </h4>
                <p className="text-xs italic mb-2 font-medium" style={{ color: theme.accent }}>
                  {language === 'es' ? course.subtitleEs : course.subtitleEn}
                </p>
                <p className="text-xs mb-3.5 leading-relaxed" style={{ color: theme.textMuted }}>
                  {language === 'es' ? course.descriptionEs : course.descriptionEn}
                </p>

                <div className="flex items-center justify-between pt-2.5 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                      {course.topics.slice(0, 3).map((t) => `#${t}`).join(' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: theme.textMuted }}>
                      <MessageCircle className="w-3 h-3" />
                      <span>{courseCommentsCount}</span>
                    </span>
                  </div>
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: theme.accent }}>
                    {language === 'es' ? 'Ver lecciones' : 'View lessons'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Resource Modal (Audio / Video / PDF) */}
      {activeResource && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/15'
        }`}>
          <div
            className="w-full max-w-xl rounded-3xl p-5 sm:p-6 border shadow-2xl transition-all max-h-[92vh] flex flex-col backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b" style={{ borderColor: theme.cardBorder }}>
              <div>
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-xl shadow-xs"
                  style={{
                    backgroundColor: theme.accentBg,
                    color: theme.accent,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  {activeResource.type} • {activeResource.durationEs}
                </span>
                <h3 className="font-serif-scripture font-bold text-lg mt-1" style={{ color: theme.text }}>
                  {language === 'es' ? activeResource.titleEs : activeResource.titleEn}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSisterShareResource(activeResource)}
                  className="px-3 py-1.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    borderColor: 'rgba(244, 63, 94, 0.3)',
                    color: '#F43F5E',
                  }}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'es' ? 'Edificar a...' : 'Edify...'}</span>
                </button>

                <button
                  onClick={(e) => handleShare(e, language === 'es' ? activeResource.titleEs : activeResource.titleEn, language === 'es' ? activeResource.descriptionEs : activeResource.descriptionEn, activeResource.biblicalAnchor)}
                  className="p-2 rounded-2xl border transition-all cursor-pointer shadow-xs hover:scale-105"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                  title={language === 'es' ? 'Compartir' : 'Share'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseResourceModal}
                  className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: theme.textMuted }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {(() => {
                const practicalSteps = language === 'es' ? activeResource?.practicalStepsEs : activeResource?.practicalStepsEn;
                const sisterTakeaway = language === 'es' ? activeResource?.sisterTakeawayEs : activeResource?.sisterTakeawayEn;
                return (
                  <>
              {/* VIDEO CAPSULE INTERACTIVE PLAYER */}
              {activeResource.type === 'Video' ? (
                <div className="rounded-2xl border overflow-hidden relative shadow-xl liquid-glass-subtle" style={{ borderColor: theme.cardBorder }}>
                  <div className="h-56 sm:h-64 relative overflow-hidden bg-black">
                    <img
                      src={activeResource.imageUrl}
                      alt={language === 'es' ? activeResource.titleEs : activeResource.titleEn}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-85 scale-105' : 'opacity-95'}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                    {/* Central Play/Pause Action */}
                    <button
                      onClick={handleToggleVideoPlay}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center bg-rose-600/90 text-white shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 transition-all"
                    >
                      {isVideoPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 pl-1 fill-current" />}
                    </button>

                    {/* Live Captions / Subtitles while playing */}
                    {isVideoPlaying && (
                      <div className="absolute top-4 left-4 right-4 animate-fade-in">
                        <div className="p-3 rounded-xl backdrop-blur-md bg-black/60 border border-white/20 text-white text-xs font-serif-scripture italic text-center">
                          {[
                            'Recuerda en tu día: Dios no busca una persona perfecta que nunca se cansa.',
                            'Él busca un corazón sincero que se deje abrazar por Su gracia en la cotidianidad y en el trabajo.',
                            'Suelta la culpa del perfeccionismo. Respira hondo. El Señor ya tiene cuidado de tu camino.',
                            'Sonríele al día de mañana porque sabes Quién sostiene tu futuro.',
                          ][activeSubtitleIndex]}
                        </div>
                      </div>
                    )}

                    {/* Video Player Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-1.5">
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full transition-all duration-300"
                          style={{ width: `${(videoSeconds / 260) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-white/90">
                        <span className="font-mono">{formatTime(videoSeconds)} / {activeResource.videoDuration || '04:20'}</span>
                        <span className="italic font-serif-scripture">{activeResource.biblicalAnchor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeResource.type === 'Audio' ? (
                /* DYNAMIC AUDIO PLAYER WITH REAL AMBIENT HARMONICS & WAVEFORM */
                <div
                  className="p-5 rounded-2xl border space-y-3.5 liquid-glass-subtle shadow-lg"
                  style={{
                    borderColor: theme.accentBorder,
                    backgroundColor: theme.accentBg,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleToggleAudioPlay}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl active:scale-95 transition-all"
                        style={{
                          backgroundColor: theme.accent,
                          color: theme.isDark ? '#000000' : '#FFFFFF',
                        }}
                      >
                        {isAudioPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 pl-0.5 fill-current" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold" style={{ color: theme.text }}>
                          {isAudioPlaying
                            ? language === 'es'
                              ? 'Reproduciendo meditación serena...'
                              : 'Playing peaceful meditation...'
                            : language === 'es'
                            ? 'Nota de voz & Reposo'
                            : 'Voice note & soul rest'}
                        </h4>
                        <p className="text-[10px] mt-0.5" style={{ color: theme.textMuted }}>
                          {isAudioPlaying
                            ? language === 'es'
                              ? 'Música armónica de paz activa en segundo plano'
                              : 'Ambient peaceful harmonic chord active'
                            : language === 'es'
                            ? 'Voz cálida y reposo para bajar las revoluciones'
                            : 'Warm voice & quiet space'}
                        </p>
                      </div>
                    </div>

                    {/* Speed Selector */}
                    <button
                      onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
                      className="px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold cursor-pointer"
                      style={{
                        backgroundColor: theme.cardVariant,
                        borderColor: theme.cardBorder,
                        color: theme.accent,
                      }}
                    >
                      {playbackSpeed}x
                    </button>
                  </div>

                  {/* Animated Waveform Visualizer */}
                  <div className="flex items-center justify-between gap-1 h-8 px-2 py-1">
                    {[16, 24, 12, 28, 20, 32, 14, 22, 30, 18, 26, 12, 20, 28, 16, 24, 10, 22].map((height, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${isAudioPlaying ? 'opacity-90' : 'opacity-40'}`}
                        style={{
                          height: isAudioPlaying ? `${Math.max(8, (height * (i % 2 === 0 ? 1 : 0.7)))}px` : '8px',
                          backgroundColor: theme.accent,
                        }}
                      />
                    ))}
                  </div>

                  {/* Audio Progress Bar & Time */}
                  <div className="space-y-1">
                    <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(audioSeconds / 1080) * 100}%`,
                          backgroundColor: theme.accent,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono" style={{ color: theme.textMuted }}>
                      <span>{formatTime(audioSeconds)}</span>
                      <span>18:00</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* PDF / GUÍA COVER HERO BANNER WITH INSTANT AUDIO NARRATOR */
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-2xl aspect-[16/9] w-full relative shadow-lg border bg-stone-900/40" style={{ borderColor: theme.cardBorder }}>
                    <img
                      src={activeResource.imageUrl}
                      alt={language === 'es' ? activeResource.titleEs : activeResource.titleEn}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <span
                      className="absolute bottom-3 left-3 text-[11px] font-serif-scripture italic font-semibold px-3 py-1 rounded-xl shadow-lg backdrop-blur-md text-white border border-white/20"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
                    >
                      {activeResource.biblicalAnchor}
                    </span>
                  </div>

                  <button
                    onClick={handleToggleAudioPlay}
                    className="w-full py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
                    style={{
                      backgroundColor: isAudioPlaying ? theme.accent : theme.accentBg,
                      borderColor: theme.accentBorder,
                      color: isAudioPlaying ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                    }}
                  >
                    {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>
                      {isAudioPlaying
                        ? (language === 'es' ? 'Pausar lectura con voz serena' : 'Pause serene reading')
                        : (language === 'es' ? 'Escuchar guía completa con voz serena' : 'Listen to full guide in serene voice')}
                    </span>
                  </button>
                </div>
              )}

              {/* Sister Key Takeaway Box */}
              {sisterTakeaway && (
                <div
                  className="p-3.5 rounded-2xl border text-xs font-serif-scripture italic liquid-glass-subtle flex items-start gap-2.5"
                  style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.08)',
                    borderColor: 'rgba(244, 63, 94, 0.25)',
                    color: theme.text,
                  }}
                >
                  <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block not-italic uppercase text-[10px] tracking-wider text-rose-500 mb-0.5">
                      {language === 'es' ? 'Mensaje al corazón:' : 'Heart Takeaway:'}
                    </span>
                    <span>"{sisterTakeaway}"</span>
                  </div>
                </div>
              )}

              {/* Full Biblical Content */}
              <div
                className="p-4.5 rounded-2xl border space-y-2 liquid-glass-subtle"
                style={{
                  borderColor: theme.cardBorder,
                }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Contenido y Reflexión Bíblica:' : 'Biblical Foundation:'}
                </h4>
                <p className="font-serif-scripture text-sm leading-relaxed whitespace-pre-line" style={{ color: theme.text }}>
                  {language === 'es' ? activeResource.fullContentEs : activeResource.fullContentEn}
                </p>
              </div>

              {/* Practical steps */}
              {practicalSteps && practicalSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                    {language === 'es' ? 'Pasos prácticos para tu día a día:' : 'Practical daily steps:'}
                  </h4>
                  <div className="space-y-1.5">
                    {practicalSteps.map((step: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl border flex items-center gap-2.5 text-xs liquid-glass-subtle"
                        style={{
                          borderColor: theme.cardBorder,
                          color: theme.text,
                        }}
                      >
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Comments Section ("Muro de Edificación Mutua") */}
              <div className="pt-2 border-t space-y-3" style={{ borderColor: theme.cardBorder }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" style={{ color: theme.accent }} />
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                      {language === 'es' ? 'Muro de Edificación Mutua' : 'Mutual Encouragement Wall'}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono opacity-80" style={{ color: theme.textMuted }}>
                    {modalComments.length} {language === 'es' ? 'testimonios' : 'reflections'}
                  </span>
                </div>

                {/* Quick Reaction Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {(language === 'es' ? [
                    'Me dio mucha paz',
                    'Lo necesitaba hoy',
                    'Orando por mi casa',
                    'Amén y gloria a Dios',
                  ] : [
                    'Brought so much peace',
                    'Needed this today',
                    'Praying for my home',
                    'Amen & praise God',
                  ]).map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddQuickTag(tag)}
                      className="px-2.5 py-1 rounded-xl border text-[11px] font-medium whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: theme.cardVariant,
                        borderColor: theme.cardBorder,
                        color: theme.text,
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Comment Posting Form */}
                <form onSubmit={handlePostComment} className="space-y-2 p-3.5 rounded-2xl border liquid-glass-subtle" style={{ borderColor: theme.cardBorder }}>
                  <input
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder={language === 'es' ? 'Tu nombre o firma (ej. Sofía)' : 'Your name or handle'}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: theme.cardBorder, color: theme.text }}
                  />
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={language === 'es' ? '¿Cómo te habló Dios con esto? Escribe una palabra para edificar a otras hermanas...' : 'What did God speak to your heart? Write to encourage another sister...'}
                    rows={2}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none resize-none"
                    style={{ borderColor: theme.cardBorder, color: theme.text }}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.isDark ? '#000000' : '#FFFFFF',
                      }}
                    >
                      <Send className="w-3 h-3" />
                      <span>{language === 'es' ? 'Publicar para edificar' : 'Post reflection'}</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-2.5 pt-1">
                  {modalComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-2xl border liquid-glass-subtle space-y-1.5"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ backgroundColor: theme.accentBg, color: theme.accent }}
                          >
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold" style={{ color: theme.text }}>
                            {comment.author}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleCommentLike(comment.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer active:scale-95 transition-all"
                          style={{ color: comment.userLiked ? '#F43F5E' : theme.textMuted }}
                        >
                          <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-current text-rose-500' : ''}`} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                      <p className="text-xs leading-relaxed font-serif-scripture" style={{ color: theme.text }}>
                        "{comment.content}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSavedOffline(!isSavedOffline)}
                  className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95"
                  style={{
                    backgroundColor: isSavedOffline ? theme.accentBg : theme.cardVariant,
                    borderColor: isSavedOffline ? theme.accent : theme.cardBorder,
                    color: isSavedOffline ? theme.accent : theme.textMuted,
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isSavedOffline
                      ? language === 'es'
                        ? 'Guardado'
                        : 'Saved'
                      : language === 'es'
                      ? 'Descargar'
                      : 'Save'}
                  </span>
                </button>

                <button
                  onClick={(e) => handleShare(e, language === 'es' ? activeResource.titleEs : activeResource.titleEn, language === 'es' ? activeResource.descriptionEs : activeResource.descriptionEn, activeResource.biblicalAnchor)}
                  className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Compartir' : 'Share'}</span>
                </button>
              </div>

              <button
                onClick={handleCloseResourceModal}
                className="px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer shadow-md active:scale-95"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SISTERHOOD ENCOURAGEMENT SHARE MODAL (NATURAL, PERSON-TO-PERSON TONE) */}
      {sisterShareResource && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/15'
        }`}>
          <div
            className="w-full max-w-lg rounded-3xl p-5 sm:p-6 border shadow-2xl transition-all backdrop-blur-2xl liquid-glass space-y-4"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
                <h4 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {language === 'es' ? 'Edificar a...' : 'Edify Someone...'}
                </h4>
              </div>
              <button
                onClick={() => setSisterShareResource(null)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" style={{ color: theme.textMuted }} />
              </button>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Escribe a quién quieres bendecir (tu esposo, un hijo, una amiga, tu hermano, mamá...) y tu nombre. El mensaje se redacta con un tono natural, cercano y de corazón a corazón, listo para enviar por WhatsApp:'
                : 'Enter who you want to encourage and your name. The message updates naturally, ready to send:'}
            </p>

            {/* Nickname Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                  {language === 'es' ? '¿A quién deseas edificar hoy? (Nombre o apodo):' : 'Who do you want to encourage? (Name / nickname):'}
                </label>
                <input
                  type="text"
                  value={friendNickname}
                  onChange={(e) => setFriendNickname(e.target.value)}
                  placeholder={language === 'es' ? 'ej. mi amor, Vale, David, mamá, Carlos...' : 'e.g. David, Sarah, mom...'}
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                  {language === 'es' ? 'Tu nombre o firma:' : 'Your name:'}
                </label>
                <input
                  type="text"
                  value={senderNickname}
                  onChange={(e) => setSenderNickname(e.target.value)}
                  placeholder="ej. Mariana, Sofi..."
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                />
              </div>
            </div>

            {/* Editable Natural Message Preview */}
            <div>
              <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                {language === 'es' ? 'Mensaje listo (puedes ajustarlo si deseas):' : 'Message preview (editable):'}
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={7}
                className="w-full text-xs p-3 rounded-2xl border bg-transparent focus:outline-none font-serif-scripture leading-relaxed resize-none"
                style={{
                  borderColor: 'rgba(244, 63, 94, 0.3)',
                  backgroundColor: 'rgba(244, 63, 94, 0.04)',
                  color: theme.text,
                }}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSisterShareResource(null)}
                className="px-4 py-2 rounded-2xl text-xs font-semibold cursor-pointer border"
                style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleCopySisterMessage}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer shadow-md active:scale-95 flex items-center gap-2 bg-rose-600 text-white hover:bg-rose-700 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Copiar para WhatsApp' : 'Copy for WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD COMMUNITY RESOURCE MODAL WITH AUTOMATIC AI REVIEW */}
      {isUploadModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/15'
        }`}>
          <div
            className="w-full max-w-lg rounded-3xl p-5 sm:p-6 border shadow-2xl transition-all max-h-[92vh] flex flex-col backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: theme.accentBg, color: theme.accent }}
                >
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                    {language === 'es' ? 'Compartir Recurso o Testimonio' : 'Share a Resource or Testimony'}
                  </h3>
                  <p className="text-[11px]" style={{ color: theme.textMuted }}>
                    {language === 'es' ? 'Filtro automático de edificación de HAVAH' : 'Automatic edification review by HAVAH'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" style={{ color: theme.textMuted }} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto pr-1 py-3 space-y-3.5">
              {moderationFeedback && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
                  {moderationFeedback}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                  {language === 'es' ? 'Título de tu recurso o testimonio:' : 'Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="ej. Lo que aprendí cuando me sentí sin fuerzas / Mi pausa con Dios..."
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                    {language === 'es' ? 'Formato del recurso:' : 'Format:'}
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: theme.cardBorder, color: theme.text }}
                  >
                    <option value="Guía" className="text-black">Guía / Reflexión escrita</option>
                    <option value="Audio" className="text-black">Nota de voz / Audio</option>
                    <option value="Video" className="text-black">Cápsula en video</option>
                    <option value="PDF" className="text-black">Tratado breve PDF</option>
                    <option value="Ayuno" className="text-black">Plan de ayuno / oración</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                    {language === 'es' ? 'Anclaje bíblico:' : 'Bible verse anchor:'}
                  </label>
                  <input
                    type="text"
                    value={uploadAnchor}
                    onChange={(e) => setUploadAnchor(e.target.value)}
                    placeholder="ej. Salmos 34:18 o Mateo 11:28"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: theme.cardBorder, color: theme.text }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                  {language === 'es' ? 'Tu nombre o firma pública:' : 'Your name / handle:'}
                </label>
                <input
                  type="text"
                  value={uploadAuthor}
                  onChange={(e) => setUploadAuthor(e.target.value)}
                  placeholder="ej. Mariana S. / Hermana en la fe"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1" style={{ color: theme.text }}>
                  {language === 'es' ? 'Contenido del mensaje, reflexión o testimonio:' : 'Content / reflection:'}
                </label>
                <textarea
                  required
                  rows={6}
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder={language === 'es' ? 'Escribe con tus propias palabras lo que Dios te enseñó, la prueba que superaste o el versículo que te dio aliento. No te preocupes por sonar perfecta; lo que edifica es la sinceridad y la verdad de la Palabra.' : 'Write what God placed on your heart...'}
                  className="w-full text-xs p-3 rounded-2xl border bg-transparent focus:outline-none font-serif-scripture leading-relaxed resize-none"
                  style={{ borderColor: theme.cardBorder, color: theme.text }}
                />
              </div>

              {/* AI Moderation Explanation Note */}
              <div className="p-3 rounded-2xl border text-[11px] flex items-start gap-2.5 liquid-glass-subtle" style={{ borderColor: theme.cardBorder }}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p style={{ color: theme.textMuted }}>
                  {language === 'es'
                    ? 'Al enviar, el sistema de HAVAH revisará automáticamente que el mensaje transmita gracia, respeto, edificación sana y amor cristiano. Una vez aprobado en segundos, quedará visible en la comunidad.'
                    : 'HAVAH automatically reviews submissions to ensure uplifting grace and respectful community standards.'}
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold cursor-pointer border"
                  style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isModerating || !uploadTitle.trim() || !uploadContent.trim()}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.isDark ? '#000000' : '#FFFFFF',
                  }}
                >
                  {isModerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'es' ? 'Verificando...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Revisar y publicar' : 'Review & publish'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in ${
          theme.isDark ? 'bg-[#020510]/80' : 'bg-purple-950/15'
        }`}>
          <div
            className="w-full max-w-xl rounded-3xl p-5 sm:p-6 border shadow-2xl transition-all max-h-[90vh] flex flex-col backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
              <div>
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-xl shadow-xs"
                  style={{
                    backgroundColor: theme.accentBg,
                    color: theme.accent,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  {selectedCourse.levelEs} • {selectedCourse.lessonCount} {language === 'es' ? 'lecciones' : 'lessons'}
                </span>
                <h3 className="font-serif-scripture font-bold text-lg mt-1" style={{ color: theme.text }}>
                  {language === 'es' ? selectedCourse.titleEs : selectedCourse.titleEn}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleShare(e, language === 'es' ? selectedCourse.titleEs : selectedCourse.titleEn, language === 'es' ? selectedCourse.descriptionEs : selectedCourse.descriptionEn)}
                  className="p-2 rounded-2xl border transition-all cursor-pointer shadow-xs hover:scale-105"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                  title={language === 'es' ? 'Compartir curso' : 'Share course'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: theme.textMuted }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* Course Hero Banner */}
              <div className="overflow-hidden rounded-2xl aspect-[16/9] w-full relative shadow-lg border bg-stone-900/40" style={{ borderColor: theme.cardBorder }}>
                <img
                  src={selectedCourse.imageUrl}
                  alt={language === 'es' ? selectedCourse.titleEs : selectedCourse.titleEn}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <span
                  className="absolute bottom-3 left-3 text-[11px] font-serif-scripture italic font-semibold px-3 py-1 rounded-xl shadow-lg backdrop-blur-md text-white border border-white/20"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
                >
                  {selectedCourse.subtitleEs}
                </span>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                {language === 'es' ? selectedCourse.descriptionEs : selectedCourse.descriptionEn}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Plan de Lecciones y Aplicación:' : 'Syllabus & Lessons:'}
                </h4>
                <div className="space-y-2.5">
                  {selectedCourse.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3.5 rounded-2xl border transition-all liquid-glass-subtle space-y-1.5"
                      style={{
                        borderColor: theme.cardBorder,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: theme.text }}>
                          {lesson.order}. {language === 'es' ? lesson.titleEs : lesson.titleEn}
                        </span>
                        <span className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                          {lesson.scriptures.slice(0, 2).join(' · ')}
                        </span>
                      </div>
                      <p className="text-xs font-serif-scripture italic" style={{ color: theme.accent }}>
                        {language === 'es' ? lesson.focusEs : lesson.focusEn}
                      </p>
                      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] space-y-1">
                        <p style={{ color: theme.text }}>
                          <span className="font-bold">Práctica:</span> {lesson.practiceEs}
                        </p>
                        <p className="italic text-xs" style={{ color: theme.textMuted }}>
                          <span className="font-bold not-italic">Pregunta al corazón:</span> {lesson.finalPromptEs}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Community Reflections Section */}
              <div className="pt-2 border-t space-y-3" style={{ borderColor: theme.cardBorder }}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.accent }}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Testimonios y Reflexiones del Curso' : 'Course Reflections'}</span>
                  </h4>
                  <span className="text-[11px] font-mono opacity-80" style={{ color: theme.textMuted }}>
                    {modalComments.length} {language === 'es' ? 'participaciones' : 'reflections'}
                  </span>
                </div>

                {/* Form to leave reflection */}
                <form onSubmit={handlePostComment} className="space-y-2 p-3.5 rounded-2xl border liquid-glass-subtle" style={{ borderColor: theme.cardBorder }}>
                  <input
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder={language === 'es' ? 'Tu nombre (ej. Abigail)' : 'Your name'}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: theme.cardBorder, color: theme.text }}
                  />
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={language === 'es' ? '¿Cómo ha impactado este curso tu vida o tu familia?...' : 'How has this course encouraged you?...'}
                    rows={2}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent focus:outline-none resize-none"
                    style={{ borderColor: theme.cardBorder, color: theme.text }}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.isDark ? '#000000' : '#FFFFFF',
                      }}
                    >
                      <Send className="w-3 h-3" />
                      <span>{language === 'es' ? 'Compartir testimonio' : 'Share testimony'}</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-2.5 pt-1">
                  {modalComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-2xl border liquid-glass-subtle space-y-1.5"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ backgroundColor: theme.accentBg, color: theme.accent }}
                          >
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold" style={{ color: theme.text }}>
                            {comment.author}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleCommentLike(comment.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer active:scale-95 transition-all"
                          style={{ color: comment.userLiked ? '#F43F5E' : theme.textMuted }}
                        >
                          <Heart className={`w-3 h-3 ${comment.userLiked ? 'fill-current' : ''}`} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                      <p className="text-xs leading-relaxed font-serif-scripture" style={{ color: theme.text }}>
                        "{comment.content}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.cardBorder }}>
              <button
                onClick={(e) => handleShare(e, language === 'es' ? selectedCourse.titleEs : selectedCourse.titleEn, language === 'es' ? selectedCourse.descriptionEs : selectedCourse.descriptionEn)}
                className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.accent,
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Compartir curso' : 'Share course'}</span>
              </button>

              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer shadow-md active:scale-95"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.isDark ? '#000000' : '#FFFFFF',
                }}
              >
                {language === 'es' ? 'Cerrar curso' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default StudiesScreen;
