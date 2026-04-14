/**
 * Modal Component
 * Dialog box for forms and confirmations
 */

import { useEffect } from 'react';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-width: 400px',
    md: 'max-width: 500px',
    lg: 'max-width: 700px',
    xl: 'max-width: 900px',
  }[size];

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" style={{ ...sizeClass ? { maxWidth: sizeClass.split(':')[1].trim() } : {} }}>
        {/* Modal Header */}
        <div className="modal-header">
          <h5 className="m-0">{title}</h5>
          {closeButton && (
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body">{children}</div>

        {/* Modal Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
