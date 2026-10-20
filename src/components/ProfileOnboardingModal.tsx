import React, { useState } from 'react';
import { User, Shield, Lock, Mail, Sparkles, Check, KeyRound, Heart, Eye, EyeOff } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { ThemeColors } from '../theme';
import { triggerHaptic } from '../utils/haptics';

interface ProfileOnboardingModalProps {
  language: Language;
  theme: ThemeColors;
  onSaveProfile: (profile: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  { id: 'Caminante en Gracia', icon: '✦', es: 'Caminante en Gracia', en: 'Walker in Grace' },
  { id: 'Buscadora de Paz', icon: '✦', es: 'Buscadora de Paz', en: 'Seeker of Peace' },
  { id: 'Corazón Agradecido', icon: '✦', es: 'Corazón Agradecido', en: 'Grateful Heart' },
  { id: 'Alma Serena', icon: '✦', es: 'Alma Serena', en: 'Quiet Soul' },
];

export const ProfileOnboardingModal: React.FC<ProfileOnboardingModalProps> = ({
  language,
  theme,
  onSaveProfile,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarBadge, setAvatarBadge] = useState('Caminante en Gracia');
  const [enablePin, setEnablePin] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(language === 'es' ? 'Por favor escribe tu nombre para darte la bienvenida' : 'Please enter your name to welcome you');
      return;
    }

    if (enablePin && pin.length < 4) {
      setErrorMsg(language === 'es' ? 'El PIN debe tener 4 dígitos' : 'PIN must be 4 digits');
      return;
    }

    triggerHaptic('success');
    const newProfile: UserProfile = {
      name: name.trim(),
      email: email.trim() || undefined,
      avatarBadge,
      securityPin: enablePin ? pin : undefined,
      isAnonymous: !email.trim(),
      createdAt: Date.now(),
    };

    onSaveProfile(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in bg-black/80">
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all relative overflow-hidden backdrop-blur-2xl liquid-glass space-y-6 max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
          color: theme.text,
        }}
      >
        {/* Ambient Atmosphere */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-5 text-center">
          {/* Header Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border liquid-glass-subtle shadow-sm">
            <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: theme.accent }}>
              HAVAH • {language === 'es' ? 'Perfil Seguro y Privado' : 'Private Secure Profile'}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif-scripture font-bold text-2xl sm:text-3xl" style={{ color: theme.text }}>
              {language === 'es' ? 'Bienvenida a tu refugio de paz' : 'Welcome to your refuge of peace'}
            </h2>
            <p className="text-xs sm:text-sm max-w-sm mx-auto" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Un espacio íntimo para pausar, orar y reposar en la Palabra. Tus notas y oraciones se guardan de forma privada y segura en tu dispositivo.'
                : 'A quiet personal space to pause, pray, and rest in Scripture. Your reflections remain private on your device.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: theme.text }}>
                <User className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>{language === 'es' ? 'Tu Nombre *' : 'Your Name *'}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={language === 'es' ? 'Ej. Ana, Sofía, David, Elena...' : 'e.g. Grace, Sarah, David...'}
                className="w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none transition-all shadow-inner"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
                required
              />
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: theme.text }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  <span>{language === 'es' ? 'Correo Electrónico (Opcional)' : 'Email (Optional)'}</span>
                </label>
                <span className="text-[10px] italic" style={{ color: theme.textMuted }}>
                  {language === 'es' ? '100% Confidencial' : '100% Confidential'}
                </span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none transition-all shadow-inner"
                style={{
                  backgroundColor: theme.cardVariant,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                }}
              />
            </div>

            {/* Avatar Badge Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: theme.text }}>
                <Heart className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>{language === 'es' ? 'Tu Distintivo Espiritual' : 'Your Spiritual Badge'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = avatarBadge === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setAvatarBadge(opt.id);
                      }}
                      className={`p-2.5 rounded-2xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected ? 'shadow-md scale-[1.02]' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? theme.accentBg : theme.cardVariant,
                        borderColor: isSelected ? theme.accent : theme.cardBorder,
                        color: theme.text,
                      }}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span className="truncate">{language === 'es' ? opt.es : opt.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy PIN Toggle */}
            <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: theme.text }}>
                      {language === 'es' ? 'Candado de Privacidad para Diario' : 'Privacy PIN for Journal'}
                    </p>
                    <p className="text-[10px]" style={{ color: theme.textMuted }}>
                      {language === 'es' ? 'PIN de 4 dígitos para proteger tus oraciones' : '4-digit PIN for private prayers'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setEnablePin(!enablePin);
                  }}
                  className="w-10 h-5.5 rounded-full transition-colors relative cursor-pointer"
                  style={{ backgroundColor: enablePin ? theme.accent : 'rgba(150,150,150,0.3)' }}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      enablePin ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {enablePin && (
                <div className="relative pt-2">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="****"
                    className="w-full px-4 py-2 rounded-xl border text-center text-lg tracking-widest font-mono focus:outline-none"
                    style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-4 text-xs opacity-60 hover:opacity-100"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-xs text-rose-500 font-semibold text-center animate-shake">
                {errorMsg}
              </p>
            )}

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color: theme.accent }}>
              <Shield className="w-3.5 h-3.5" />
              <span>
                {language === 'es'
                  ? 'Privacidad Premium: Tus oraciones pertenecen solo a ti'
                  : 'Premium Privacy: Your prayers belong strictly to you'}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-sm font-bold shadow-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-2"
              style={{
                backgroundColor: theme.accent,
                color: theme.isDark ? '#000000' : '#FFFFFF',
              }}
            >
              <span>{language === 'es' ? 'Entrar a Mi Espacio de Paz' : 'Enter My Space of Peace'}</span>
              <Check className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
