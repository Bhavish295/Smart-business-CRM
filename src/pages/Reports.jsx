import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, Users, UserCheck, Target } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { CHART_COLORS } from '../utils/constants';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/reports')
      .then((res) => {
        if (res.data.success) setData(res.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading reports..." />;

  if (error) {
    return (
      <div className="page">
        <div className="alert error">{error}</div>
      </div>
    );
  }

  const { summary, leadsByStatus, monthlyTrend } = data;
  const pieData = leadsByStatus.filter((d) => d.value > 0);

  const summaryCards = [
    { label: 'Total Leads', value: summary.totalLeads, icon: Users, color: 'card-indigo' },
    { label: 'Total Clients', value: summary.totalClients, icon: UserCheck, color: 'card-green' },
    { label: 'Conversion Rate', value: `${summary.conversionRate}%`, icon: Target, color: 'card-violet' },
    { label: 'Follow-ups Done', value: summary.completedFollowUps, icon: TrendingUp, color: 'card-amber' },
  ];

  return (
    <div className="page">
      <PageHeader title="Reports" description="Business analytics and performance insights" />

      <div className="stats-grid">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div className="stat-icon"><Icon size={22} /></div>
            <div>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <h3>Leads by Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-text">No lead data to display</p>
          )}
        </div>

        <div className="panel chart-panel">
          <h3>Monthly Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#6366f1" name="Leads" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clients" fill="#22c55e" name="Clients" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
