/**
 * Empty State Component
 * Display when no data is available
 */

import { FiInbox } from 'react-icons/fi';

function EmptyState({ 
  title = 'No data found', 
  description = 'There is nothing to display here',
  icon = <FiInbox size={64} />,
  action,
}) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-8 text-center">
      <div className="text-secondary mb-4" style={{ fontSize: '64px' }}>
        {icon}
      </div>
      <h5 className="text-primary mb-2">{title}</h5>
      <p className="text-secondary mb-4" style={{ maxWidth: '400px' }}>
        {description}
      </p>
      {action && action}
    </div>
  );
}

export default EmptyState;
