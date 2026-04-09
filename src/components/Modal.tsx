import { ReactNode } from 'react';

interface ModalProps {
  id: string;
  title: string;
  icon?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ id, title, icon, isOpen, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby={id} role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className={`relative w-full ${sizeClasses[size]} bg-surface-card border border-boundary-strong rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-boundary-subtle flex-shrink-0 bg-surface-body">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-surface-input border border-boundary-subtle flex items-center justify-center text-brand-500 shadow-sm">
                <i className={`fas ${icon} text-sm`} />
              </div>
            )}
            <h2 id={id} className="text-lg font-bold text-content-main tracking-tight">
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-content-muted hover:text-content-main hover:bg-surface-input transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
