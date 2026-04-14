/**
 * Loading Spinner Component
 * Display while loading data
 */

function LoadingSpinner({ text = 'Loading...', size = 'md' }) {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
  }[size];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="text-secondary mt-3">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
