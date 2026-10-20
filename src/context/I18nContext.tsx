import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { storage } from '../utils/storage';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Nav / Tabs
    'tab.inicio': 'Inicio',
    'tab.biblia': 'Biblia',
    'tab.estudios': 'Estudios',
    'tab.comunidad': 'Comunidad',
    'tab.mentor': 'Mentor',
    'tab.diario': 'Diario',

    // Header & Common
    'app.title': 'HAVAH',
    'app.subtitle': 'Refugio espiritual y calma en la Palabra',
    'search.placeholder': 'Buscar versículos, temas, guías...',
    'btn.save': 'Guardar',
    'btn.cancel': 'Cancelar',
    'btn.close': 'Cerrar',
    'btn.share': 'Compartir',
    'btn.listen': 'Escuchar',
    'btn.start': 'Comenzar',
    'btn.continue': 'Continuar',
    'btn.completed': 'Completado',
    'btn.download': 'Descargar PDF',

    // Home Screen
    'home.greeting': 'Bienvenida, alma amada',
    'home.verseOfTheDay': 'Versículo del Día',
    'home.dailyDevotional': 'Devocional Diario',
    'home.breathingPause': 'Pausa de Respiración con la Palabra',
    'home.moodPrompt': '¿Cómo está tu corazón hoy?',
    'home.quickAccess': 'Accesos Rápidos',
    'home.godPromises': 'Promesas de Dios',
    'home.voicePrayer': 'Oración en Voz',

    // Studies / Resources / Lessons
    'studies.title': 'Estudios & Recursos',
    'studies.subtitle': 'Guías profundas para anclar tu alma en las Escrituras',
    'studies.tab.featured': 'Destacados',
    'studies.tab.courses': 'Cursos',
    'studies.tab.resources': 'Recursos & Guías',
    'studies.filter.all': 'Todos',
    'studies.filter.audio': 'Audios',
    'studies.filter.pdf': 'Guías PDF',
    'studies.filter.video': 'Videos',
    'studies.practicalSteps': 'Pasos Prácticos Diarios',
    'studies.sisterTakeaway': 'Reflexión al Corazón',
    'studies.syllabus': 'Sílabo y Lecciones',
    'studies.lesson': 'Lección',

    // Community / Prayer Wall
    'community.title': 'Muro de Aliento Mutuo',
    'community.subtitle': 'Un espacio seguro para sostenernos en oración y amor fraterno',
    'community.postPlaceholder': '¿Qué puso Dios en tu corazón? Escribe para alentar a otra hermana...',
    'community.btnPost': 'Publicar Reflexión',
    'community.praying': 'Orando por mi casa',
    'community.peace': 'Me dio mucha paz',
    'community.needed': 'Lo necesitaba hoy',
    'community.amen': 'Amén y gloria a Dios',

    // Bible Chat / Mentor
    'chat.title': 'Mentor Espiritual',
    'chat.subtitle': 'Conversaciones guiadas por la Palabra con gracia y verdad',
    'chat.placeholder': 'Escribe tu pregunta o inquietud aquí...',
    'chat.send': 'Enviar',

    // Journal
    'journal.title': 'Diario de Oración y Gratitud',
    'journal.subtitle': 'Tu espacio íntimo de comunión con el Padre',
    'journal.newEntry': 'Nueva Entrada',
    'journal.placeholderPrompt': 'Escribe tus oraciones, gratitudes o lo que Dios te habló hoy...',

    // Settings / Account
    'account.title': 'Tu Cuenta y Preferencias',
    'account.streak': 'Camino de Gracia',
    'account.days': 'encuentros',
  },
  en: {
    // Nav / Tabs
    'tab.inicio': 'Home',
    'tab.biblia': 'Bible',
    'tab.estudios': 'Studies',
    'tab.comunidad': 'Community',
    'tab.mentor': 'Mentor',
    'tab.diario': 'Journal',

    // Header & Common
    'app.title': 'HAVAH',
    'app.subtitle': 'Spiritual refuge and calm in the Word',
    'search.placeholder': 'Search verses, topics, guides...',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.close': 'Close',
    'btn.share': 'Share',
    'btn.listen': 'Listen',
    'btn.start': 'Start',
    'btn.continue': 'Continue',
    'btn.completed': 'Completed',
    'btn.download': 'Download PDF',

    // Home Screen
    'home.greeting': 'Welcome, beloved soul',
    'home.verseOfTheDay': 'Verse of the Day',
    'home.dailyDevotional': 'Daily Devotional',
    'home.breathingPause': 'Breathing Pause with the Word',
    'home.moodPrompt': 'How is your heart today?',
    'home.quickAccess': 'Quick Access',
    'home.godPromises': "God's Promises",
    'home.voicePrayer': 'Voice Prayer',

    // Studies / Resources / Lessons
    'studies.title': 'Studies & Resources',
    'studies.subtitle': 'Deep guides to anchor your soul in the Scriptures',
    'studies.tab.featured': 'Featured',
    'studies.tab.courses': 'Courses',
    'studies.tab.resources': 'Resources & Guides',
    'studies.filter.all': 'All',
    'studies.filter.audio': 'Audios',
    'studies.filter.pdf': 'PDF Guides',
    'studies.filter.video': 'Videos',
    'studies.practicalSteps': 'Practical Daily Steps',
    'studies.sisterTakeaway': 'Heart Takeaway',
    'studies.syllabus': 'Syllabus & Lessons',
    'studies.lesson': 'Lesson',

    // Community / Prayer Wall
    'community.title': 'Mutual Encouragement Wall',
    'community.subtitle': 'A safe space to support one another in prayer and sisterly love',
    'community.postPlaceholder': 'What did God speak to your heart? Write to encourage another sister...',
    'community.btnPost': 'Post Reflection',
    'community.praying': 'Praying for my home',
    'community.peace': 'It brought me so much peace',
    'community.needed': 'Needed this today',
    'community.amen': 'Amen and glory to God',

    // Bible Chat / Mentor
    'chat.title': 'Faith Mentor',
    'chat.subtitle': 'Word-guided conversations with grace and truth',
    'chat.placeholder': 'Write your question or burden here...',
    'chat.send': 'Send',

    // Journal
    'journal.title': 'Prayer & Gratitude Journal',
    'journal.subtitle': 'Your intimate space of communion with the Father',
    'journal.newEntry': 'New Entry',
    'journal.placeholderPrompt': 'Write your prayers, gratitude, or what God spoke to you today...',

    // Settings / Account
    'account.title': 'Your Account & Preferences',
    'account.streak': 'Grace Journey',
    'account.days': 'encounters',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => storage.getLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.saveLanguage(lang);
  };

  useEffect(() => {
    storage.saveLanguage(language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to Spanish dictionary if key missing in current language
    const fallbackDict = translations['es'];
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return fallback || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
