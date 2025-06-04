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
  }
};
