const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dashboardRoutes = require('./routes/dashboard');
const studentRoutes = require('./routes/students');
const noticeRoutes = require('./routes/notices');
const feesRoutes = require('./routes/fees');
const attendRoutes = require('./routes/attendance');

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/attendance', attendRoutes);

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/journal', require('./routes/journalRoutes'));
// app.use('/api/bot', require('./routes/botRoutes'));
// app.use('/api/token', require('./routes/notificationRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
