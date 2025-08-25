const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 基本中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: '甲骨文学习API服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// 基本API路由
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '后端服务运行正常'
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 简化服务器运行在端口 ${PORT}`);
  console.log(`📖 测试地址: http://localhost:${PORT}/health`);
});

module.exports = app;