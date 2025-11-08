'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  closable?: boolean;
}

export interface ToastContextValue {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast Component
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    id, 
    title, 
    description, 
    variant = 'default', 
    duration = 5000,
    onClose,
    action,
    closable = true,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration]);

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 150);
    };

    if (!isVisible) return null;

    const variantStyles = {
      default: {
        background: 'bg-white dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-700',
        icon: '📢',
        iconColor: 'text-blue-500'
      },
      success: {
        background: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: '✅',
        iconColor: 'text-emerald-500'
      },
      error: {
        background: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: '❌',
        iconColor: 'text-red-500'
      },
      warning: {
        background: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        icon: '⚠️',
        iconColor: 'text-amber-500'
      },
      info: {
        background: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'ℹ️',
        iconColor: 'text-blue-500'
      }
    };

    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative flex items-start gap-3 p-4 rounded-xl border shadow-lg',
          'backdrop-blur-xl transform transition-all duration-300 ease-out',
          'min-w-[320px] max-w-md pointer-events-auto',
          
          // Background and border
          styles.background,
          styles.border,
          
          // Animation states
          {
            'translate-x-0 opacity-100 scale-100': isVisible && !isExiting,
            'translate-x-full opacity-0 scale-95': isExiting,
          }
        )}
        {...props}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-lg" role="img" aria-hidden="true">
            {styles.icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h4>
          )}
          
          {description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}

          {/* Action button */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'mt-2 text-sm font-medium underline-offset-2 hover:underline',
                'transition-colors duration-200',
                styles.iconColor
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {closable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Cerrar notificación"
          >
            <svg
              className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Progress bar for duration */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-xl overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all ease-linear',
                styles.iconColor.replace('text-', 'bg-')
              )}
              style={{
                width: '100%',
                animation: `toast-progress ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// Toast Container Component
export const ToastContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3 pointer-events-none">
      <div className="flex flex-col space-y-3">
        {children}
      </div>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    clearToasts
  }), [toasts, addToast, removeToast, clearToasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      <ToastContainer>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id!)}
          />
        ))}
      </ToastContainer>
      
      {/* CSS Animation for progress bar */}
      <style jsx global>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Utility functions for common toast types
export const toast = {
  success: (title: string, description?: string, options?: Partial<ToastProps>) => ({
    title,
    description,
    variant: 'success' as const,
    ...options
  }),
  
  error: (title: string, description?: string, options?: Partial<ToastProps>) => ({
    title,
    description,
    variant: 'error' as const,
    duration: 7000, // Longer for errors
    ...options
  }),
  
  warning: (title: string, description?: string, options?: Partial<ToastProps>) => ({
    title,
    description,
    variant: 'warning' as const,
    duration: 6000,
    ...options
  }),
  
  info: (title: string, description?: string, options?: Partial<ToastProps>) => ({
    title,
    description,
    variant: 'info' as const,
    ...options
  }),
  
  custom: (options: Omit<ToastProps, 'id'>) => options
};

export { Toast };