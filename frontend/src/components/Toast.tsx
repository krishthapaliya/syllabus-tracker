'use client';
import { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    if (onClose) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [onClose]);

  const config = {
    success: { icon: 'fa-check-circle', color: 'text-green-500' },
    error:   { icon: 'fa-exclamation-circle', color: 'text-red-500' },
    info:    { icon: 'fa-info-circle', color: 'text-brand-500' },
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 bg-surface-card border border-boundary-strong rounded-xl shadow-2xl animate-slide-right min-w-[220px]">
      <i className={`fas ${config.icon} ${config.color} text-lg`} />
      <span className="text-sm font-medium text-content-main">{message}</span>
    </div>
  );
}
