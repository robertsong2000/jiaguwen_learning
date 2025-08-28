const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Character = require('../models/Character');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 搜索字符 - 必须在 /:id 路由之前
router.get('/search', [
  query('q').isLength({ min: 1, max: 50 }).withMessage('搜索词长度必须在1-50个字符之间'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('结果数量必须在1-20之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { q: query, limit = 10 } = req.query;

    // 简单的模糊搜索，因为还没有设置MongoDB文本索引
    const searchRegex = new RegExp(query, 'i');
    const characters = await Character.find({
      $or: [
        { modernForm: searchRegex },
        { meaning: searchRegex },
        { category: searchRegex }
      ],
      isActive: true
    })
    .limit(parseInt(limit))
    .select('modernForm oracleForm meaning imageUrl hasImage imageAlt category difficulty')
    .lean();

    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    console.error('搜索字符错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取字符分类列表
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Character.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取热门字符
router.get('/meta/popular', [
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('数量必须在1-20之间')
], async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const characters = await Character.find({ isActive: true })
      .sort({ favoriteCount: -1, viewCount: -1 })
      .limit(parseInt(limit))
      .select('modernForm oracleForm meaning imageUrl hasImage imageAlt category difficulty favoriteCount')
      .lean();

    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    console.error('获取热门字符错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取字符列表
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('category').optional().isLength({ min: 1, max: 20 }).withMessage('分类名称长度必须在1-20个字符之间'),
  query('difficulty').optional().isInt({ min: 1, max: 5 }).withMessage('难度等级必须在1-5之间')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { 
      page = 1, 
      limit = 20, 
      category, 
      difficulty,
      sort = 'createdAt'
    } = req.query;

    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (difficulty) {
      filter.difficulty = parseInt(difficulty);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sortOptions = {};
    sortOptions[sort] = -1;

    const [characters, totalCount] = await Promise.all([
      Character.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select('modernForm oracleForm meaning imageUrl hasImage imageAlt category difficulty favoriteCount')
        .lean(),
      Character.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        characters,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('获取字符列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取字符详情
router.get('/:id', [
  param('id').isMongoId().withMessage('无效的字符ID')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const character = await Character.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('relatedCharacters', 'modernForm oracleForm imageUrl hasImage imageAlt meaning category')
    .lean();

    if (!character) {
      return res.status(404).json({
        success: false,
        message: '字符不存在'
      });
    }

    // 增加查看次数
    await Character.findByIdAndUpdate(req.params.id, {
      $inc: { viewCount: 1 }
    });

    // 如果用户已登录，添加收藏和书签状态
    if (req.user) {
      const favoriteIds = req.user.favorites.map(id => id.toString());
      const bookmarkIds = req.user.bookmarks.map(id => id.toString());
      
      character.isFavorited = favoriteIds.includes(character._id.toString());
      character.isBookmarked = bookmarkIds.includes(character._id.toString());
    }

    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    console.error('获取字符详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 收藏字符
router.post('/favorite', [
  body('characterId').isMongoId().withMessage('无效的字符ID')
], authMiddleware, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { characterId } = req.body;

    const character = await Character.findOne({ 
      _id: characterId, 
      isActive: true 
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: '字符不存在'
      });
    }

    const user = req.user;
    const isAlreadyFavorited = user.favorites.includes(characterId);

    if (isAlreadyFavorited) {
      return res.status(400).json({
        success: false,
        message: '已经收藏过该字符'
      });
    }

    user.favorites.push(characterId);
    await user.save();

    res.json({
      success: true,
      message: '收藏成功'
    });
  } catch (error) {
    console.error('收藏字符错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;