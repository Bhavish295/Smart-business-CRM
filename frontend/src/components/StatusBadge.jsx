const STATUS_STYLES = {
  new: 'badge-indigo',
  contacted: 'badge-amber',
  qualified: 'badge-violet',
  won: 'badge-green',
  lost: 'badge-red',
  active: 'badge-green',
  inactive: 'badge-gray',
  pending: 'badge-amber',
  completed: 'badge-green',
  cancelled: 'badge-red',
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_STYLES[status] || 'badge-gray'}`}>{status}</span>
);

export default StatusBadge;
