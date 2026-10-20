/**
 * Subtle haptic feedback utility for mobile and desktop touch interactions
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' = 'light') {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'light') {
        navigator.vibrate(12);
      } else if (type === 'medium') {
        navigator.vibrate(25);
      } else if (type === 'success') {
        navigator.vibrate([15, 40, 30]);
      }
    }
  } catch {
    // Ignore if vibration not permitted or supported
  }
}
