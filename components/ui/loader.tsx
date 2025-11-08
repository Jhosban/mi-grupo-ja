'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'circle';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ 
    className, 
    size = 'md', 
    variant = 'spinner', 
    color = 'primary', 
    text, 
    fullScreen = false,
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6', 
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };

    const colorClasses = {
      primary: 'text-indigo-600',
      secondary: 'text-gray-600',
      accent: 'text-emerald-600',
      white: 'text-white'
    };

    const containerClass = fullScreen 
      ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm'
      : 'flex items-center justify-center';

    const renderSpinner = () => (
      <svg
        className={cn(sizeClasses[size], colorClasses[color], 'animate-spin')}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const renderDots = () => (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-pulse',
              {
                'w-2 h-2': size === 'xs',
                'w-2.5 h-2.5': size === 'sm',
                'w-3 h-3': size === 'md',
                'w-4 h-4': size === 'lg',
                'w-5 h-5': size === 'xl',
              },
              {
                'bg-indigo-600': color === 'primary',
                'bg-gray-600': color === 'secondary',
                'bg-emerald-600': color === 'accent',
                'bg-white': color === 'white',
              },
              i === 1 && 'delay-100',
              i === 2 && 'delay-200'
            )}
          />
        ))}
      </div>
    );

    const renderPulse = () => (
      <div className={cn(
        'rounded-full animate-pulse',
        sizeClasses[size],
        {
          'bg-indigo-600': color === 'primary',
          'bg-gray-600': color === 'secondary', 
          'bg-emerald-600': color === 'accent',
          'bg-white': color === 'white',
        }
      )} />
    );

    const renderBars = () => (
      <div className="flex items-end space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'animate-bounce rounded-sm',
              {
                'w-1 h-4': size === 'xs',
                'w-1.5 h-6': size === 'sm',
                'w-2 h-8': size === 'md',
                'w-2.5 h-12': size === 'lg',
                'w-3 h-16': size === 'xl',
              },
              {
                'bg-indigo-600': color === 'primary',
                'bg-gray-600': color === 'secondary',
                'bg-emerald-600': color === 'accent',
                'bg-white': color === 'white',
              },
              i === 1 && 'delay-100',
              i === 2 && 'delay-200',
              i === 3 && 'delay-300'
            )}
          />
        ))}
      </div>
    );

    const renderCircle = () => (
      <div className="relative">
        <div className={cn(
          'rounded-full border-4 border-gray-200 dark:border-gray-700',
          sizeClasses[size]
        )} />
        <div className={cn(
          'absolute inset-0 rounded-full border-4 border-transparent animate-spin',
          sizeClasses[size],
          {
            'border-t-indigo-600': color === 'primary',
            'border-t-gray-600': color === 'secondary',
            'border-t-emerald-600': color === 'accent',
            'border-t-white': color === 'white',
          }
        )} />
      </div>
    );

    const renderLoader = () => {
      switch (variant) {
        case 'dots':
          return renderDots();
        case 'pulse':
          return renderPulse();
        case 'bars':
          return renderBars();
        case 'circle':
          return renderCircle();
        default:
          return renderSpinner();
      }
    };

    return (
      <div 
        className={cn(containerClass, className)}
        ref={ref}
        {...props}
      >
        <div className="flex flex-col items-center space-y-3">
          {renderLoader()}
          
          {text && (
            <div className={cn(
              'text-sm font-medium animate-pulse',
              {
                'text-indigo-600': color === 'primary',
                'text-gray-600': color === 'secondary',
                'text-emerald-600': color === 'accent',
                'text-white': color === 'white',
              }
            )}>
              {text}
            </div>
          )}
        </div>

        {fullScreen && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none" />
        )}
      </div>
    );
  }
);

Loader.displayName = 'Loader';

export { Loader };

// Presets for common use cases
export const LoadingSpinner = ({ size = 'md', ...props }: Omit<LoaderProps, 'variant'>) => (
  <Loader variant="spinner" size={size} {...props} />
);

export const LoadingDots = ({ size = 'md', ...props }: Omit<LoaderProps, 'variant'>) => (
  <Loader variant="dots" size={size} {...props} />
);

export const LoadingBars = ({ size = 'md', ...props }: Omit<LoaderProps, 'variant'>) => (
  <Loader variant="bars" size={size} {...props} />
);

export const FullScreenLoader = ({ 
  text = 'Cargando...', 
  variant = 'circle',
  ...props 
}: LoaderProps) => (
  <Loader 
    variant={variant}
    size="lg" 
    fullScreen 
    text={text}
    {...props} 
  />
);