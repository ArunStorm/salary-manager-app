/**
 * Card Component
 * Wrapper for content with border, shadow, and padding
 */

function Card({ children, className = '', header, footer, onClick, variant = 'default' }) {
  return (
    <div className={`card ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

export default Card;
