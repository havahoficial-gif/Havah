import React from 'react';
import { CelestialAtmosphere } from './CelestialAtmosphere';

interface FloatingParticlesProps {
  isDark: boolean;
  scrollY?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = React.memo(({ isDark }) => {
  return <CelestialAtmosphere isDark={isDark} />;
});

export default FloatingParticles;
