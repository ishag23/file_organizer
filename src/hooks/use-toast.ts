
import { useState, useEffect } from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

type Toast = ToastProps & {
  id: string;
}

// Simple toast implementation
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast
  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...props };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss
    if (props.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, props.duration || 3000);
    }

    return id;
  };

  // Dismiss a toast
  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    toast,
    dismiss,
    toasts
  };
};

// For direct usage
export const toast = (props: ToastProps) => {
  // This is a simplified version - in a real app, this would connect to a context
  console.log('Toast:', props.title, props.description);
  
  // Return a placeholder id
  return 'toast-' + Math.random().toString(36).substring(2, 9);
};
