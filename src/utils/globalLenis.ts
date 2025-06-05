// Simplified animation utilities for specific component animations
// This file now only provides utilities for IndicatorList and Panel3 animations

import { lenisUtils } from './lenisAnimations.ts';

// Animation configurations preserved for Panel1 and Panel3
export const animationConfig = {
  // Page transitions for IndicatorList (Panel1)
  pageTransition: {
    duration: 0.6,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  // Carousel animations for Panel3
  carousel: {
    duration: 0.8,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    hoverScale: 1.02
  }
};

// Export for easy access
export { lenisUtils };
