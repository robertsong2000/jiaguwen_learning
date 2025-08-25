const mongoose = require('mongoose');
const { seedCharacters } = require('./characters');
const { seedCoursesAndLessons } = require('./courses');
require('dotenv').config();

// 主种子数据执行函数
const runAllSeeds = async () => {
  try {
    console.log('🚀 开始执行所有种子数据插入...');
    console.log('=' .repeat(50));
    
    // 连接数据库
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiaguwen_learning';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ 数据库连接成功');
    
    // 1. 插入字符数据
    console.log('\n📝 步骤 1: 插入甲骨文字符数据');
    console.log('-'.repeat(30));
    await seedCharacters();
    
    // 重新连接数据库（因为字符种子脚本会关闭连接）
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // 2. 插入课程和课时数据
    console.log('\n📚 步骤 2: 插入课程和课时数据');
    console.log('-'.repeat(30));
    await seedCoursesAndLessons();
    
    // 重新连接以显示最终统计
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // 显示最终统计信息
    console.log('\n📊 最终数据库统计');
    console.log('=' .repeat(50));
    
    const Character = require('../models/Character');
    const { Course, Lesson } = require('../models/Course');
    
    const characterCount = await Character.countDocuments();
    const courseCount = await Course.countDocuments();
    const lessonCount = await Lesson.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    
    console.log(`📝 甲骨文字符: ${characterCount} 个`);
    console.log(`📚 课程总数: ${courseCount} 个`);
    console.log(`📖 已发布课程: ${publishedCourses} 个`);
    console.log(`📄 课时总数: ${lessonCount} 个`);
    
    // 分类统计
    const categoryStats = await Character.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 字符分类统计:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} 个`);
    });
    
    // 难度统计
    const difficultyStats = await Character.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 字符难度统计:');
    difficultyStats.forEach(stat => {
      console.log(`  难度 ${stat._id}: ${stat.count} 个`);
    });
    
    console.log('\n🎉 所有种子数据插入完成！');
    console.log('\n💡 提示:');
    console.log('  - 可以启动后端服务器: npm run dev');
    console.log('  - 可以通过API访问数据: http://localhost:5000/api/characters');
    console.log('  - 健康检查: http://localhost:5000/health');
    
  } catch (error) {
    console.error('❌ 种子数据插入过程中出现错误:', error);
    console.error('\n详细错误信息:');
    console.error(error.stack);
  } finally {
    // 关闭数据库连接
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n👋 数据库连接已关闭');
    }
    process.exit(0);
  }
};

// 清空数据库函数（危险操作，仅用于开发）
const clearDatabase = async () => {
  try {
    console.log('⚠️  警告: 即将清空数据库!');
    console.log('此操作将删除所有数据，仅用于开发环境!');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiaguwen_learning';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const Character = require('../models/Character');
    const { Course, Lesson } = require('../models/Course');
    const User = require('../models/User');
    
    await Character.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await User.deleteMany({});
    
    console.log('🗑️  数据库已清空');
    
  } catch (error) {
    console.error('❌ 清空数据库失败:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
};

// 命令行参数处理
const args = process.argv.slice(2);

if (args.includes('--clear')) {
  console.log('🗑️  执行数据库清空操作...');
  clearDatabase();
} else if (args.includes('--characters-only')) {
  console.log('📝 仅插入字符数据...');
  seedCharacters();
} else if (args.includes('--courses-only')) {
  console.log('📚 仅插入课程数据...');
  seedCoursesAndLessons();
} else {
  // 默认执行所有种子数据
  runAllSeeds();
}

module.exports = {
  runAllSeeds,
  clearDatabase
};