'use client';

import { cn } from './cn';

/**
 * Animation utility classes and helpers for consistent UI animations
 */

// Common animation durations
export const ANIMATION_DURATIONS = {
  fastest: 75,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 700,
} as const;

// Common easing functions
export const ANIMATION_EASINGS = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)', 
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

// Animation state helpers
export const createAnimationClass = (
  base: string,
  state: boolean,
  activeClass: string,
  inactiveClass: string = ''
) => {
  return cn(base, {
    [activeClass]: state,
    [inactiveClass]: !state && inactiveClass,
  });
};

// Common animation combinations
export const ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: 'animate-fade-in opacity-0 opacity-100',
  fadeOut: 'animate-fade-out opacity-100 opacity-0',
  
  // Scale animations
  scaleIn: 'animate-scale-in scale-95 scale-100',
  scaleOut: 'animate-scale-out scale-100 scale-95',
  
  // Slide animations  
  slideInUp: 'animate-slide-in-bottom translate-y-4 translate-y-0',
  slideInDown: 'animate-slide-in-top -translate-y-4 translate-y-0',
  slideInLeft: 'animate-slide-in-right translate-x-4 translate-x-0',
  slideInRight: 'animate-slide-in-left -translate-x-4 translate-x-0',
  
  // Combined animations
  fadeSlideInUp: 'opacity-0 translate-y-4 opacity-100 translate-y-0',
  fadeSlideInDown: 'opacity-0 -translate-y-4 opacity-100 translate-y-0',
  fadeSlideInLeft: 'opacity-0 translate-x-4 opacity-100 translate-x-0',
  fadeSlideInRight: 'opacity-0 -translate-x-4 opacity-100 translate-x-0',
  
  // Hover effects
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverLift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
  hoverGlow: 'hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow duration-300',
  
  // Button effects
  buttonPress: 'active:scale-95 transition-transform duration-150',
  buttonHover: 'hover:scale-105 active:scale-95 transition-transform duration-150',
  
  // Loading states
  loading: 'animate-pulse opacity-60',
  spinner: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Floating effects
  float: 'animate-float',
  floatSubtle: 'animate-float-subtle',
  floatMedium: 'animate-float-medium',
  floatStrong: 'animate-float-strong',
} as const;

// Stagger animation helpers
export const createStaggerDelay = (index: number, delayMs: number = 100) => {
  return `delay-[${index * delayMs}ms]`;
};

export const getStaggerClass = (index: number, baseDelay: number = 100) => {
  const delays = ['delay-0', 'delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500'];
  const delayIndex = Math.min(index, delays.length - 1);
  return delays[delayIndex];
};

// Visibility animation classes
export const VISIBILITY_CLASSES = {
  hidden: 'opacity-0 scale-95 translate-y-1',
  visible: 'opacity-100 scale-100 translate-y-0',
  transition: 'transition-all duration-200 ease-out',
} as const;

// Modal/Dialog animation classes
export const MODAL_CLASSES = {
  overlay: {
    enter: 'animate-fade-in',
    exit: 'animate-fade-out',
  },
  content: {
    enter: 'animate-scale-in animate-fade-in',
    exit: 'animate-scale-out animate-fade-out',
  },
} as const;

// Toast/Notification animation classes
export const TOAST_CLASSES = {
  enter: 'animate-slide-in-right animate-fade-in',
  exit: 'animate-slide-out-right animate-fade-out',
  progress: 'animate-progress-indeterminate',
} as const;

// Card hover effects
export const CARD_EFFECTS = {
  subtle: 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
  medium: 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200',
  strong: 'hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300',
  glow: 'hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300',
} as const;

// Focus ring animations
export const FOCUS_CLASSES = {
  default: 'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-shadow duration-200',
  error: 'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-shadow duration-200',
  success: 'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-shadow duration-200',
} as const;

// Loading skeleton classes
export const SKELETON_CLASSES = {
  base: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
  shimmer: 'relative overflow-hidden bg-gray-200 dark:bg-gray-700 animate-shimmer',
  text: 'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
  avatar: 'w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse',
  button: 'h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
} as const;

// Utility function to create transition styles
export const createTransition = (
  properties: string[] = ['all'],
  duration: keyof typeof ANIMATION_DURATIONS = 'normal',
  easing: keyof typeof ANIMATION_EASINGS = 'easeOut'
) => {
  return {
    transition: `${properties.join(', ')} ${ANIMATION_DURATIONS[duration]}ms ${ANIMATION_EASINGS[easing]}`,
  };
};

// CSS-in-JS animation styles
export const ANIMATION_STYLES = {
  fadeIn: {
    animation: 'fadeInOut 0.3s ease-out forwards',
  },
  slideUp: {
    animation: 'slideInFromBottom 0.3s ease-out forwards',
  },
  scaleIn: {
    animation: 'scaleIn 0.2s ease-out forwards',
  },
  float: {
    animation: 'float 3s ease-in-out infinite',
  },
  shimmer: {
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    backgroundSize: '200px 100%',
    animation: 'shimmer 1.5s infinite',
  },
} as const;

// Helper for intersection observer animations
export const createInViewAnimation = (
  element: Element,
  animationClass: string,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '50px' }
) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add(animationClass);
        observer.unobserve(element);
      }
    },
    options
  );
  
  observer.observe(element);
  return () => observer.unobserve(element);
};

// Animation event helpers
export const onAnimationComplete = (
  element: HTMLElement,
  callback: () => void
) => {
  const handleAnimationEnd = () => {
    callback();
    element.removeEventListener('animationend', handleAnimationEnd);
  };
  
  element.addEventListener('animationend', handleAnimationEnd);
  return () => element.removeEventListener('animationend', handleAnimationEnd);
};

export const onTransitionComplete = (
  element: HTMLElement,
  callback: () => void
) => {
  const handleTransitionEnd = () => {
    callback();
    element.removeEventListener('transitionend', handleTransitionEnd);
  };
  
  element.addEventListener('transitionend', handleTransitionEnd);
  return () => element.removeEventListener('transitionend', handleTransitionEnd);
};