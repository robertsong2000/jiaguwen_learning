const express = require('express');
const router = express.Router();

// 获取练习题目
router.get('/:type', async (req, res) => {
  try {
    res.json({
      success: true,
      message: '练习功能开发中...',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 提交练习答案
router.post('/submit', async (req, res) => {
  try {
    res.json({
      success: true,
      message: '练习提交功能开发中...',
      data: { score: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;