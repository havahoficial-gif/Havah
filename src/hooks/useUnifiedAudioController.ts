import { useState, useCallback, useEffect } from 'react';

/**
 * Unified Audio Controller Hook
 * Maps language state ('es' or 'en') to native Web Speech API voices.
 * Ensures zero language bleed by forcing locale-specific voice selection.
 */
export const useUnifiedAudioController = (language: 'es' | 'en') => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const selectVoice = () => {
      const voices = synth.getVoices();
      // Prioritize high-quality native voices for the selected locale, strictly excluding 'david' and robotic fallbacks
      const localePrefix = language === 'es' ? 'es-' : 'en-';
      
      const filteredVoices = voices.filter(
        (v) => v.lang.toLowerCase().startsWith(localePrefix) && !v.name.toLowerCase().includes('david')
      );

      // Prioritize natural/online neural voices like Jenny, Aria, Sonia, Laura, Samantha
      const selected =
        filteredVoices.find((v) => /natural|neural|online|jenny|aria|sonia|helena|sabina|samantha/i.test(v.name)) ||
        filteredVoices.find((v) => v.default) ||
        filteredVoices[0];
      
      setVoice(selected || null);
    };

    if (synth.getVoices().length > 0) {
      selectVoice();
    } else {
      synth.onvoiceschanged = selectVoice;
    }

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [language]);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop current playback

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    
    if (voice) {
      utterance.voice = voice;
    }

    // Adjust rate for a calm, contemplative pace
    utterance.rate = 0.9;
    
    window.speechSynthesis.speak(utterance);
  }, [language, voice]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
};
