
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env'); // Load validated config

const app = express();
const PORT = config.port;

// Security & Utility Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin // Use config for CORS
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api', apiLimiter);

// Routes
const authController = require('./controllers/authController');
const authRouter = express.Router();
authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/generate-otp', authController.generateOtp);
authRouter.post('/login-otp', authController.loginOtp);
// New Security Routes
authRouter.get('/sessions', authController.getSessions); // Added
authRouter.delete('/sessions/:id', authController.revokeSession); // Added
authRouter.post('/delete-account', authController.requestDeletion); // Added

app.use('/api/auth', authRouter);
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes')); 
app.use('/api/ai', require('./routes/aiRoutes')); 
app.use('/api/quiz', require('./routes/quizRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/parent', require('./routes/parentRoutes'));

// Root
app.get('/', (req, res) => {
  res.json({ status: 'Online', system: 'LMS Backend', env: config.env });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.env} mode`);
});
