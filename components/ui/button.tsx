'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glassmorphic';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading = false, loadingText, children, disabled, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    return (
      <button
        className={cn(
          // Base styles with enhanced transitions and transforms
          'inline-flex items-center justify-center rounded-xl text-label font-medium',
          'transform-gpu transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
          'active:scale-[0.98] hover:scale-[1.02]',
          'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
          'ring-offset-background backdrop-blur-sm',
          
          // Enhanced variant styles
          {
            // Default - Modern gradient with glass effect
            'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-500/25': variant === 'default',
            'hover:from-indigo-500 hover:via-indigo-600 hover:to-purple-600 hover:shadow-xl hover:shadow-indigo-500/30': variant === 'default',
            'active:from-indigo-700 active:via-indigo-800 active:to-purple-800': variant === 'default',
            
            // Gradient variant - Enhanced emerald/blue gradient
            'bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white shadow-lg shadow-emerald-500/25': variant === 'gradient',
            'hover:from-emerald-400 hover:via-teal-500 hover:to-blue-500 hover:shadow-xl hover:shadow-emerald-500/30': variant === 'gradient',
            'active:from-emerald-600 active:via-teal-700 active:to-blue-700': variant === 'gradient',
            
            // Glassmorphic variant - Pure glass effect
            'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 shadow-xl': variant === 'glassmorphic',
            'hover:bg-white/20 hover:border-white/30 hover:shadow-2xl': variant === 'glassmorphic',
            'active:bg-white/5 active:scale-95': variant === 'glassmorphic',
            'dark:text-white dark:border-white/10 dark:hover:border-white/20': variant === 'glassmorphic',
            
            // Destructive - Enhanced red gradient
            'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25': variant === 'destructive',
            'hover:from-red-400 hover:to-red-500 hover:shadow-xl hover:shadow-red-500/30': variant === 'destructive',
            'active:from-red-600 active:to-red-700': variant === 'destructive',
            
            // Outline - Modern border with subtle effects
            'border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm': variant === 'outline',
            'hover:border-gray-400 hover:bg-gray-50/90 hover:shadow-md': variant === 'outline',
            'active:bg-gray-100/90 active:border-gray-500': variant === 'outline',
            'dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200': variant === 'outline',
            'dark:hover:border-gray-500 dark:hover:bg-gray-700/90': variant === 'outline',
            
            // Secondary - Soft gradient
            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm': variant === 'secondary',
            'hover:from-gray-50 hover:to-gray-100 hover:shadow-md': variant === 'secondary',
            'active:from-gray-200 active:to-gray-300': variant === 'secondary',
            'dark:from-gray-800 dark:to-gray-700 dark:text-gray-100': variant === 'secondary',
            'dark:hover:from-gray-700 dark:hover:to-gray-600': variant === 'secondary',
            
            // Ghost - Minimal with hover effects
            'bg-transparent text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm': variant === 'ghost',
            'active:bg-gray-200/80': variant === 'ghost',
            'dark:text-gray-300 dark:hover:bg-gray-800/80 dark:active:bg-gray-700/80': variant === 'ghost',
            
            // Link - Clean underline animation
            'bg-transparent text-indigo-600 underline-offset-4 decoration-2 decoration-transparent': variant === 'link',
            'hover:decoration-indigo-600 hover:text-indigo-700': variant === 'link',
            'active:text-indigo-800': variant === 'link',
            'transition-colors duration-200': variant === 'link',
            'dark:text-indigo-400 dark:hover:text-indigo-300': variant === 'link',
          },
          
          // Enhanced size variants
          {
            'h-10 px-4 py-2 text-sm gap-2': size === 'default',
            'h-8 px-3 py-1.5 text-xs gap-1.5': size === 'xs',
            'h-9 px-3 py-2 text-sm gap-1.5': size === 'sm', 
            'h-12 px-6 py-3 text-base gap-2.5': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          
          // Loading state
          {
            'cursor-wait': isLoading,
            'pointer-events-none': isLoading,
          },
          
          // Pressed state
          {
            'scale-95': isPressed && !disabled && !isLoading,
          },
          
          className
        )}
        disabled={disabled || isLoading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 flex items-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"></div>
          </div>
        )}
        
        {isLoading ? (loadingText || children) : children}
        
        {/* Subtle gradient overlay for enhanced depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
