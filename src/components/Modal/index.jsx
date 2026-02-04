import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  children, 
  closeOnClickOutside = true,
  closeOnEscape = true,
  footer = null, 
  hideCloseButton = false, 
  isOpen, 
  onClose, 
  title 
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Prevent scrolling when modal is open and manage focus
  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousFocusRef.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
      
      // Restore focus to previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !hideCloseButton && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, hideCloseButton, closeOnEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnClickOutside) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" 
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          {!hideCloseButton && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
        
        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
