const supabase = require('../config/supabase');

const getLeads = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Lead name is required' });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          user_id: req.user.id,
          name,
          email: email || null,
          phone: phone || null,
          company: company || null,
          status: status || 'new',
          source: source || 'website',
          notes: notes || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    delete updates.id;
    delete updates.user_id;

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('leads').delete().eq('id', id).eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeads, createLead, updateLead, deleteLead };
