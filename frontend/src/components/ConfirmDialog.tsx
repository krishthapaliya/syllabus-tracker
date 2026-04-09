'use client';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, title = "Confirm Action", message, onConfirm, onCancel }: Props) {
  return (
    <Modal id="confirm" title={title} icon="fa-exclamation-triangle" isOpen={isOpen} onClose={onCancel} size="sm">
      <p className="text-content-muted text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-3 pt-4 border-t border-boundary-subtle">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-sm font-semibold transition">
          <i className="fas fa-check mr-2" />Confirm
        </button>
      </div>
    </Modal>
  );
}
