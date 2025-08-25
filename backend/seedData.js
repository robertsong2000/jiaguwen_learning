const mongoose = require('mongoose');
require('dotenv').config();

// 导入Character模型
const Character = require('./models/Character');

const testCharacters = [
  {
    modernForm: '人',
    oracleForm: '𠤎',
    pronunciation: 'rén',
    meaning: '人类，人',
    etymology: '象形字，像一个人的侧面形状，头部、身体、双腿清晰可见',
    imageUrl: 'https://example.com/images/characters/ren.png',
    strokeOrder: ['丿', '乀'],
    difficulty: 1,
    category: '人物',
    relatedCharacters: [],
    historicalContext: '甲骨文中最基本的字符之一，表示人类个体',
    tags: ['基础字', '象形字', '人体'],
    viewCount: 1250,
    favoriteCount: 89,
    isActive: true
  },
  {
    modernForm: '水',
    oracleForm: '𣎴',
    pronunciation: 'shuǐ',
    meaning: '水，液体',
    etymology: '象形字，像水流的形状，中间一条主流，两边有水滴',
    imageUrl: 'https://example.com/images/characters/shui.png',
    strokeOrder: ['丨', '㇈', '丨', '乀'],
    difficulty: 2,
    category: '自然',
    relatedCharacters: [],
    historicalContext: '表示自然界的水，是生命之源',
    tags: ['自然', '象形字', '元素'],
    viewCount: 980,
    favoriteCount: 67,
    isActive: true
  },
  {
    modernForm: '日',
    oracleForm: '𠄵',
    pronunciation: 'rì',
    meaning: '太阳，日子',
    etymology: '象形字，像太阳的圆形，中间有一点表示太阳黑子',
    imageUrl: 'https://example.com/images/characters/ri.png',
    strokeOrder: ['丨', '㇕', '一', '丨'],
    difficulty: 1,
    category: '自然',
    relatedCharacters: [],
    historicalContext: '表示太阳，是时间和光明的象征',
    tags: ['天体', '象形字', '时间'],
    viewCount: 1560,
    favoriteCount: 112,
    isActive: true
  },
  {
    modernForm: '月',
    oracleForm: '𠕎',
    pronunciation: 'yuè',
    meaning: '月亮，月份',
    etymology: '象形字，像弯月的形状',
    imageUrl: 'https://example.com/images/characters/yue.png',
    strokeOrder: ['丿', '㇆', '一', '一'],
    difficulty: 1,
    category: '自然',
    relatedCharacters: [],
    historicalContext: '表示月亮，用于纪年纪月',
    tags: ['天体', '象形字', '时间'],
    viewCount: 1340,
    favoriteCount: 95,
    isActive: true
  },
  {
    modernForm: '山',
    oracleForm: '𡷿',
    pronunciation: 'shān',
    meaning: '山，山峰',
    etymology: '象形字，像山峰的形状，三个尖峰',
    imageUrl: 'https://example.com/images/characters/shan.png',
    strokeOrder: ['丨', '㇈', '丨'],
    difficulty: 1,
    category: '自然',
    relatedCharacters: [],
    historicalContext: '表示山川地貌，是地理的重要概念',
    tags: ['地形', '象形字', '自然'],
    viewCount: 890,
    favoriteCount: 54,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // 连接数据库
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiaguwen_learning';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 清空现有字符数据（可选）
    await Character.deleteMany({});
    console.log('🗑️ 清空现有数据');

    // 插入测试数据
    await Character.insertMany(testCharacters);
    console.log('✅ 测试数据插入成功');
    
    // 查询验证
    const count = await Character.countDocuments();
    console.log(`📊 数据库中共有 ${count} 个字符`);

    // 关闭连接
    await mongoose.connection.close();
    console.log('🔌 数据库连接已关闭');

  } catch (error) {
    console.error('❌ 数据库操作失败:', error);
    process.exit(1);
  }
}

seedDatabase();