// Lenis-inspired animation system for smooth transitions
// Utiliza GSAP que ya está disponible en el proyecto

interface LenisConfig {
  duration: number;
  easing: string;
  smooth: boolean;
  smoothTouch: boolean;
  wheelMultiplier: number;
  touchMultiplier: number;
}

interface AnimationOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  onUpdate?: (progress: number) => void;
}

class LenisAnimator {
  private config: LenisConfig;
  private raf: number | null = null;
  private isRunning = false;

  constructor(config: Partial<LenisConfig> = {}) {
    this.config = {
      duration: 1.2,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      smooth: true,
      smoothTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      ...config
    };
  }

  // Smooth fade in animation
  fadeIn(elements: string | Element | NodeList, options: AnimationOptions = {}) {
    const targets = this.getElements(elements);
    if (!targets.length) return;

    const opts = {
      duration: this.config.duration,
      ease: this.config.easing,
      delay: 0,
      stagger: 0.1,
      ...options
    };

    // Set initial state
    targets.forEach((el: HTMLElement) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });

    // Animate in
    this.animateElements(targets, {
      opacity: 1,
      transform: 'translateY(0px)',
      ...opts
    });
  }

  // Smooth fade out animation
  fadeOut(elements: string | Element | NodeList, options: AnimationOptions = {}) {
    const targets = this.getElements(elements);
    if (!targets.length) return;

    const opts = {
      duration: this.config.duration * 0.6,
      ease: this.config.easing,
      delay: 0,
      stagger: 0.05,
      ...options
    };

    this.animateElements(targets, {
      opacity: 0,
      transform: 'translateY(-10px)',
      ...opts
    });
  }

  // Smooth slide transitions
  slideIn(elements: string | Element | NodeList, direction: 'left' | 'right' | 'up' | 'down' = 'up', options: AnimationOptions = {}) {
    const targets = this.getElements(elements);
    if (!targets.length) return;

    const transforms = {
      left: 'translateX(-50px)',
      right: 'translateX(50px)',
      up: 'translateY(30px)',
      down: 'translateY(-30px)'
    };

    const opts = {
      duration: this.config.duration,
      ease: this.config.easing,
      delay: 0,
      stagger: 0.08,
      ...options
    };

    // Set initial state
    targets.forEach((el: HTMLElement) => {
      el.style.opacity = '0';
      el.style.transform = transforms[direction];
    });

    // Animate in
    this.animateElements(targets, {
      opacity: 1,
      transform: 'translate(0px, 0px)',
      ...opts
    });
  }

  // Smooth scale animation
  scaleIn(elements: string | Element | NodeList, options: AnimationOptions = {}) {
    const targets = this.getElements(elements);
    if (!targets.length) return;

    const opts = {
      duration: this.config.duration * 0.8,
      ease: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Back ease
      delay: 0,
      stagger: 0.1,
      ...options
    };

    // Set initial state
    targets.forEach((el: HTMLElement) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
    });

    // Animate in
    this.animateElements(targets, {
      opacity: 1,
      transform: 'scale(1)',
      ...opts
    });
  }

  // Smooth scale out animation
  scaleOut(elements: string | Element | NodeList, options: AnimationOptions = {}) {
    const targets = this.getElements(elements);
    if (!targets.length) return;

    const opts = {
      duration: this.config.duration * 0.6,
      ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', // Ease in
      delay: 0,
      stagger: 0.05,
      ...options
    };

    this.animateElements(targets, {
      opacity: 0,
      transform: 'scale(0.8)',
      ...opts
    });
  }

  // Synchronized transition between elements
  syncTransition(fromElements: string | Element | NodeList | null, toElements: string | Element | NodeList | null, options: AnimationOptions = {}) {
    const fromTargets = fromElements ? this.getElements(fromElements) : [];
    const toTargets = toElements ? this.getElements(toElements) : [];

    if (!fromTargets.length && !toTargets.length) return;

    const opts = {
      duration: this.config.duration,
      ease: this.config.easing,
      delay: 0,
      ...options
    };

    // Animate out current elements
    if (fromTargets.length > 0) {
      this.animateElements(fromTargets, {
        opacity: 0,
        transform: 'scale(0.95) translateY(-10px)',
        duration: opts.duration * 0.4,
        ease: opts.ease
      });
    }

    // Animate in new elements with slight delay
    if (toTargets.length > 0) {
      setTimeout(() => {
        // Set initial state for new elements
        toTargets.forEach((el: HTMLElement) => {
          el.style.opacity = '0';
          el.style.transform = 'scale(0.95) translateY(10px)';
        });

        this.animateElements(toTargets, {
          opacity: 1,
          transform: 'scale(1) translateY(0px)',
          duration: opts.duration * 0.6,
          ease: opts.ease,
          delay: 0.1
        });
      }, opts.duration * 200); // 20% of animation duration
    }

    // Handle completion callback
    if (options.onComplete) {
      setTimeout(options.onComplete, opts.duration * 1000);
    }
  }

  // Smooth morphing transition
  morphTransition(fromElement: string | Element, toElement: string | Element, options: AnimationOptions = {}) {
    const from = this.getElement(fromElement);
    const to = this.getElement(toElement);

    if (!from || !to) return;

    const opts = {
      duration: this.config.duration,
      ease: this.config.easing,
      ...options
    };

    // Animate out the first element
    this.animateElement(from, {
      opacity: 0,
      transform: 'scale(0.95)',
      duration: opts.duration * 0.4,
      ease: opts.ease
    });

    // Animate in the second element with delay
    setTimeout(() => {
      this.animateElement(to, {
        opacity: 1,
        transform: 'scale(1)',
        duration: opts.duration * 0.6,
        ease: opts.ease
      });
    }, opts.duration * 400); // Convert to milliseconds
  }

  // Smooth continuous rotation
  startRotation(elements: string | Element | NodeList, options: { speed?: number; direction?: 'clockwise' | 'counterclockwise' } = {}) {
    const targets = this.getElements(elements);
    if (!targets.length) return;

    const opts = {
      speed: 1, // rotations per second
      direction: 'clockwise' as const,
      ...options
    };

    const rotationSpeed = opts.direction === 'clockwise' ? 360 : -360;
    const duration = 1 / opts.speed;

    targets.forEach((el: HTMLElement) => {
      this.animateElement(el, {
        rotation: rotationSpeed,
        duration: duration,
        ease: 'none',
        repeat: -1
      });
    });
  }

  // Stop all animations
  stopAll() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    this.isRunning = false;
  }

  // Private helper methods
  private getElements(selector: string | Element | NodeList): HTMLElement[] {
    if (typeof selector === 'string') {
      return Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      return [selector as HTMLElement];
    } else if (selector instanceof NodeList) {
      return Array.from(selector) as HTMLElement[];
    }
    return [];
  }

  private getElement(selector: string | Element): HTMLElement | null {
    if (typeof selector === 'string') {
      return document.querySelector(selector);
    } else if (selector instanceof Element) {
      return selector as HTMLElement;
    }
    return null;
  }

  private animateElements(elements: HTMLElement[], properties: any) {
    elements.forEach((el, index) => {
      const delay = properties.stagger ? index * properties.stagger * 1000 : (properties.delay || 0) * 1000;

      setTimeout(() => {
        this.animateElement(el, properties);
      }, delay);
    });
  }

  private animateElement(element: HTMLElement, properties: any) {
    // Use native CSS transitions for better performance
    const duration = properties.duration || this.config.duration;
    const ease = properties.ease || this.config.easing;

    element.style.transition = `all ${duration}s ${ease}`;

    // Apply properties
    Object.keys(properties).forEach(key => {
      if (key !== 'duration' && key !== 'ease' && key !== 'delay' && key !== 'stagger' && key !== 'onComplete' && key !== 'onUpdate') {
        if (key === 'transform' || key === 'opacity') {
          element.style[key] = properties[key];
        }
      }
    });

    // Handle completion callback
    if (properties.onComplete) {
      setTimeout(properties.onComplete, duration * 1000);
    }
  }
}

// Export singleton instance
export const lenis = new LenisAnimator({
  duration: 0.8,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  smooth: true
});

// Export class for custom instances
export { LenisAnimator };

// Utility functions for common animations
export const lenisUtils = {
  // Stagger animation for multiple elements
  staggerReveal: (elements: string, options: AnimationOptions = {}) => {
    lenis.slideIn(elements, 'up', {
      stagger: 0.1,
      duration: 0.6,
      ...options
    });
  },

  // Page transition effect
  pageTransition: (outElement: string, inElement: string, options: AnimationOptions = {}) => {
    lenis.morphTransition(outElement, inElement, {
      duration: 0.8,
      ...options
    });
  },

  // Smooth hover effect
  hoverEffect: (element: HTMLElement, scale: number = 1.05) => {
    element.addEventListener('mouseenter', () => {
      element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.transform = `scale(${scale})`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
    });
  },

  // Smooth loading animation
  loadingSequence: (elements: string[], options: AnimationOptions = {}) => {
    elements.forEach((selector, index) => {
      setTimeout(() => {
        lenis.fadeIn(selector, {
          duration: 0.5,
          ...options
        });
      }, index * 200);
    });
  },

  // Enhanced region transition effect
  regionTransition: (fromRegion: string | null, toRegion: string, options: AnimationOptions = {}) => {
    const opts = {
      duration: 0.8,
      ...options
    };

    if (fromRegion) {
      // Hide current region
      lenis.syncTransition(fromRegion, null, {
        duration: opts.duration * 0.5,
        ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
      });
    }

    // Show new region with delay
    setTimeout(() => {
      lenis.syncTransition(null, toRegion, {
        duration: opts.duration * 0.7,
        ease: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        onComplete: options.onComplete
      });
    }, fromRegion ? opts.duration * 300 : 0);
  },

  // Breathing animation for attention-grabbing elements
  breathingEffect: (element: string | Element, options: { scale?: number; duration?: number } = {}) => {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;

    const opts = {
      scale: 1.02,
      duration: 2,
      ...options
    };

    const htmlTarget = target as HTMLElement;
    htmlTarget.style.animation = `breathe ${opts.duration}s ease-in-out infinite alternate`;

    // Add keyframes if not already present
    if (!document.querySelector('#breathe-keyframes')) {
      const style = document.createElement('style');
      style.id = 'breathe-keyframes';
      style.textContent = `
        @keyframes breathe {
          0% { transform: scale(1); }
          100% { transform: scale(${opts.scale}); }
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Pulse effect for notifications or highlights
  pulseEffect: (element: string | Element, color: string = '#54ccb8') => {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;

    const htmlTarget = target as HTMLElement;
    htmlTarget.style.position = 'relative';
    htmlTarget.style.overflow = 'hidden';

    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: ${color};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0.6;
      animation: pulse 0.6s ease-out;
    `;

    // Add pulse keyframes if not already present
    if (!document.querySelector('#pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'pulse-keyframes';
      style.textContent = `
        @keyframes pulse {
          0% { width: 0; height: 0; opacity: 0.6; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    htmlTarget.appendChild(pulse);
    setTimeout(() => pulse.remove(), 600);
  }
};
