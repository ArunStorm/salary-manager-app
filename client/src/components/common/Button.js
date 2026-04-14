/**
 * Button Component
 * Styled button with variants and loading state
 */

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
}) {
  const baseClass = `btn btn-${variant} btn-${size}`;
  const classes = `${baseClass} ${fullWidth ? 'btn-block' : ''} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
