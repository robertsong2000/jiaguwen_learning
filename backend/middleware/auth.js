const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，请提供有效的访问令牌'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，令牌不能为空'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 验证用户是否存在且处于活跃状态
      const user = await User.findById(decoded.userId).select('-passwordHash -refreshTokens');
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: '用户不存在或已被禁用'
        });
      }

      req.user = user;
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: '访问令牌已过期，请重新登录',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: '无效的访问令牌'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 可选认证中间件（用户可能已登录也可能未登录）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // 继续执行，但不设置用户信息
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-passwordHash -refreshTokens');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = decoded.userId;
      }
    } catch (jwtError) {
      // 忽略JWT错误，继续执行
      console.log('可选认证失败:', jwtError.message);
    }
    
    next();
  } catch (error) {
    console.error('可选认证中间件错误:', error);
    next(); // 即使出错也继续执行
  }
};

// 角色验证中间件
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '需要登录才能访问此资源'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足，无法访问此资源'
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuth,
  requireRole
};