const supabase = require('./supabase');

const connectDB = async () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_URL.includes('your-project')) {
    console.warn('Supabase not configured — add credentials to backend/.env');
    return;
  }

  const { error } = await supabase.from('users').select('id').limit(1);

  if (error && error.code !== 'PGRST116') {
    console.warn('Supabase connection check failed:', error.message);
    return;
  }

  console.log('Supabase (PostgreSQL) connected');
};

module.exports = connectDB;
