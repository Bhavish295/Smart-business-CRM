const supabase = require('../config/supabase');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [leadsRes, clientsRes, followUpsRes, recentLeadsRes] = await Promise.all([
      supabase.from('leads').select('id, status', { count: 'exact' }).eq('user_id', userId),
      supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('follow_ups').select('id, status', { count: 'exact' }).eq('user_id', userId),
      supabase
        .from('leads')
        .select('id, name, email, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const leads = leadsRes.data || [];
    const followUps = followUpsRes.data || [];

    const stats = {
      totalLeads: leadsRes.count ?? leads.length,
      totalClients: clientsRes.count ?? 0,
      totalFollowUps: followUpsRes.count ?? followUps.length,
      pendingFollowUps: followUps.filter((f) => f.status === 'pending').length,
      leadsByStatus: {
        new: leads.filter((l) => l.status === 'new').length,
        contacted: leads.filter((l) => l.status === 'contacted').length,
        qualified: leads.filter((l) => l.status === 'qualified').length,
        won: leads.filter((l) => l.status === 'won').length,
        lost: leads.filter((l) => l.status === 'lost').length,
      },
      recentLeads: recentLeadsRes.data || [],
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
