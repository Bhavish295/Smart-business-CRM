const supabase = require('../config/supabase');

const getFollowUps = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, leads(name, email)')
      .eq('user_id', req.user.id)
      .order('due_date', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFollowUp = async (req, res) => {
  try {
    const { title, notes, due_date, lead_id, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('follow_ups')
      .insert([{
        user_id: req.user.id,
        title,
        notes: notes || null,
        due_date: due_date || null,
        lead_id: lead_id || null,
        status: status || 'pending',
      }])
      .select('*, leads(name, email)')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFollowUp = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.user_id;

    const { data, error } = await supabase
      .from('follow_ups')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('*, leads(name, email)')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Follow-up not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFollowUp = async (req, res) => {
  try {
    const { error } = await supabase
      .from('follow_ups')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true, message: 'Follow-up deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFollowUps, createFollowUp, updateFollowUp, deleteFollowUp };
