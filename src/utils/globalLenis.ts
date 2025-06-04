// Global Lenis initialization and utilities
// This file provides global smooth animations and interactions

import { LenisAnimator, lenisUtils } from './lenisAnimations.ts';

// Global Lenis instance
export const globalLenis = new LenisAnimator({
  duration: 1.0,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  smooth: true,
  smoothTouch: true
});

// Global animation configurations
export const animationConfig = {
  // Entrance animations
  entrance: {
    duration: 0.8,
    stagger: 0.1,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  // Hover effects
  hover: {
    duration: 0.3,
    scale: 1.02,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  // Page transitions
  pageTransition: {
    duration: 0.6,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  // Loading animations
  loading: {
    duration: 0.5,
    stagger: 0.08,
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
};

// Global initialization function
export function initializeGlobalLenis() {
  console.log('Initializing Global Lenis animations...');

  // Apply entrance animations to main containers
  const mainContainers = document.querySelectorAll('.videowall-container, .system-monitor-panel, .indicator-list');
  if (mainContainers.length > 0) {
    globalLenis.fadeIn(mainContainers, {
      duration: animationConfig.entrance.duration,
      stagger: animationConfig.entrance.stagger,
      delay: 0.2
    });
  }

  // Apply hover effects to interactive elements
  const interactiveElements = document.querySelectorAll('button, .clickable, [role="button"], .indicator-item, .issue-item');
  interactiveElements.forEach(element => {
    lenisUtils.hoverEffect(element as HTMLElement, animationConfig.hover.scale);
  });

  // Initialize smooth scrolling for marked containers
  initializeSmoothScrolling();

  // Apply loading sequence to key elements
  setTimeout(() => {
    const keyElements = document.querySelectorAll('.summary-item, .carousel-slide, .page-dot');
    if (keyElements.length > 0) {
      globalLenis.fadeIn(keyElements, {
        duration: animationConfig.loading.duration,
        stagger: animationConfig.loading.stagger,
        delay: 0.5
      });
    }
  }, 1000);
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
  const scrollContainers = document.querySelectorAll('[data-lenis-scroll]');

  scrollContainers.forEach(container => {
    const htmlContainer = container as HTMLElement;

    // Smooth wheel scrolling
    htmlContainer.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY;
      const currentScroll = htmlContainer.scrollTop;
      const maxScroll = htmlContainer.scrollHeight - htmlContainer.clientHeight;

      // Smooth easing calculation
      const targetScroll = Math.max(0, Math.min(maxScroll, currentScroll + delta * 0.6));

      // Animate to target position
      animateScrollTo(htmlContainer, targetScroll, 300);
    });

    // Touch scrolling improvements
    let touchStartY = 0;
    let touchStartTime = 0;

    htmlContainer.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    });

    htmlContainer.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault();

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const currentScroll = htmlContainer.scrollTop;
      const maxScroll = htmlContainer.scrollHeight - htmlContainer.clientHeight;

      // Apply momentum and smooth easing
      const targetScroll = Math.max(0, Math.min(maxScroll, currentScroll + deltaY * 1.5));
      animateScrollTo(htmlContainer, targetScroll, 200);

      touchStartY = touchY;
    });
  });
}

// Smooth scroll animation function
function animateScrollTo(element: HTMLElement, targetScroll: number, duration: number) {
  const startScroll = element.scrollTop;
  const distance = targetScroll - startScroll;
  const startTime = performance.now();

  function animation(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth easing function (ease-out cubic)
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    element.scrollTop = startScroll + distance * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Performance optimization utilities
export function optimizeAnimations() {
  // Add CSS containment for better performance
  const animatedElements = document.querySelectorAll('.indicator-item, .carousel-slide, .issue-item');
  animatedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.contain = 'layout style paint';
    htmlElement.style.willChange = 'transform, opacity';
  });

  // Use transform3d for hardware acceleration
  const acceleratedElements = document.querySelectorAll('[class*="panel"], .videowall-container');
  acceleratedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.transform = 'translateZ(0)';
    htmlElement.style.backfaceVisibility = 'hidden';
    htmlElement.style.perspective = '1000px';
  });
}

// Responsive animation adjustments
export function adjustAnimationsForViewport() {
  const isLargeScreen = window.innerWidth > 1920;
  const isSmallScreen = window.innerWidth < 1200;

  // Adjust animation durations based on screen size
  if (isLargeScreen) {
    animationConfig.entrance.duration = 1.0;
    animationConfig.hover.duration = 0.4;
  } else if (isSmallScreen) {
    animationConfig.entrance.duration = 0.6;
    animationConfig.hover.duration = 0.2;
  }

  // Note: globalLenis config is private, so we'll create new instances if needed
  // For now, we'll just update our animation config object
}

// Export for easy access
export { lenisUtils };
