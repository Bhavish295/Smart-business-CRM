const supabase = require('../config/supabase');

const getClients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Client name is required' });
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([{
        user_id: req.user.id,
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        status: status || 'active',
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.id;
    delete updates.user_id;

    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const convertLeadToClient = async (req, res) => {
  try {
    const { leadId } = req.params;

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', req.user.id)
      .single();

    if (leadError || !lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert([{
        user_id: req.user.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: 'active',
      }])
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('leads')
      .update({ status: 'won', updated_at: new Date().toISOString() })
      .eq('id', leadId);

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getClients, createClient, updateClient, deleteClient, convertLeadToClient };
