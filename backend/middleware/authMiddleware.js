const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
