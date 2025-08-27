const mongoose = require('mongoose');
const Character = require('../models/Character');
require('dotenv').config();

// 甲骨文字符种子数据
const characterSeeds = [
  {
    oracleForm: '人', // 使用现代字作为占位符，实际项目中应替换为图片
    modernForm: '人',
    pronunciation: 'rén',
    meaning: '人类，指具有思维能力的高等生物',
    etymology: '甲骨文的\"人\"字像一个侧身而立的人形，突出了人的直立行走特征。整个字形生动地展现了人的基本轮廓。',
    imageUrl: '/images/oracle/人.png',
    strokeOrder: ['丿', '乀'],
    difficulty: 1,
    category: '人物',
    historicalContext: '\"人\"字是甲骨文中最基本的字之一，反映了古代先民对人类本质特征的认识。在商代，这个字已经被广泛使用。',
    tags: ['基础', '常用', '象形']
  },
  {
    oracleForm: '大', // 修改无法显示的Unicode字符
    modernForm: '大',
    pronunciation: 'dà',
    meaning: '体积、面积、数量、强度等方面超过一般或超过所比较的对象',
    etymology: '甲骨文的\"大\"字像一个人张开双臂双腿站立的样子，表示人的最大形态，引申为大的概念。',
    imageUrl: '/images/oracle/大.png',
    strokeOrder: ['一', '丿', '乀'],
    difficulty: 1,
    category: '抽象概念',
    historicalContext: '\"大\"字在甲骨文中经常与\"小\"字相对使用，体现了古代先民的对比思维。',
    tags: ['基础', '形容词', '象形']
  },
  {
    oracleForm: '女', // 修改无法显示的Unicode字符
    modernForm: '女',
    pronunciation: 'nǚ',
    meaning: '成年的雌性人类',
    etymology: '甲骨文的\"女\"字像一个跪坐的女性形象，双手交叉在胸前，体现了古代女性的典型姿态。',
    imageUrl: '/images/oracle/女.png',
    strokeOrder: ['フ', '一', 'フ'],
    difficulty: 1,
    category: '人物',
    historicalContext: '在商代社会，女性在家庭和宗教活动中扮演重要角色，这在甲骨文的使用中有所体现。',
    tags: ['基础', '性别', '象形']
  },
  {
    oracleForm: '子', // 修改无法显示的Unicode字符
    modernForm: '子',
    pronunciation: 'zǐ',
    meaning: '儿子；孩子；种子',
    etymology: '甲骨文的\"子\"字像一个婴儿的形象，头大身小，双臂展开，生动地表现了幼儿的特征。',
    imageUrl: '/images/oracle/子.png',
    strokeOrder: ['一', '丨', '一'],
    difficulty: 1,
    category: '人物',
    historicalContext: '\"子\"字在商代既指代子女，也是对男性的尊称，体现了血缘关系的重要性。',
    tags: ['基础', '家庭', '象形']
  },
  {
    oracleForm: '王',
    modernForm: '王',
    pronunciation: 'wáng',
    meaning: '古代统治者的称号；现指君主',
    etymology: '甲骨文的\"王\"字像一把斧头，象征着权力和武力，是统治者身份的象征。',
    imageUrl: '/images/oracle/王.png',
    strokeOrder: ['一', '一', '丨', '一'],
    difficulty: 2,
    category: '人物',
    historicalContext: '在商代，王是最高统治者，拥有政治、军事和宗教的最高权威。',
    tags: ['权力', '政治', '象形']
  },
  {
    oracleForm: '马',
    modernForm: '马',
    pronunciation: 'mǎ',
    meaning: '一种家畜，用于骑乘、驮载或拉车',
    etymology: '甲骨文的\"马\"字生动地描绘了马的侧面形象，包括马头、鬃毛、身体和四条腿的特征。',
    imageUrl: '/images/oracle/马.png',
    strokeOrder: ['フ', '一', '丨', 'フ'],
    difficulty: 2,
    category: '动物',
    historicalContext: '马在商代是重要的军事和交通工具，也是财富和地位的象征。',
    tags: ['动物', '交通', '象形']
  },
  {
    oracleForm: '牛',
    modernForm: '牛',
    pronunciation: 'niú',
    meaning: '一种大型家畜，用于耕作和食用',
    etymology: '甲骨文的\"牛\"字像牛的正面形象，突出了牛的两个角和面部特征。',
    imageUrl: '/images/oracle/牛.png',
    strokeOrder: ['丿', '一', '丨', '一'],
    difficulty: 2,
    category: '动物',
    historicalContext: '牛在商代农业中占有重要地位，也是重要的祭祀用品。',
    tags: ['动物', '农业', '象形']
  },
  {
    oracleForm: '羊',
    modernForm: '羊',
    pronunciation: 'yáng',
    meaning: '一种家畜，毛可纺织，肉可食用',
    etymology: '甲骨文的\"羊\"字突出了羊的角和温顺的特征，是典型的象形文字。',
    imageUrl: '/images/oracle/羊.png',
    strokeOrder: ['丷', '一', '丨', '一'],
    difficulty: 2,
    category: '动物',
    historicalContext: '羊在商代是重要的牲畜，经常用于祭祀活动。',
    tags: ['动物', '祭祀', '象形']
  },
  {
    oracleForm: '水',
    modernForm: '水',
    pronunciation: 'shuǐ',
    meaning: '无色无味的液体，生命之源',
    etymology: '甲骨文的\"水\"字像流动的水流，中间一竖代表主流，两边的点代表水滴。',
    imageUrl: '/images/oracle/水.png',
    strokeOrder: ['丨', '丿', '丶', '乀'],
    difficulty: 2,
    category: '自然',
    historicalContext: '水在古代文明中具有重要意义，商代人已经认识到水的重要性。',
    tags: ['自然', '元素', '象形']
  },
  {
    oracleForm: '火',
    modernForm: '火',
    pronunciation: 'huǒ',
    meaning: '燃烧现象，产生光和热',
    etymology: '甲骨文的\"火\"字像燃烧的火焰形状，生动地表现了火的动态特征。',
    imageUrl: '/images/oracle/火.png',
    strokeOrder: ['丶', '丿', '丿', '乀'],
    difficulty: 2,
    category: '自然',
    historicalContext: '火的发现和使用是人类文明的重要标志，在商代已被广泛应用。',
    tags: ['自然', '元素', '象形']
  },
  {
    oracleForm: '土',
    modernForm: '土',
    pronunciation: 'tǔ',
    meaning: '地球表面的泥沙混合物；土地',
    etymology: '甲骨文的\"土\"字像一个土堆的形状，或者是神位的象征。',
    imageUrl: '/images/oracle/土.png',
    strokeOrder: ['一', '丨', '一'],
    difficulty: 1,
    category: '自然',
    historicalContext: '土地在农业社会中具有根本意义，是财富和权力的基础。',
    tags: ['自然', '农业', '象形']
  },
  {
    oracleForm: '山',
    modernForm: '山',
    pronunciation: 'shān',
    meaning: '地面上由土石构成的高耸部分',
    etymology: '甲骨文的\"山\"字像山峰的轮廓，三个突起代表连绵的山峰。',
    imageUrl: '/images/oracle/山.png',
    strokeOrder: ['丨', 'フ', 'フ', 'フ'],
    difficulty: 2,
    category: '自然',
    historicalContext: '山在中国古代被视为神圣之地，是祭祀和修行的场所。',
    tags: ['自然', '地形', '象形']
  },
  {
    oracleForm: '日', // 修改无法显示的Unicode字符
    modernForm: '日',
    pronunciation: 'rì',
    meaning: '太阳；一昼夜；日子',
    etymology: '甲骨文的\"日\"字像太阳的形状，圆形中间有一点，代表太阳的光芒。',
    imageUrl: '/images/oracle/日.png',
    strokeOrder: ['丨', '一', '一', '一'],
    difficulty: 1,
    category: '自然',
    historicalContext: '太阳崇拜在商代十分盛行，日字在甲骨文中使用频繁。',
    tags: ['自然', '天体', '象形']
  },
  {
    oracleForm: '月',
    modernForm: '月',
    pronunciation: 'yuè',
    meaning: '地球的天然卫星；月份',
    etymology: '甲骨文的\"月\"字像月牙的形状，弯弯的弧形很好地表现了月亮的特征。',
    imageUrl: '/images/oracle/月.png',
    strokeOrder: ['丿', '一', '一', 'フ'],
    difficulty: 1,
    category: '自然',
    historicalContext: '月亮在古代历法和农业活动中起重要作用，商代已有成熟的月历系统。',
    tags: ['自然', '天体', '象形']
  },
  {
    oracleForm: '木',
    modernForm: '木',
    pronunciation: 'mù',
    meaning: '树木；木材',
    etymology: '甲骨文的\"木\"字像一棵树的形状，有根、树干和树冠，是典型的象形字。',
    imageUrl: '/images/oracle/木.png',
    strokeOrder: ['一', '丨', '丿', '乀'],
    difficulty: 1,
    category: '植物',
    historicalContext: '木材在古代建筑和工具制作中不可或缺，是重要的天然资源。',
    tags: ['植物', '材料', '象形']
  }
];

// 连接数据库并插入种子数据
const seedCharacters = async () => {
  try {
    // 连接MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiaguwen_learning';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ 已连接到MongoDB');
    
    // 清空现有数据（可选）
    const existingCount = await Character.countDocuments();
    console.log(`📊 当前数据库中有 ${existingCount} 个字符`);
    
    if (existingCount === 0) {
      // 插入种子数据
      console.log('🌱 开始插入字符种子数据...');
      
      const insertedCharacters = await Character.insertMany(characterSeeds);
      console.log(`✅ 成功插入 ${insertedCharacters.length} 个字符`);
      
      // 创建一些关联关系
      const allCharacters = await Character.find();
      
      // 为一些字符添加相关字符
      const personChar = allCharacters.find(c => c.modernForm === '人');
      const womanChar = allCharacters.find(c => c.modernForm === '女');
      const childChar = allCharacters.find(c => c.modernForm === '子');
      const kingChar = allCharacters.find(c => c.modernForm === '王');
      
      if (personChar && womanChar && childChar) {
        personChar.relatedCharacters = [womanChar._id, childChar._id];
        await personChar.save();
        
        womanChar.relatedCharacters = [personChar._id, childChar._id];
        await womanChar.save();
        
        childChar.relatedCharacters = [personChar._id, womanChar._id];
        await childChar.save();
      }
      
      if (kingChar && personChar) {
        kingChar.relatedCharacters = [personChar._id];
        await kingChar.save();
      }
      
      // 为自然元素建立关联
      const waterChar = allCharacters.find(c => c.modernForm === '水');
      const fireChar = allCharacters.find(c => c.modernForm === '火');
      const earthChar = allCharacters.find(c => c.modernForm === '土');
      const woodChar = allCharacters.find(c => c.modernForm === '木');
      
      if (waterChar && fireChar && earthChar && woodChar) {
        waterChar.relatedCharacters = [fireChar._id, earthChar._id];
        await waterChar.save();
        
        fireChar.relatedCharacters = [waterChar._id, woodChar._id];
        await fireChar.save();
        
        earthChar.relatedCharacters = [waterChar._id, woodChar._id];
        await earthChar.save();
        
        woodChar.relatedCharacters = [fireChar._id, earthChar._id];
        await woodChar.save();
      }
      
      console.log('🔗 字符关联关系建立完成');
    } else {
      console.log('ℹ️  数据库中已有字符数据，跳过种子数据插入');
    }
    
    // 显示统计信息
    const finalCount = await Character.countDocuments();
    const categories = await Character.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 数据库统计信息:');
    console.log(`总字符数: ${finalCount}`);
    console.log('分类统计:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count}个`);
    });
    
  } catch (error) {
    console.error('❌ 种子数据插入失败:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('\n👋 数据库连接已关闭');
    process.exit(0);
  }
};

// 执行种子数据插入
if (require.main === module) {
  seedCharacters();
}

module.exports = { characterSeeds, seedCharacters };