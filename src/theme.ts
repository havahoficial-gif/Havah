/**
 * HAVAH Theme Tokens - High Contrast, Premium Readability (Day & Night)
 */

export interface ThemeColors {
  isDark: boolean;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentBg: string;
  accentBorder: string;
  flame: string;
  bg: string;
  card: string;
  cardVariant: string;
  cardBorder: string;
  glassCard: string;
  glassCardVariant: string;
  glassBorder: string;
  glassShadow: string;
  glassHighlight: string;
  text: string;
  textMuted: string;
  textSecondary: string;
}

export function getThemeColors(isDark: boolean): ThemeColors {
  if (isDark) {
    // Night Mode: Deep Midnight Space with Liquid Glass and Radiant Aqua
    return {
      isDark: true,
      accent: '#2DD4BF', // Radiant Celestial Aqua-Teal
      accentHover: '#14B8A6',
      accentLight: '#5EEAD4',
      accentBg: 'rgba(45, 212, 191, 0.16)',
      accentBorder: 'rgba(45, 212, 191, 0.45)',
      flame: '#F472B6',
      bg: '#020408', // Deep Pitch Midnight Space (3D Nocturno)
      card: 'rgba(10, 16, 28, 0.65)', // Smoked Obsidian Liquid Glass Card
      cardVariant: 'rgba(13, 20, 34, 0.60)',
      cardBorder: 'rgba(255, 255, 255, 0.12)',
      glassCard: 'rgba(10, 16, 28, 0.65)',
      glassCardVariant: 'rgba(13, 20, 34, 0.60)',
      glassBorder: 'rgba(255, 255, 255, 0.12)',
      glassShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.85), 0 4px 18px -2px rgba(0, 0, 0, 0.55)',
      glassHighlight: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
      text: '#FFFFFF', // Pure White: WCAG AAA > 19:1 contrast
      textSecondary: '#F1F5F9', // Crisp Pearl White: WCAG AAA > 16:1 contrast
      textMuted: '#CBD5E1', // High-Legibility Light Slate: WCAG AAA > 9.5:1
    };
  }

  // Day Mode: Ultra-refined, subtle, elegant light sky-tinted ethereal glass cards (not grey or stark white)
  return {
    isDark: false,
    accent: '#0284c7', // Elegant Azure Accent
    accentHover: '#0369a1',
    accentLight: '#38bdf8',
    accentBg: 'rgba(2, 132, 199, 0.10)',
    accentBorder: 'rgba(2, 132, 199, 0.25)',
    flame: '#E11D48',
    bg: '#e0f2fe', // Soft diffused azure day background
    card: 'rgba(240, 249, 255, 0.82)', // Soft light sky-tinted ethereal glass card
    cardVariant: 'rgba(224, 242, 254, 0.86)',
    cardBorder: 'rgba(56, 189, 248, 0.28)',
    glassCard: 'rgba(240, 249, 255, 0.85)',
    glassCardVariant: 'rgba(224, 242, 254, 0.88)',
    glassBorder: 'rgba(56, 189, 248, 0.32)',
    glassShadow: '0 16px 36px -10px rgba(56, 189, 248, 0.14), 0 3px 12px -2px rgba(0, 0, 0, 0.03)',
    glassHighlight: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
    text: '#0f172a', // Deep Rich Slate/Navy for crystal-clear premium readability
    textSecondary: '#1e293b',
    textMuted: '#475569',
  };
};
