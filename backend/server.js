require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leadRoutes = require('./routes/leadRoutes');
const clientRoutes = require('./routes/clientRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Business CRM API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/follow-ups', followUpRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
