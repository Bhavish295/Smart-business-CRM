const supabase = require('../config/supabase');

const getEmployees = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, department, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Employee name is required' });
    }

    const { data, error } = await supabase
      .from('employees')
      .insert([{
        user_id: req.user.id,
        name,
        email: email || null,
        phone: phone || null,
        role: role || 'sales',
        department: department || null,
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

const updateEmployee = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.user_id;

    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };
