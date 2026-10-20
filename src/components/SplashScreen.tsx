import React, { useEffect, useState, useCallback } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface SplashScreenProps {
  onFinishLoading: () => void;
  // Optional props for backward compatibility
  theme?: any;
  language?: any;
}

/**
 * Ultra-fast, pristine dark Splash Screen.
 * Displays strictly the official logo on a deep dark canvas with zero delays or redundant text.
 * Opens the app in under 1 second.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinishLoading, theme }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isDark = theme?.isDark ?? false;

  const handleDismiss = useCallback(() => {
    if (isFadingOut) return;
    triggerHaptic('light');
    setIsFadingOut(true);
    try {
      sessionStorage.setItem('havah_splash_shown', 'true');
    } catch {}
    setTimeout(() => {
      onFinishLoading();
    }, 180);
  }, [isFadingOut, onFinishLoading]);

  useEffect(() => {
    // Ultra-fast launch (< 1s total): Direct logo, instant fade into app
    const timer = setTimeout(() => {
      handleDismiss();
    }, 450);

    return () => clearTimeout(timer);
  }, [handleDismiss]);

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center select-none cursor-pointer transition-opacity duration-200 ${
        isDark ? 'bg-[#030712]' : 'bg-gradient-to-b from-[#2e6aa0] via-[#4182b8] to-[#b6dbf5]'
      } ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centralized Clean Logo */}
      <div className="relative flex flex-col items-center justify-center animate-fade-in">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 shadow-2xl overflow-hidden flex items-center justify-center bg-transparent">
          <img
            src="/pwa-icon-512.png"
            alt="HAVAH"
            loading="eager"
            decoding="sync"
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};
