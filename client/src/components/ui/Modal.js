import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

const Modal = ({
  isOpen = false,
  onClose,
  children,
  title,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose?.();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        
        // Restore focus to previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleCloseClick = () => {
    onClose?.();
  };

  if (!isOpen) return null;

  const modalClasses = [
    'modal',
    `modal-${size}`,
    `modal-${variant}`,
    className
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    'modal-overlay',
    overlayClassName
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'modal-content',
    contentClassName
  ].filter(Boolean).join(' ');

  return createPortal(
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        {...props}
      >
        <div className={contentClasses}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && (
                <h2 id="modal-title" className="modal-title">
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <button
                  className="modal-close-button"
                  onClick={handleCloseClick}
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="modal-body">
            {children}
          </div>
          
          {/* Glassmorphism background elements */}
          <div className="modal-glass-bg"></div>
          <div className="modal-border-glow"></div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Close Icon Component
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Modal sub-components for better composition
export const ModalHeader = ({ children, className = '', ...props }) => (
  <div className={`modal-header ${className}`} {...props}>
    {children}
  </div>
);

export const ModalBody = ({ children, className = '', ...props }) => (
  <div className={`modal-body ${className}`} {...props}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className = '', ...props }) => (
  <div className={`modal-footer ${className}`} {...props}>
    {children}
  </div>
);

export default Modal;
