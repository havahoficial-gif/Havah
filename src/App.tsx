import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HavahTab, Language, MoodType, VerseAnnotation } from './types';
import { DEVOTIONALS } from './data/havahData';
import { getTodayDevotional, getDayOfYear } from './data/dailyCalendarData';
import { getThemeColors } from './theme';
import { storage } from './utils/storage';
import { useI18n } from './context/I18nContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AtlasScreen } from './screens/AtlasScreen';
import { AccountDialog } from './components/AccountDialog';
import { StreakMilestonesDialog } from './components/StreakMilestonesDialog';
import { BreathingPauseModal } from './components/BreathingPauseModal';
import { ShareCardModal } from './components/ShareCardModal';
import { SplashScreen } from './components/SplashScreen';
import { GodPromisesModal } from './components/GodPromisesModal';
import { VoicePrayerModal } from './components/VoicePrayerModal';
import { HavahPlusModal } from './components/HavahPlusModal';
import { ProfileOnboardingModal } from './components/ProfileOnboardingModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CelestialAtmosphere } from './components/CelestialAtmosphere';
import { triggerHaptic } from './utils/haptics';
import { speechEngine } from './utils/speechEngine';

// Direct import for HomeScreen ensures 0ms render hitch upon splash screen completion
import HomeScreen from './screens/HomeScreen';

// Dynamic screen components with background prefetch for instant tab switching
const BibleScreen = lazy(() => import('./screens/BibleScreen'));
const StudiesScreen = lazy(() => import('./screens/StudiesScreen'));
const CommunityScreen = lazy(() => import('./screens/CommunityScreen'));
const BibleChatScreen = lazy(() => import('./screens/BibleChatScreen'));
const JournalScreen = lazy(() => import('./screens/JournalScreen'));

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('havah_splash_shown');
    } catch {
      return true;
    }
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !storage.getUserProfile();
  });

  const [isDark, setIsDark] = useState<boolean>(() => storage.getTheme());
  const { language, setLanguage } = useI18n();
  const [currentTab, setCurrentTab] = useState<HavahTab>(() => storage.getCurrentTab());
  const [visitedTabs, setVisitedTabs] = useState<Set<HavahTab>>(() => new Set(['inicio', storage.getCurrentTab()]));
  const [selectedMood, setSelectedMood] = useState<MoodType>('peace');
  const [readingStreak, setReadingStreak] = useState<number>(() => storage.getReadingStreak());

  // Bible Reader State - fully persisted so progress is never lost
  const initialBibleLoc = storage.getBibleLocation();
  const [selectedBookId, setSelectedBookId] = useState<string>(initialBibleLoc.bookId);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialBibleLoc.chapter);
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => storage.getCompletedChapters());
  const [annotations, setAnnotations] = useState<VerseAnnotation[]>(() => storage.getAnnotations());
  const [fontSize, setFontSize] = useState<number>(() => storage.getFontSize());

  // Calendar Day of Year State (1-366, changes automatically every day)
  const [targetDayOfYear, setTargetDayOfYear] = useState<number>(() => getDayOfYear());

  // Modals & Navigation triggers
  const [showAtlas, setShowAtlas] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showBreathingPause, setShowBreathingPause] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showGodPromises, setShowGodPromises] = useState(false);
  const [showVoicePrayer, setShowVoicePrayer] = useState(false);
  const [showHavahPlus, setShowHavahPlus] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  // Sync state changes instantly to storage to prevent ghost state resets
  useEffect(() => {
    storage.saveTheme(isDark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
      document.body.style.backgroundColor = isDark ? '#020408' : '#2e6aa0';
    }
  }, [isDark]);

  useEffect(() => {
    speechEngine.stop();
    storage.saveLanguage(language);
  }, [language]);

  useEffect(() => {
    storage.saveCurrentTab(currentTab);
    setVisitedTabs((prev) => {
      if (prev.has(currentTab)) return prev;
      const next = new Set(prev);
      next.add(currentTab);
      return next;
    });
  }, [currentTab]);

  useEffect(() => {
    storage.saveBibleLocation(selectedBookId, selectedChapter);
  }, [selectedBookId, selectedChapter]);

  useEffect(() => {
    storage.saveFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    storage.saveReadingStreak(readingStreak);
  }, [readingStreak]);

  useEffect(() => {
    storage.saveCompletedChapters(completedChapters);
  }, [completedChapters]);

  useEffect(() => {
    storage.saveAnnotations(annotations);
  }, [annotations]);

  // Prefetch all other screens during idle time so startup is instantaneous and tabs transition with 0ms delay
  useEffect(() => {
    const prefetchScreens = () => {
      import('./screens/BibleScreen');
      import('./screens/StudiesScreen');
      import('./screens/CommunityScreen');
      import('./screens/BibleChatScreen');
      import('./screens/JournalScreen');
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(prefetchScreens, { timeout: 3000 });
      } else {
        setTimeout(prefetchScreens, 1000);
      }
    }
  }, []);

  const theme = getThemeColors(isDark);
  // Unique 366-day calendar devotional that changes every single day of the year
  const currentDevotional = getTodayDevotional(targetDayOfYear);
  
  const readingProgress = Math.min(100, (completedChapters.length / 1189) * 100);

  const handleToggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleContinueReading = (bookId: string, chapter: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setCurrentTab('biblia');
  };

  const handleOpenChatWithPrompt = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setCurrentTab('dialogo');
  };

  const handleToggleChapterComplete = (chapterKey: string) => {
    triggerHaptic('success');
    setCompletedChapters((prev) =>
      prev.includes(chapterKey) ? prev.filter((k) => k !== chapterKey) : [...prev, chapterKey]
    );
  };

  const handleToggleHighlight = (verseNum: number, colorHex: string) => {
    setAnnotations((prev) => {
      const exists = prev.find(
        (a) => a.bookId === selectedBookId && a.chapter === selectedChapter && a.verseNumber === verseNum
      );
      if (exists) {
        return prev.filter((a) => a !== exists);
      }
      return [
        ...prev,
        {
          bookId: selectedBookId,
          chapter: selectedChapter,
          verseNumber: verseNum,
          colorHex,
          personalNote: '',
        },
      ];
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative ethereal-noise ${isDark ? 'dark' : 'app-day-mode'}`}
      style={{
        color: theme.text,
      }}
    >
      {/* Initial Application Splash Screen */}
      {showSplash && (
        <SplashScreen
          theme={theme}
          language={language}
          onFinishLoading={() => setShowSplash(false)}
        />
      )}

      {/* Celestial Background Atmosphere Layer: Espacio Profundo Real y Cielo Real Diurno */}
      <CelestialAtmosphere
        isDark={isDark}
      />

      {/* Top Header */}
      {!showAtlas && (
        <Header
          language={language}
          theme={theme}
          onToggleLanguage={handleToggleLanguage}
          onToggleTheme={handleToggleTheme}
          onOpenAccount={() => setShowAccount(true)}
          onOpenHavahPlus={() => setShowHavahPlus(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="main-content main-screen-container relative z-10 max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full px-4 sm:px-6 pt-3 sm:pt-4 pb-28 transition-all duration-300">
        {showAtlas ? (
          <AtlasScreen language={language} theme={theme} onBack={() => setShowAtlas(false)} />
        ) : (
          <>
            {/* Tab: Inicio (Always rendered in memory for zero lag) */}
            <div
              className="w-full"
              style={{ display: currentTab === 'inicio' ? 'block' : 'none' }}
              aria-hidden={currentTab !== 'inicio'}
            >
              <ErrorBoundary fallbackTitle="Inicio • Devocional del Día">
                <HomeScreen
                  language={language}
                  theme={theme}
                  selectedMood={selectedMood}
                  onSelectMood={setSelectedMood}
                  devotional={currentDevotional}
                  targetDay={targetDayOfYear}
                  onSelectDay={setTargetDayOfYear}
                  readingStreak={readingStreak}
                  readingProgress={readingProgress}
                  onOpenStreakDialog={() => setShowStreak(true)}
                  onOpenBreathingPause={() => setShowBreathingPause(true)}
                  onOpenShareCard={() => setShowShareCard(true)}
                  onOpenGodPromises={() => setShowGodPromises(true)}
                  onOpenVoicePrayer={() => setShowVoicePrayer(true)}
                  onOpenHavahPlus={() => setShowHavahPlus(true)}
                  onContinueReading={handleContinueReading}
                />
              </ErrorBoundary>
            </div>

            <Suspense
              fallback={
                <div className="py-24 flex flex-col items-center justify-center space-y-3">
                  <div className="w-7 h-7 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span className="text-xs text-cyan-200/80 font-serif-scripture italic">
                    {language === 'es' ? 'Cargando...' : 'Loading...'}
                  </span>
                </div>
              }
            >
              {/* Tab: Biblia (Kept alive in memory once visited: 0ms switching & preserves reading position) */}
              {visitedTabs.has('biblia') && (
                <div
                  className="w-full"
                  style={{ display: currentTab === 'biblia' ? 'block' : 'none' }}
                  aria-hidden={currentTab !== 'biblia'}
                >
                  <ErrorBoundary fallbackTitle="Lectura Bíblica">
                    <BibleScreen
                      language={language}
                      theme={theme}
                      selectedBookId={selectedBookId}
                      selectedChapter={selectedChapter}
                      completedChapters={completedChapters}
                      annotations={annotations}
                      fontSize={fontSize}
                      onSelectLocation={(b, c) => {
                        setSelectedBookId(b);
                        setSelectedChapter(c);
                      }}
                      onToggleChapterComplete={handleToggleChapterComplete}
                      onToggleHighlight={handleToggleHighlight}
                      onChangeFontSize={setFontSize}
                    />
                  </ErrorBoundary>
                </div>
              )}

              {/* Tab: Estudios */}
              {visitedTabs.has('estudios') && (
                <div
                  className="w-full"
                  style={{ display: currentTab === 'estudios' ? 'block' : 'none' }}
                  aria-hidden={currentTab !== 'estudios'}
                >
                  <ErrorBoundary fallbackTitle="Estudios Bíblicos">
                    <StudiesScreen language={language} theme={theme} onOpenAtlas={() => setShowAtlas(true)} />
                  </ErrorBoundary>
                </div>
              )}

              {/* Tab: Comunidad */}
              {visitedTabs.has('comunidad') && (
                <div
                  className="w-full"
                  style={{ display: currentTab === 'comunidad' ? 'block' : 'none' }}
                  aria-hidden={currentTab !== 'comunidad'}
                >
                  <ErrorBoundary fallbackTitle="Comunidad de Oración">
                    <CommunityScreen language={language} theme={theme} onOpenHavahPlus={() => setShowHavahPlus(true)} />
                  </ErrorBoundary>
                </div>
              )}

              {/* Tab: Diálogo */}
              {visitedTabs.has('dialogo') && (
                <div
                  className="w-full"
                  style={{ display: currentTab === 'dialogo' ? 'block' : 'none' }}
                  aria-hidden={currentTab !== 'dialogo'}
                >
                  <ErrorBoundary fallbackTitle="Diálogo y Paz">
                    <BibleChatScreen language={language} theme={theme} initialPrompt={chatInitialPrompt} />
                  </ErrorBoundary>
                </div>
              )}

              {/* Tab: Diario */}
              {visitedTabs.has('diario') && (
                <div
                  className="w-full"
                  style={{ display: currentTab === 'diario' ? 'block' : 'none' }}
                  aria-hidden={currentTab !== 'diario'}
                >
                  <ErrorBoundary fallbackTitle="Diario y Oraciones">
                    <JournalScreen language={language} theme={theme} />
                  </ErrorBoundary>
                </div>
              )}
            </Suspense>
          </>
        )}
      </main>

      {/* Floating Bottom Navigation Dock */}
      {!showAtlas && (
        <>
          <BottomNav
            currentTab={currentTab}
            onTabSelected={(tab) => {
              triggerHaptic('light');
              setCurrentTab(tab);
            }}
            theme={theme}
            language={language}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      {showAccount && (
        <AccountDialog language={language} theme={theme} onClose={() => setShowAccount(false)} />
      )}

      {showStreak && (
        <StreakMilestonesDialog
          language={language}
          theme={theme}
          currentStreak={readingStreak}
          onRecordToday={() => setReadingStreak((s) => s + 1)}
          onClose={() => setShowStreak(false)}
        />
      )}

      {showBreathingPause && (
        <BreathingPauseModal
          language={language}
          theme={theme}
          onClose={() => setShowBreathingPause(false)}
        />
      )}

      {showShareCard && (
        <ShareCardModal
          language={language}
          theme={theme}
          devotional={currentDevotional}
          onClose={() => setShowShareCard(false)}
        />
      )}

      <GodPromisesModal
        isOpen={showGodPromises}
        language={language}
        theme={theme}
        onClose={() => setShowGodPromises(false)}
        onOpenShareCard={() => setShowShareCard(true)}
      />

      <VoicePrayerModal
        isOpen={showVoicePrayer}
        language={language}
        theme={theme}
        onClose={() => setShowVoicePrayer(false)}
      />

      <HavahPlusModal
        isOpen={showHavahPlus}
        language={language}
        theme={theme}
        onClose={() => setShowHavahPlus(false)}
      />

      {showOnboarding && !showSplash && (
        <ProfileOnboardingModal
          language={language}
          theme={theme}
          onSaveProfile={(profile) => {
            storage.saveUserProfile(profile);
            storage.saveReadingStreak(1);
            setReadingStreak(1);
            storage.savePersonalPrayers([]);
            storage.saveJournalEntries([]);
            storage.saveCompletedChapters([]);
            setShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
}
