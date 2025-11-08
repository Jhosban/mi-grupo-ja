'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, icon, rightIcon, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-label font-medium transition-all duration-200",
              "mb-2 text-gray-700 dark:text-gray-300",
              {
                "text-indigo-600 dark:text-indigo-400": isFocused && !error,
                "text-red-600 dark:text-red-400": error,
                "text-emerald-600 dark:text-emerald-400": success,
              }
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
              "text-gray-400",
              {
                "text-indigo-500": isFocused && !error,
                "text-red-500": error,
                "text-emerald-500": success,
              }
            )}>
              {icon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              // Base styles with enhanced visual design
              "flex h-11 w-full rounded-xl border bg-white/80 backdrop-blur-sm",
              "px-4 py-3 text-body transition-all duration-200 ease-out",
              "placeholder:text-gray-500 placeholder:transition-colors",
              "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              
              // Enhanced border and focus states
              "border-gray-200 hover:border-gray-300",
              "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
              "focus:bg-white focus:shadow-lg focus:shadow-indigo-500/5",
              "transform hover:scale-[1.01] focus:scale-[1.01]",
              
              // Dark mode enhancements
              "dark:bg-gray-800/80 dark:border-gray-600 dark:text-white",
              "dark:hover:border-gray-500 dark:focus:border-indigo-400",
              "dark:focus:ring-indigo-400/10 dark:focus:bg-gray-800",
              "dark:placeholder:text-gray-400",

              // Icon spacing
              {
                "pl-10": icon,
                "pr-10": rightIcon,
              },

              // State-specific styles
              {
                "border-red-300 bg-red-50/50 dark:border-red-500 dark:bg-red-900/10": error,
                "hover:border-red-400 focus:border-red-500 focus:ring-red-500/10": error,
                "focus:shadow-red-500/5": error,
                
                "border-emerald-300 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-900/10": success,
                "hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10": success,
                "focus:shadow-emerald-500/5": success,
              },

              className
            )}
            style={style}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
              "text-gray-400",
              {
                "text-indigo-500": isFocused && !error,
                "text-red-500": error,
                "text-emerald-500": success,
              }
            )}>
              {rightIcon}
            </div>
          )}

          {/* Animated focus ring */}
          <div className={cn(
            "absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none",
            "ring-0 ring-indigo-500/0",
            {
              "ring-2 ring-indigo-500/20": isFocused && !error,
              "ring-2 ring-red-500/20": isFocused && error,
              "ring-2 ring-emerald-500/20": isFocused && success,
            }
          )} />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 animate-fade-in-out">
            <svg
              className="h-4 w-4 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-body-small text-red-600 dark:text-red-400">
              {error}
            </span>
          </div>
        )}

        {/* Success message */}
        {success && !error && (
          <div className="mt-1.5 flex items-center gap-1.5 animate-fade-in-out">
            <svg
              className="h-4 w-4 text-emerald-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-body-small text-emerald-600 dark:text-emerald-400">
              Campo completado correctamente
            </span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
