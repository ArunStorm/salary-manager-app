/**
 * Avatar Component
 * Display user avatar or initials
 */

function Avatar({ name, email, src, size = 'md', className = '' }) {
  const sizeClass = {
    sm: 'width: 32px; height: 32px; font-size: 12px;',
    md: 'width: 48px; height: 48px; font-size: 16px;',
    lg: 'width: 64px; height: 64px; font-size: 20px;',
  }[size];

  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const colors = [
    '#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'
  ];
  const colorIndex = name?.charCodeAt(0) % colors.length || 0;
  const bgColor = colors[colorIndex];

  return (
    <div
      title={name && email ? `${name} (${email})` : name}
      style={{
        ...{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: bgColor,
          color: 'white',
          fontWeight: 'bold',
          flexShrink: 0,
        },
        ...sizeClass ? Object.fromEntries(sizeClass.split(';').filter(s => s.trim()).map(s => s.split(':').map(x => x.trim()))) : {},
      }}
      className={className}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
    </div>
  );
}

export default Avatar;
