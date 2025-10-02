import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "" 
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Sauvegarder les styles originaux
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalLeft = document.body.style.left;
      const originalRight = document.body.style.right;
      const originalWidth = document.body.style.width;
      
      // Appliquer les styles pour bloquer le scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      
      // Focus management
      modalRef.current?.focus();
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        // Restaurer les styles originaux
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.left = originalLeft;
        document.body.style.right = originalRight;
        document.body.style.width = originalWidth;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={`
          relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] 
          flex flex-col overflow-hidden transform transition-all duration-300 ease-out
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl sm:rounded-t-2xl flex-shrink-0">
            <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-gray-900 pr-4 truncate">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition-all duration-200 text-xl sm:text-2xl font-light flex-shrink-0"
              aria-label="Fermer la modal"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
