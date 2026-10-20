import React from 'react';
import { Moon, Sun, UserCheck, Heart } from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';

interface HeaderProps {
  language: Language;
  theme: ThemeColors;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onOpenAccount: () => void;
  onOpenHavahPlus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
  onOpenAccount,
  onOpenHavahPlus,
}) => {
  return (
    <header
      className="app-header sticky top-0 z-30 w-full transition-all duration-300 border-b backdrop-blur-xl"
      style={{
        backgroundColor: theme.isDark ? 'rgba(11, 19, 34, 0.82)' : 'rgba(240, 249, 255, 0.85)',
        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(56, 189, 248, 0.28)',
        boxShadow: theme.isDark
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.45)'
          : '0 4px 16px -2px rgba(56, 189, 248, 0.12)',
      }}
    >
      <div className="app-header-inner w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand with quiet luxury emblem */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-xs overflow-hidden p-0.5 border"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <img
              src="/pwa-icon-192.png"
              alt="HAVAH Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <span
              className="font-serif-scripture font-bold tracking-[0.22em] text-base sm:text-lg block leading-none"
              style={{ color: theme.text }}
            >
              HAVAH
            </span>
            <span
              className="text-[9px] sm:text-[10px] tracking-wider block transition-colors mt-0.5 font-medium"
              style={{ color: theme.textMuted }}
            >
              {language === 'es' ? 'חַוָּה • Aliento de vida' : 'חַוָּה • Breath of life'}
            </span>
          </div>
        </div>

        {/* Quiet Luxury Sleek Action Pills with Holographic Prism */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="h-8 px-2.5 text-[11px] font-semibold tracking-wide rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 border btn-holographic-pill"
            style={{
              color: theme.accent,
            }}
            title={language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
          >
            {language === 'es' ? 'ES | EN' : 'EN | ES'}
          </button>

          {/* Theme Toggle (Día / Noche) */}
          <button
            onClick={onToggleTheme}
            className="h-8 px-2 sm:px-2.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 border btn-holographic-pill text-[11px] font-semibold"
            style={{
              color: theme.accent,
            }}
            title={theme.isDark ? (language === 'es' ? 'Activar Cielo Diurno Inflight' : 'Switch to Inflight Day Sky') : (language === 'es' ? 'Activar Noche Celestial' : 'Switch to Celestial Night')}
            aria-label={theme.isDark ? 'Activar Cielo Diurno' : 'Activar Noche Celestial'}
          >
            {theme.isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 transition-transform hover:rotate-45 text-amber-400" />
                <span className="hidden sm:inline">{language === 'es' ? 'Día' : 'Day'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 transition-transform hover:-rotate-12 text-sky-700" />
                <span className="hidden sm:inline">{language === 'es' ? 'Noche' : 'Night'}</span>
              </>
            )}
          </button>

          {/* Causas Sociales & Impact Wall */}
          {onOpenHavahPlus && (
            <button
              onClick={onOpenHavahPlus}
              className="h-8 flex items-center gap-1.5 px-2.5 sm:px-3 text-[11px] font-semibold rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 border btn-holographic-pill"
              style={{
                color: theme.accent,
              }}
              title={language === 'es' ? 'Transparencia de Causas Sociales e Impact Wall' : 'Social Causes & Impact Wall'}
            >
              <Heart className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">
                {language === 'es' ? 'Impacto' : 'Impact'}
              </span>
            </button>
          )}

          {/* Perfil & Preferencias */}
          <button
            onClick={onOpenAccount}
            className="h-8 flex items-center gap-1.5 px-2.5 sm:px-3 text-[11px] font-semibold rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 border btn-holographic-pill"
            style={{
              color: theme.accent,
            }}
            title="Mi cuenta y preferencias"
          >
            <UserCheck className="w-3 h-3" />
            <span className="hidden sm:inline">
              {language === 'es' ? 'Mi Perfil' : 'Profile'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
