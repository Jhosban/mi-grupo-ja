'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  once?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  variant = 'fade',
  direction = 'up',
  duration = 500,
  delay = 0,
  once = true
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!hasAnimated || !once)) {
          setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay, once, hasAnimated]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `duration-${duration}`;

    switch (variant) {
      case 'slide':
        const slideClasses = cn(baseClasses, durationClass);
        if (direction === 'up') {
          return cn(slideClasses, {
            'translate-y-8 opacity-0': !isVisible,
            'translate-y-0 opacity-100': isVisible,
          });
        } else if (direction === 'down') {
          return cn(slideClasses, {
            '-translate-y-8 opacity-0': !isVisible,
            'translate-y-0 opacity-100': isVisible,
          });
        } else if (direction === 'left') {
          return cn(slideClasses, {
            'translate-x-8 opacity-0': !isVisible,
            'translate-x-0 opacity-100': isVisible,
          });
        } else if (direction === 'right') {
          return cn(slideClasses, {
            '-translate-x-8 opacity-0': !isVisible,
            'translate-x-0 opacity-100': isVisible,
          });
        }
        return slideClasses;

      case 'scale':
        return cn(
          baseClasses,
          durationClass,
          {
            'scale-95 opacity-0': !isVisible,
            'scale-100 opacity-100': isVisible,
          }
        );

      case 'rotate':
        return cn(
          baseClasses,
          durationClass,
          {
            'rotate-6 scale-95 opacity-0': !isVisible,
            'rotate-0 scale-100 opacity-100': isVisible,
          }
        );

      case 'blur':
        return cn(
          baseClasses,
          durationClass,
          {
            'blur-sm opacity-0 scale-105': !isVisible,
            'blur-0 opacity-100 scale-100': isVisible,
          }
        );

      default: // fade
        return cn(
          baseClasses,
          durationClass,
          {
            'opacity-0': !isVisible,
            'opacity-100': isVisible,
          }
        );
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(getTransitionClasses(), className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Staggered animation for lists
export interface StaggeredTransitionProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  variant?: PageTransitionProps['variant'];
  direction?: PageTransitionProps['direction'];
}

export const StaggeredTransition: React.FC<StaggeredTransitionProps> = ({
  children,
  className,
  staggerDelay = 100,
  variant = 'slide',
  direction = 'up'
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <PageTransition
          key={index}
          variant={variant}
          direction={direction}
          delay={index * staggerDelay}
          className="transition-item"
        >
          {child}
        </PageTransition>
      ))}
    </div>
  );
};

// Route transition wrapper
export interface RouteTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  isLoading = false,
  loadingComponent
}) => {
  const [showContent, setShowContent] = React.useState(!isLoading);

  React.useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);

  if (isLoading && loadingComponent) {
    return (
      <PageTransition variant="fade" duration={200}>
        {loadingComponent}
      </PageTransition>
    );
  }

  return (
    <PageTransition 
      variant="fade" 
      duration={300}
      className="min-h-screen"
    >
      <div className={cn(
        'transition-opacity duration-300',
        {
          'opacity-100': showContent,
          'opacity-0': !showContent
        }
      )}>
        {children}
      </div>
    </PageTransition>
  );
};

// Floating elements animation
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}> = ({ 
  children, 
  className,
  intensity = 'subtle'
}) => {
  const intensityClasses = {
    subtle: 'animate-float-subtle',
    medium: 'animate-float-medium', 
    strong: 'animate-float-strong'
  };

  return (
    <div className={cn(intensityClasses[intensity], className)}>
      {children}
    </div>
  );
};

// Scroll-triggered animations
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}> = ({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        {
          'opacity-0 translate-y-8': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        },
        className
      )}
    >
      {children}
    </div>
  );
};