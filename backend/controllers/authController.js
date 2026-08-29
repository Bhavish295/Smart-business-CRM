const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();

    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role: 'admin' }])
      .select('id, name, email, role, created_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: {
        user,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password, role, created_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      data: {
        user: safeUser,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { registerUser, loginUser, getMe };
