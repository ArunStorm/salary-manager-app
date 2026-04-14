/**
 * Badge Component
 * Status badge with colored variants
 */

function Badge({ children, variant = 'primary', className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

export default Badge;
