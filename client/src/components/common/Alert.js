/**
 * Alert Component
 * Display alerts (success, error, warning, info)
 */

import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

function Alert({ type = 'info', title, message, onClose, dismissible = true }) {
  const icons = {
    success: <FiCheckCircle />,
    danger: <FiAlertCircle />,
    warning: <FiAlertCircle />,
    info: <FiInfo />,
  };

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="d-flex align-items-start gap-3">
        <div className="flex-shrink-0 mt-1">{icons[type]}</div>
        <div className="flex-grow-1">
          {title && <h6 className="mb-1">{title}</h6>}
          {message && <p className="mb-0">{message}</p>}
        </div>
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          />
        )}
      </div>
    </div>
  );
}

export default Alert;
