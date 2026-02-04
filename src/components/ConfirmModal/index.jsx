import { AlertTriangle } from 'lucide-react';
import Modal from '../Modal';

const ConfirmModal = ({ 
  confirmText = 'Delete', 
  hideCloseButton = false, 
  isDestructive = true, 
  isOpen, 
  message, 
  onClose, 
  onConfirm, 
  title 
}) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} hideCloseButton={hideCloseButton}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}
          aria-hidden="true"
        >
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <p 
            id="confirm-message" 
            className="text-gray-600 leading-relaxed"
          >
            {message}
          </p>
        </div>
        <div className="flex gap-3 w-full pt-2" role="group" aria-label="Confirmation actions">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Cancel action"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all active:scale-[0.98] ${
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100' 
                : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-100'
            }`}
            aria-label={`Confirm: ${confirmText}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
