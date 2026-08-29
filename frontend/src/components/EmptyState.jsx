import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data yet', description, action }) => (
  <div className="empty-state">
    <div className="empty-icon">
      <Inbox size={40} strokeWidth={1.5} />
    </div>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
