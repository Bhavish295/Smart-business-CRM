const supabase = require('../config/supabase');

const getReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const [leadsRes, clientsRes, followUpsRes] = await Promise.all([
      supabase.from('leads').select('id, status, created_at').eq('user_id', userId),
      supabase.from('clients').select('id, created_at').eq('user_id', userId),
      supabase.from('follow_ups').select('id, status').eq('user_id', userId),
    ]);

    const leads = leadsRes.data || [];
    const clients = clientsRes.data || [];
    const followUps = followUpsRes.data || [];

    const leadsByStatus = [
      { name: 'New', value: leads.filter((l) => l.status === 'new').length, status: 'new' },
      { name: 'Contacted', value: leads.filter((l) => l.status === 'contacted').length, status: 'contacted' },
      { name: 'Qualified', value: leads.filter((l) => l.status === 'qualified').length, status: 'qualified' },
      { name: 'Won', value: leads.filter((l) => l.status === 'won').length, status: 'won' },
      { name: 'Lost', value: leads.filter((l) => l.status === 'lost').length, status: 'lost' },
    ];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyLeads = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = leads.filter((l) => {
        const created = new Date(l.created_at);
        return created.getMonth() === month && created.getFullYear() === year;
      }).length;
      monthlyLeads.push({ month: monthNames[month], leads: count, clients: 0 });
    }

    clients.forEach((c) => {
      const created = new Date(c.created_at);
      const label = monthNames[created.getMonth()];
      const entry = monthlyLeads.find((m) => m.month === label);
      if (entry) entry.clients += 1;
    });

    const totalLeads = leads.length;
    const wonLeads = leads.filter((l) => l.status === 'won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalLeads,
          totalClients: clients.length,
          totalFollowUps: followUps.length,
          completedFollowUps: followUps.filter((f) => f.status === 'completed').length,
          conversionRate,
        },
        leadsByStatus,
        monthlyTrend: monthlyLeads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReports };
