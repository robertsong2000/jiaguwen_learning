const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 生成JWT令牌
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// 用户注册
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少需要6个字符'),
  body('displayName')
    .isLength({ min: 1, max: 50 })
    .withMessage('显示名称长度必须在1-50个字符之间')
    .trim()
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { username, email, password, displayName } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      isActive: true
    });

    if (existingUser) {
      const field = existingUser.email === email ? '邮箱' : '用户名';
      return res.status(400).json({
        success: false,
        message: `${field}已被注册`
      });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      passwordHash: password, // 会在模型的pre-save钩子中被加密
      profile: {
        displayName
      }
    });

    await user.save();

    // 生成令牌
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // 保存refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7天后过期
    await user.addRefreshToken(refreshToken, refreshExpiry);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile
        },
        progress: user.learningProgress,
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登录
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 查找用户（包含密码字段）
    const user = await User.findOne({ email, isActive: true }).select('+passwordHash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 更新最后登录时间
    await user.updateLastLogin();

    // 生成令牌
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // 保存refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await user.addRefreshToken(refreshToken, refreshExpiry);

    // 移除密码字段
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile
        },
        progress: user.learningProgress,
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 刷新令牌
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: '刷新令牌不能为空'
      });
    }

    // 验证refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: '无效的刷新令牌'
      });
    }

    // 查找用户并验证refresh token
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    const validToken = user.refreshTokens.find(
      rt => rt.token === refreshToken && rt.expiresAt > new Date()
    );

    if (!validToken) {
      return res.status(401).json({
        success: false,
        message: '刷新令牌无效或已过期'
      });
    }

    // 生成新的访问令牌
    const { accessToken } = generateTokens(user._id);

    res.json({
      success: true,
      message: '令牌刷新成功',
      data: {
        token: accessToken
      }
    });
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取用户信息
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('learningProgress.studiedCharacters.character', 'modernForm oracleForm')
      .populate('achievements.achievement')
      .populate('favorites', 'modernForm oracleForm imageUrl')
      .populate('bookmarks', 'modernForm oracleForm imageUrl');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        profile: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences,
          statistics: user.statistics,
          createdAt: user.createdAt
        },
        progress: user.learningProgress,
        achievements: user.achievements,
        favorites: user.favorites,
        bookmarks: user.bookmarks
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 退出登录
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      const user = await User.findById(req.userId);
      if (user) {
        await user.removeRefreshToken(refreshToken);
      }
    }

    res.json({
      success: true,
      message: '退出登录成功'
    });
  } catch (error) {
    console.error('退出登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;