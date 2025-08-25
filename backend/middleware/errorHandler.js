const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 记录错误到控制台
  console.error('错误详情:', err);

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      statusCode: 400,
      message: message.join(', ')
    };
  }

  // Mongoose 重复字段错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    let message = '该数据已存在';
    
    if (field === 'email') {
      message = `邮箱 ${value} 已被注册`;
    } else if (field === 'username') {
      message = `用户名 ${value} 已被使用`;
    }
    
    error = {
      statusCode: 400,
      message
    };
  }

  // Mongoose 类型转换错误
  if (err.name === 'CastError') {
    const message = '无效的资源ID';
    error = {
      statusCode: 400,
      message
    };
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的访问令牌';
    error = {
      statusCode: 401,
      message
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = '访问令牌已过期';
    error = {
      statusCode: 401,
      message
    };
  }

  // 文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = '文件大小超出限制';
    error = {
      statusCode: 400,
      message
    };
  }

  // 网络连接错误
  if (err.code === 'ECONNREFUSED') {
    const message = '数据库连接失败';
    error = {
      statusCode: 500,
      message
    };
  }

  // 权限错误
  if (err.name === 'UnauthorizedError') {
    const message = '未授权访问';
    error = {
      statusCode: 401,
      message
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    }
  });
};

module.exports = errorHandler;