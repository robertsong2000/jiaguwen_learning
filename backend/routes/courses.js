const express = require('express');
const router = express.Router();

// 获取课程列表
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: '课程功能开发中...',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取课程详情
router.get('/:id', async (req, res) => {
  try {
    res.json({
      success: true,
      message: '课程详情功能开发中...',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;