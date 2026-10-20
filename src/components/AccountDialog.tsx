import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  X,
  Mail,
  Heart,
  Edit3,
  KeyRound,
  Check,
  Smartphone,
  Volume2,
  Sliders,
  Mic,
  Sparkles,
  Play,
  Square,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { ThemeColors } from '../theme';
import { SoulLettersModal } from './SoulLettersModal';
import { HavahPlusModal } from './HavahPlusModal';
import { LegalModal } from './LegalModal';
import { storage } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';
import { speechEngine, HAVAH_VOICE_OPTIONS, HavahVoiceId } from '../utils/speechEngine';

interface AccountDialogProps {
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

type AccountTab = 'perfil' | 'voces' | 'ajustes';

export const AccountDialog: React.FC<AccountDialogProps> = ({
  language,
  theme,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AccountTab>('perfil');
  const [profile, setProfile] = useState<UserProfile>(() => {
    return (
      storage.getUserProfile() || {
        name: 'Hija de Dios',
        avatarBadge: 'Caminante de Fe',
        isAnonymous: true,
        createdAt: Date.now(),
      }
    );
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email || '');

  const [isAdmin, setIsAdmin] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState<'morning' | 'evening'>('morning');
  const [showSoulLetters, setShowSoulLetters] = useState(false);
  const [showHavahPlus, setShowHavahPlus] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const [voicePref, setVoicePref] = useState<HavahVoiceId>(speechEngine.getVoicePreference());
  const [voiceRate, setVoiceRate] = useState<number>(speechEngine.getVoiceRate());
  const [previewingVoice, setPreviewingVoice] = useState<HavahVoiceId | null>(null);

  // Swipe-to-close / swipe-down touch gesture handling
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Ensure all speech stops when dialog unmounts
      speechEngine.stop();
    };
  }, []);

  const handleTogglePreviewVoice = (vId: HavahVoiceId) => {
    triggerHaptic('light');
    setVoicePref(vId);
    speechEngine.setVoicePreference(vId);

    if (previewingVoice === vId && speechEngine.isSpeaking()) {
      speechEngine.stop();
      setPreviewingVoice(null);
    } else {
      speechEngine.stop();
      setPreviewingVoice(vId);
      speechEngine.previewVoice(
        vId,
        language,
        () => setPreviewingVoice(vId),
        () => setPreviewingVoice(null)
      );
    }
  };

  const handleRateChange = (newRate: number) => {
    setVoiceRate(newRate);
    speechEngine.setVoiceRate(newRate);
  };

  const handleClose = () => {
    triggerHaptic('light');
    speechEngine.stop();
    setPreviewingVoice(null);
    onClose();
  };

  const handleSaveProfileEdit = () => {
    if (!editName.trim()) return;
    triggerHaptic('success');
    const updated: UserProfile = {
      ...profile,
      name: editName.trim(),
      email: editEmail.trim() || undefined,
      isAnonymous: !editEmail.trim(),
    };
    setProfile(updated);
    storage.saveUserProfile(updated);
    setIsEditingProfile(false);
  };

  // Touch gesture handlers for mobile bottom sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe down if starting from top drag area or if content is scrolled to top
    const target = sheetRef.current;
    if (target && target.scrollTop <= 0) {
      setTouchStartY(e.touches[0].clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || !isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    if (diff > 0) {
      // Dragging downward
      setDragOffsetY(diff);
    } else {
      setDragOffsetY(0);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffsetY > 75) {
      // Trigger smooth close
      handleClose();
    }
    setTouchStartY(null);
    setDragOffsetY(0);
    setIsDragging(false);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-md animate-fade-in ${
        theme.isDark ? 'bg-black/80' : 'bg-sky-950/20'
      }`}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-lg max-h-[85dvh] sm:max-h-[80dvh] rounded-t-[32px] sm:rounded-3xl border shadow-2xl transition-transform flex flex-col relative overflow-hidden backdrop-blur-2xl liquid-glass will-change-transform"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          color: theme.text,
          transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Mobile Swipe-Down Pill Handle */}
        <div className="w-full pt-2.5 pb-1 flex justify-center items-center cursor-grab active:cursor-grabbing sm:hidden shrink-0 select-none">
          <div
            className="w-12 h-1.5 rounded-full transition-opacity opacity-40 hover:opacity-80"
            style={{ backgroundColor: theme.isDark ? '#94A3B8' : '#64748B' }}
          />
        </div>

        {/* Dynamic Celestial Atmosphere Background */}
        {theme.isDark ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="/night-space.jpg"
              alt="Night Space"
              className="w-full h-full object-cover opacity-25 mix-blend-screen scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/70 to-[#030712]/95" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-purple-200/40 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-indigo-200/30 blur-3xl" />
          </div>
        )}

        {/* Pinned Sticky Header with High-Contrast Clear Close 'X' Button */}
        <div
          className="shrink-0 px-5 sm:px-6 py-3.5 border-b flex items-center justify-between z-20 sticky top-0 backdrop-blur-xl"
          style={{
            borderColor: theme.cardBorder,
            backgroundColor: theme.isDark ? 'rgba(3, 7, 18, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs"
              style={{
                backgroundColor: theme.accentBg,
                border: `1.5px solid ${theme.accentBorder}`,
              }}
            >
              <User className="w-5 h-5" style={{ color: theme.accent }} />
            </div>
            <div>
              <h3 className="font-serif-scripture font-bold text-base sm:text-lg leading-tight" style={{ color: theme.text }}>
                {language === 'es' ? 'Cuenta y Perfil' : 'Account & Profile'}
              </h3>
              <p className="text-[11px] font-semibold leading-tight mt-0.5" style={{ color: theme.accent }}>
                {language === 'es' ? 'Espacio personal de reposo y fe' : 'Personal sanctuary of faith'}
              </p>
            </div>
          </div>

          {/* Large, High-Contrast Close 'X' Button (40x40px touch area) */}
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-xs hover:scale-105 active:scale-95"
            style={{
              borderColor: theme.cardBorder,
              backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(241, 245, 249, 0.95)',
              color: theme.text,
            }}
            aria-label={language === 'es' ? 'Cerrar ventana de perfil' : 'Close profile dialog'}
            title={language === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Navigation Bar (Keeps panel compact & eliminates endless scrolling) */}
        <div
          className="shrink-0 px-5 sm:px-6 pt-3 pb-2 border-b flex items-center gap-2 z-20"
          style={{
            borderColor: theme.cardBorder,
            backgroundColor: theme.isDark ? 'rgba(11, 18, 38, 0.70)' : 'rgba(248, 250, 252, 0.75)',
          }}
        >
          {[
            {
              id: 'perfil' as AccountTab,
              labelEs: 'Mi Perfil',
              labelEn: 'Profile',
              icon: User,
            },
            {
              id: 'voces' as AccountTab,
              labelEs: 'Voz & Audio',
              labelEn: 'Voices',
              icon: Volume2,
            },
            {
              id: 'ajustes' as AccountTab,
              labelEs: 'App & Más',
              labelEn: 'App & Info',
              icon: Settings,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab(tab.id);
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isActive ? 'shadow-sm scale-[1.02]' : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? theme.accent : 'transparent',
                  borderColor: isActive ? theme.accent : theme.cardBorder,
                  color: isActive ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
                }}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 overscroll-contain relative z-10">

          {/* TAB 1: MI PERFIL */}
          {activeTab === 'perfil' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Profile Card */}
              <div
                className="p-4 rounded-2xl border space-y-2.5 relative shadow-xs"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                }}
              >
                {!isEditingProfile ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif-scripture font-bold text-base sm:text-lg" style={{ color: theme.text }}>
                          {profile.name}
                        </h4>
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs"
                          style={{
                            backgroundColor: theme.accentBg,
                            borderColor: theme.accentBorder,
                            color: theme.accent,
                          }}
                        >
                          {profile.avatarBadge}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="p-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: theme.accentBg,
                          borderColor: theme.accentBorder,
                          color: theme.accent,
                        }}
                        title={language === 'es' ? 'Editar Nombre o Correo' : 'Edit Profile'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Editar' : 'Edit'}</span>
                      </button>
                    </div>

                    <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                      {profile.email || (language === 'es' ? 'Perfil Privado Local (Sin correo)' : 'Private Local Profile')}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: theme.cardBorder }}>
                      <p className="text-[11px] flex items-center gap-1.5 font-bold" style={{ color: theme.accent }}>
                        <Shield className="w-3.5 h-3.5" />
                        <span>
                          {isAdmin
                            ? language === 'es'
                              ? 'Consola de moderación activa'
                              : 'Moderation console active'
                            : language === 'es'
                            ? 'Perfil Privado y Seguro'
                            : 'Verified & Private Profile'}
                        </span>
                      </p>
                      {profile.securityPin && (
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                          <KeyRound className="w-3 h-3" />
                          {language === 'es' ? 'PIN Activo' : 'PIN Active'}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold" style={{ color: theme.text }}>
                        {language === 'es' ? 'Nombre o Apodo Espiritual' : 'Spiritual Name'}
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2"
                        style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold" style={{ color: theme.text }}>
                        {language === 'es' ? 'Correo Electrónico (Opcional)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2"
                        style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text }}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                        style={{ color: theme.textMuted }}
                      >
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfileEdit}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-102 active:scale-95"
                        style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Guardar Cambios' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reminders & Notifications */}
              <div
                className="p-4 rounded-2xl border space-y-3"
                style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: theme.text }}>
                      <Bell className="w-4 h-4" style={{ color: theme.accent }} />
                      <span>{language === 'es' ? 'Recordatorio diario de oración' : 'Daily prayer notification'}</span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                      {language === 'es' ? 'Recibe una pausa de paz con tu versículo' : 'Receive a moment of peace with scripture'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setReminderEnabled(!reminderEnabled);
                    }}
                    className="w-11 h-6 rounded-full transition-colors relative cursor-pointer"
                    style={{
                      backgroundColor: reminderEnabled ? theme.accent : theme.isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(203, 213, 225, 0.8)',
                    }}
                    aria-label="Alternar recordatorio"
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {reminderEnabled && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: theme.cardBorder }}>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setReminderTime('morning');
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                      style={{
                        backgroundColor: reminderTime === 'morning' ? theme.accentBg : 'transparent',
                        color: reminderTime === 'morning' ? theme.accent : theme.textSecondary,
                        borderColor: reminderTime === 'morning' ? theme.accentBorder : theme.cardBorder,
                      }}
                    >
                      {language === 'es' ? 'Mañana (8:00 AM)' : 'Morning (8:00 AM)'}
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setReminderTime('evening');
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                      style={{
                        backgroundColor: reminderTime === 'evening' ? theme.accentBg : 'transparent',
                        color: reminderTime === 'evening' ? theme.accent : theme.textSecondary,
                        borderColor: reminderTime === 'evening' ? theme.accentBorder : theme.cardBorder,
                      }}
                    >
                      {language === 'es' ? 'Noche (9:30 PM)' : 'Evening (9:30 PM)'}
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Mode Toggle */}
              <div
                className="p-3.5 rounded-2xl border flex items-center justify-between"
                style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}
              >
                <div>
                  <p className="text-xs font-bold" style={{ color: theme.text }}>
                    {language === 'es' ? 'Modo de Moderación' : 'Moderator Mode'}
                  </p>
                  <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                    {language === 'es'
                      ? 'Revisar reportes de la comunidad y testimonios'
                      : 'Review community reports & testimonies'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setIsAdmin(!isAdmin);
                  }}
                  className="w-11 h-6 rounded-full transition-colors relative cursor-pointer"
                  style={{
                    backgroundColor: isAdmin ? theme.accent : theme.isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(203, 213, 225, 0.8)',
                  }}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      isAdmin ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VOCES & AUDIO */}
          {activeTab === 'voces' && (
            <div className="space-y-3.5 animate-fade-in">
              <div
                className="p-4 rounded-2xl border space-y-3"
                style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" style={{ color: theme.accent }} />
                    <h4 className="text-xs font-bold font-serif-scripture uppercase tracking-wider" style={{ color: theme.text }}>
                      {language === 'es' ? 'Voces Humanas Seleccionadas' : 'Curated Human Voices'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.accentBg, color: theme.accent }}>
                    {language === 'es' ? '1 voz a la vez' : 'Single stream'}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed" style={{ color: theme.textSecondary }}>
                  {language === 'es'
                    ? 'Cada voz ha sido calibrada con calidez humana para que tu lectura bíblica sea serena y reconfortante.'
                    : 'Each voice is calibrated with human warmth for serene scripture reading.'}
                </p>

                {/* Minimalist, Direct & Modern Voice Options List */}
                <div className="space-y-2 pt-1">
                  {HAVAH_VOICE_OPTIONS.map((v) => {
                    const isSelected = voicePref === v.id;
                    const isThisVoicePlaying = previewingVoice === v.id;

                    return (
                      <div
                        key={v.id}
                        onClick={() => handleTogglePreviewVoice(v.id as HavahVoiceId)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected ? 'shadow-sm ring-1' : 'hover:opacity-90'
                        }`}
                        style={{
                          backgroundColor: isSelected ? theme.accentBg : 'transparent',
                          borderColor: isSelected ? theme.accent : theme.cardBorder,
                          // @ts-ignore
                          ringColor: isSelected ? theme.accent : 'transparent',
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Selection indicator & Icon */}
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-all"
                            style={{
                              backgroundColor: isSelected ? theme.accent : theme.cardVariant,
                              borderColor: isSelected ? theme.accent : theme.cardBorder,
                              color: isSelected ? '#FFFFFF' : theme.textSecondary,
                            }}
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <Volume2 className="w-4 h-4 opacity-60" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <span className="text-sm font-bold tracking-tight block" style={{ color: theme.text }}>
                              {v.name}
                            </span>
                          </div>
                        </div>

                        {/* Dedicated Play / Stop Sample Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePreviewVoice(v.id as HavahVoiceId);
                          }}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isThisVoicePlaying ? 'ring-2 ring-rose-400 bg-rose-500/10' : ''
                          }`}
                          style={{
                            borderColor: isThisVoicePlaying ? '#F43F5E' : theme.cardBorder,
                            color: isThisVoicePlaying ? '#F43F5E' : theme.accent,
                            backgroundColor: theme.card,
                          }}
                          title={isThisVoicePlaying 
                            ? (language === 'es' ? 'Detener muestra' : 'Stop sample')
                            : (language === 'es' ? 'Escuchar muestra' : 'Play sample')}
                          aria-label={isThisVoicePlaying ? 'Detener' : 'Escuchar'}
                        >
                          {isThisVoicePlaying ? (
                            <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Speed Controls */}
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.cardBorder }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                      <Sliders className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                      <span>{language === 'es' ? 'Velocidad de lectura' : 'Reading speed'}</span>
                    </p>
                    <span className="text-xs font-mono font-bold" style={{ color: theme.accent }}>
                      {voiceRate.toFixed(2)}x
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { rate: 0.9, labelEs: '0.9x • Pausada', labelEn: '0.9x • Slow' },
                      { rate: 1.05, labelEs: '1.05x • Serena', labelEn: '1.05x • Serene' },
                      { rate: 1.2, labelEs: '1.20x • Fluida', labelEn: '1.20x • Lively' },
                    ].map((sp) => (
                      <button
                        key={sp.rate}
                        onClick={() => {
                          triggerHaptic('light');
                          handleRateChange(sp.rate);
                        }}
                        className="py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer hover:scale-102 active:scale-95"
                        style={{
                          backgroundColor: Math.abs(voiceRate - sp.rate) < 0.03 ? theme.accentBg : 'transparent',
                          borderColor: Math.abs(voiceRate - sp.rate) < 0.03 ? theme.accentBorder : theme.cardBorder,
                          color: Math.abs(voiceRate - sp.rate) < 0.03 ? theme.accent : theme.textSecondary,
                        }}
                      >
                        {language === 'es' ? sp.labelEs : sp.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APP & AJUSTES */}
          {activeTab === 'ajustes' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* PWA Mobile App Download Guide */}
              <div
                className="rounded-2xl border p-4 transition-all space-y-2.5 shadow-xs"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                }}
              >
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setShowInstallGuide(!showInstallGuide);
                  }}
                  className="w-full flex items-center justify-between font-serif-scripture font-bold text-xs sm:text-sm text-left cursor-pointer"
                  style={{ color: theme.text }}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>
                      {language === 'es' ? 'Instalar App en Celular (iPhone & Android)' : 'Install Mobile App'}
                    </span>
                  </div>
                  <span className="text-[11px] font-sans font-bold underline" style={{ color: theme.accent }}>
                    {showInstallGuide 
                      ? (language === 'es' ? 'Ocultar' : 'Hide') 
                      : (language === 'es' ? 'Ver Guía' : 'Show Guide')}
                  </span>
                </button>

                {showInstallGuide && (
                  <div className="text-xs leading-relaxed space-y-3 pt-2 border-t text-left" style={{ borderColor: theme.cardBorder, color: theme.textSecondary }}>
                    <div className="space-y-1">
                      <p className="font-bold text-xs" style={{ color: theme.text }}>
                        Para iPhone / iPad (Safari iOS):
                      </p>
                      <ol className="list-decimal list-inside space-y-1 pl-1 opacity-95">
                        <li>Abre esta página en <strong>Safari</strong>.</li>
                        <li>Toca el botón <strong>Compartir</strong> (icono del recuadro con flecha).</li>
                        <li>Selecciona <strong>"Agregar a Inicio"</strong>.</li>
                        <li>¡Listo! Se abrirá como una aplicación nativa completa.</li>
                      </ol>
                    </div>

                    <div className="space-y-1 pt-2 border-t" style={{ borderColor: theme.cardBorder }}>
                      <p className="font-bold text-xs" style={{ color: theme.text }}>
                        Para Android (Chrome, Samsung, Xiaomi):
                      </p>
                      <ol className="list-decimal list-inside space-y-1 pl-1 opacity-95">
                        <li>Abre en <strong>Google Chrome</strong>.</li>
                        <li>Toca el menú de los <strong>tres puntos</strong>.</li>
                        <li>Toca <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</li>
                        <li>¡Listo! Acceso instantáneo y lectura offline disponible.</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Features Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setShowSoulLetters(true);
                  }}
                  className="p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer shadow-xs hover:scale-102 active:scale-95"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <div className="flex items-center gap-1.5" style={{ color: theme.accent }}>
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold">{language === 'es' ? 'Cápsula del Tiempo' : 'Time Capsule'}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                    {language === 'es' ? 'Cofre secreto de oración' : 'Secret prayer vault'}
                  </p>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setShowHavahPlus(true);
                  }}
                  className="p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer shadow-xs hover:scale-102 active:scale-95"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                  }}
                >
                  <div className="flex items-center gap-1.5" style={{ color: theme.accent }}>
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">{language === 'es' ? 'Causas Sociales & Mayordomía' : 'Social Causes & Stewardship'}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                    {language === 'es' ? '65% familias • 35% sostenibilidad' : '65% families • 35% upkeep'}
                  </p>
                </button>
              </div>

              {/* Privacy Note & Legal */}
              <div
                className="p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                }}
              >
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.accent }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: theme.textSecondary }}>
                    {language === 'es'
                      ? 'Tu intimidad es sagrada: Tus notas y oraciones se guardan de forma privada entre tú y Dios.'
                      : 'Your privacy is sacred: Your thoughts remain private between you and God.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setShowLegal(true);
                  }}
                  className="text-xs font-bold shrink-0 underline cursor-pointer"
                  style={{ color: theme.accent }}
                >
                  {language === 'es' ? 'Legal' : 'Legal'}
                </button>
              </div>

              {/* Reset Data */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        language === 'es'
                          ? '¿Deseas restablecer los datos de la aplicación y comenzar de nuevo?'
                          : 'Do you want to reset all app data and start fresh?'
                      )
                    ) {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="text-[10px] font-bold tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer border-b border-transparent hover:border-current"
                  style={{ color: theme.textSecondary }}
                >
                  {language === 'es' ? 'Restablecer datos y comenzar de nuevo' : 'Reset data and start fresh'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Pinned Sticky Bottom Dismiss Action */}
        <div
          className="shrink-0 p-3 sm:p-4 border-t z-20 sticky bottom-0 backdrop-blur-xl flex justify-end"
          style={{
            borderColor: theme.cardBorder,
            backgroundColor: theme.isDark ? 'rgba(3, 7, 18, 0.95)' : 'rgba(255, 255, 255, 0.96)',
          }}
        >
          <button
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shadow-sm hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.accent,
              color: theme.isDark ? '#000000' : '#FFFFFF',
            }}
          >
            <span>{language === 'es' ? 'Listo • Cerrar perfil' : 'Done • Close profile'}</span>
          </button>
        </div>
      </div>

      <SoulLettersModal
        isOpen={showSoulLetters}
        language={language}
        theme={theme}
        onClose={() => setShowSoulLetters(false)}
      />

      <HavahPlusModal
        isOpen={showHavahPlus}
        language={language}
        theme={theme}
        onClose={() => setShowHavahPlus(false)}
      />

      <LegalModal
        isOpen={showLegal}
        language={language}
        theme={theme}
        onClose={() => setShowLegal(false)}
      />
    </div>
  );
};
