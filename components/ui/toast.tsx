'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={clsx(
      'fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-2 p-5 pr-8 shadow-2xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-lg',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white/95 text-gray-900 dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-100',
        destructive:
          'border-red-200 bg-gradient-to-r from-red-50/95 to-red-100/95 text-red-900 dark:border-red-800 dark:from-red-950/95 dark:to-red-900/95 dark:text-red-100',
        success: 'border-emerald-200 bg-gradient-to-r from-emerald-50/95 to-green-50/95 text-emerald-900 dark:border-emerald-800 dark:from-emerald-950/95 dark:to-emerald-900/95 dark:text-emerald-100',
        warning: 'border-amber-200 bg-gradient-to-r from-amber-50/95 to-yellow-50/95 text-amber-900 dark:border-amber-800 dark:from-amber-950/95 dark:to-amber-900/95 dark:text-amber-100',
        info: 'border-blue-200 bg-gradient-to-r from-blue-50/95 to-indigo-50/95 text-blue-900 dark:border-blue-800 dark:from-blue-950/95 dark:to-blue-900/95 dark:text-blue-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={clsx(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={clsx(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={clsx(
      'absolute right-3 top-3 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={clsx('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={clsx('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Enhanced Toast Data Interface
interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  duration?: number;
}

// Enhanced Toast Hook
export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback(
    ({ duration = 5000, ...toastData }: Omit<ToastData, 'id'> & { duration?: number }) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toastData, id };
      
      setToasts((prevToasts) => [...prevToasts, newToast]);
      
      // Auto remove after specified duration
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toastId));
  }, []);

  // Convenience methods with enhanced icons
  const success = React.useCallback(
    (title: string, description?: string) => {
      return toast({
        variant: 'success',
        title,
        description,
        icon: <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
        duration: 5000,
      });
    },
    [toast]
  );

  const error = React.useCallback(
    (title: string, description?: string) => {
      return toast({
        variant: 'destructive',
        title,
        description,
        icon: <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />,
        duration: 7000,
      });
    },
    [toast]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => {
      return toast({
        variant: 'warning',
        title,
        description,
        icon: <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
        duration: 6000,
      });
    },
    [toast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => {
      return toast({
        variant: 'info',
        title,
        description,
        icon: <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
        duration: 5000,
      });
    },
    [toast]
  );

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
  };
}

// Enhanced Toast Consumer Component
export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, icon, title, description, variant }) => (
        <Toast key={id} variant={variant} className="transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-start gap-4 flex-1">
            {icon && (
              <div className="flex-shrink-0 mt-0.5 p-1 rounded-lg bg-white/50 dark:bg-black/20">
                {icon}
              </div>
            )}
            <div className="grid gap-1 flex-1">
              {title && (
                <ToastTitle className="font-semibold text-lg">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm leading-relaxed">{description}</ToastDescription>
              )}
            </div>
          </div>
          <ToastClose onClick={() => dismiss(id)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export {
  type ToastData,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}; 