const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const charactersRoutes = require('./routes/characters');
const coursesRoutes = require('./routes/courses');
const lessonsRoutes = require('./routes/lessons');
const practiceRoutes = require('./routes/practice');
const userRoutes = require('./routes/users');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const progressTracker = require('./middleware/progressTracker');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Progress tracking middleware
// app.use(progressTracker);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: '甲骨文学习API服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiaguwen_learning';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB连接成功');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📖 API文档: http://localhost:${PORT}/health`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB连接失败:', error.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  mongoose.connection.close(() => {
    console.log('MongoDB连接已关闭');
    process.exit(0);
  });
});

module.exports = app;