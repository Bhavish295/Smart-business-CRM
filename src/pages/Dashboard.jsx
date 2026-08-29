import { useEffect, useState } from 'react';
import { Users, UserCheck, CalendarClock, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { CHART_COLORS } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => { if (res.data.success) setStats(res.data.data); })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading dashboard..." />;

  if (error) {
    return (
      <div className="page">
        <div className="alert error">{error}</div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'card-indigo', link: '/leads' },
    { label: 'Total Clients', value: stats.totalClients, icon: UserCheck, color: 'card-green', link: '/clients' },
    { label: 'Follow-ups', value: stats.totalFollowUps, icon: CalendarClock, color: 'card-violet', link: '/follow-ups' },
    { label: 'Pending Tasks', value: stats.pendingFollowUps, icon: TrendingUp, color: 'card-amber', link: '/follow-ups' },
  ];

  const pieData = Object.entries(stats.leadsByStatus || {})
    .map(([status, value]) => ({ name: status, value }))
    .filter((d) => d.value > 0);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page">
      <div className="welcome-banner">
        <div className="welcome-text">
          <Sparkles size={20} />
          <div>
            <h2>Hello, {user?.name?.split(' ')[0] || 'there'}!</h2>
            <p>{today} — Here&apos;s your business overview</p>
          </div>
        </div>
        <Link to="/leads" className="btn btn-primary btn-sm">+ New Lead</Link>
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className={`stat-card stat-card-link ${color}`}>
            <div className="stat-icon"><Icon size={22} /></div>
            <div className="stat-content">
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value ?? 0}</p>
            </div>
            <ArrowUpRight size={16} className="stat-arrow" />
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <h3>Lead Pipeline</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-text">No leads yet</p>
          )}
          <div className="status-list compact">
            {Object.entries(stats.leadsByStatus || {}).map(([status, count]) => (
              <div key={status} className="status-row">
                <StatusBadge status={status} />
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header-row">
            <h3>Recent Leads</h3>
            <Link to="/leads" className="link-sm">View all</Link>
          </div>
          {stats.recentLeads?.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td><strong>{lead.name}</strong></td>
                      <td>{lead.email || '—'}</td>
                      <td><StatusBadge status={lead.status} /></td>
                      <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-text">No leads yet. <Link to="/leads">Add your first lead</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
