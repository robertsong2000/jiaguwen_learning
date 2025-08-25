const mongoose = require('mongoose');
const { Course, Lesson } = require('../models/Course');
const Character = require('../models/Character');
require('dotenv').config();

// 课程种子数据
const courseSeeds = [
  {
    title: '甲骨文入门基础',
    description: '从零开始学习甲骨文，了解最基本的字符和书写规律，适合初学者入门。',
    difficulty: 1,
    estimatedHours: 8,
    instructor: {
      name: '张教授',
      bio: '考古学博士，专注甲骨文研究20年',
      avatar: 'https://example.com/avatars/zhang.jpg'
    },
    tags: ['入门', '基础', '象形字'],
    isPublished: true
  },
  {
    title: '人物类甲骨文详解',
    description: '深入学习与人物相关的甲骨文字符，包括人、女、子、王等重要字符的演变和含义。',
    difficulty: 2,
    estimatedHours: 12,
    instructor: {
      name: '李研究员',
      bio: '中科院历史研究所研究员，古文字学专家',
      avatar: 'https://example.com/avatars/li.jpg'
    },
    tags: ['人物', '社会', '象形字'],
    isPublished: true
  },
  {
    title: '自然万物的甲骨文表达',
    description: '学习表示自然现象和动植物的甲骨文字符，理解古人对自然界的认知。',
    difficulty: 3,
    estimatedHours: 15,
    instructor: {
      name: '王老师',
      bio: '北京大学考古文博学院教授',
      avatar: 'https://example.com/avatars/wang.jpg'
    },
    tags: ['自然', '动物', '植物'],
    isPublished: true
  },
  {
    title: '甲骨文书写与实践',
    description: '通过实际书写练习，掌握甲骨文的笔画规律和书写技巧。',
    difficulty: 4,
    estimatedHours: 20,
    instructor: {
      name: '陈大师',
      bio: '著名书法家，甲骨文书写专家',
      avatar: 'https://example.com/avatars/chen.jpg'
    },
    tags: ['书写', '实践', '技巧'],
    isPublished: false
  }
];

// 课时种子数据生成函数
const generateLessonSeeds = (courses, characters) => {
  const lessonSeeds = [];
  
  // 为每个课程生成课时
  courses.forEach((course, courseIndex) => {
    switch (courseIndex) {
      case 0: // 甲骨文入门基础
        lessonSeeds.push(
          {
            title: '甲骨文的起源与发现',
            description: '了解甲骨文的历史背景和考古发现过程',
            courseId: course._id,
            order: 1,
            content: {
              explanation: '甲骨文是迄今为止中国发现的年代最早的成熟文字系统，主要发现于河南安阳殷墟。这些文字刻在龟甲和兽骨上，记录了商代的占卜活动和社会生活。甲骨文的发现对于研究中国古代历史和汉字发展具有重要意义。',
              examples: [
                '殷墟甲骨文的发现始于1899年',
                '目前已发现甲骨文字符约4000多个',
                '其中约1500个字符得到确认和释读'
              ],
              culturalNote: '甲骨文反映了商代社会的政治、军事、宗教、农业等各个方面，是研究商代历史的珍贵资料。',
              characters: []
            },
            exercises: [
              {
                type: 'choice',
                question: '甲骨文主要发现于哪个地方？',
                options: ['河南安阳', '陕西西安', '山东曲阜', '河北邯郸'],
                correctAnswer: '河南安阳',
                explanation: '甲骨文主要发现于河南安阳的殷墟遗址',
                points: 10
              }
            ],
            estimatedTime: 30,
            difficulty: 1,
            isPublished: true
          },
          {
            title: '认识基本象形字',
            description: '学习最基础的象形字符，理解甲骨文造字原理',
            courseId: course._id,
            order: 2,
            content: {
              explanation: '象形字是甲骨文的重要组成部分，通过模拟物体的形状来表达意思。这些字符直观易懂，是学习甲骨文的基础。我们将学习几个最基本的象形字。',
              examples: [
                '\"人\"字像一个侧身站立的人形',
                '\"日\"字像太阳的圆形',
                '\"月\"字像弯弯的月牙'
              ],
              culturalNote: '象形字体现了古人观察自然、模拟形象的智慧，是汉字发展的重要基础。',
              characters: [] // 将在种子数据插入时填充
            },
            exercises: [
              {
                type: 'recognition',
                question: '这个甲骨文字符「𠂇」代表什么意思？',
                options: ['人', '大', '王', '子'],
                correctAnswer: '人',
                explanation: '这个字符像一个侧身站立的人形，表示\"人\"',
                points: 15
              }
            ],
            estimatedTime: 45,
            difficulty: 1,
            isPublished: true
          }
        );
        break;
        
      case 1: // 人物类甲骨文详解
        lessonSeeds.push(
          {
            title: '人物等级与社会关系',
            description: '学习表示不同社会等级和人物关系的甲骨文字符',
            courseId: course._id,
            order: 1,
            content: {
              explanation: '商代社会等级分明，甲骨文中有许多字符反映了不同的社会等级和人际关系。从\"人\"、\"王\"到\"子\"、\"女\"，每个字符都承载着丰富的社会信息。',
              examples: [
                '\"王\"字象征最高统治者',
                '\"人\"字表示一般民众',
                '\"子\"字既指子女，也是对男性的尊称'
              ],
              culturalNote: '这些字符反映了商代严格的社会等级制度和血缘关系的重要性。',
              characters: [] // 将在种子数据插入时填充
            },
            exercises: [
              {
                type: 'meaning',
                question: '在商代社会中，\"王\"字代表什么？',
                options: ['普通民众', '最高统治者', '工匠', '农民'],
                correctAnswer: '最高统治者',
                explanation: '\"王\"字在商代表示拥有最高权力的统治者',
                points: 20
              }
            ],
            estimatedTime: 60,
            difficulty: 2,
            isPublished: true
          }
        );
        break;
        
      case 2: // 自然万物的甲骨文表达
        lessonSeeds.push(
          {
            title: '天体与自然现象',
            description: '学习表示日月星辰和自然现象的甲骨文字符',
            courseId: course._id,
            order: 1,
            content: {
              explanation: '古代先民对天体和自然现象有着敏锐的观察和深刻的理解，这在甲骨文中得到了充分体现。日、月、水、火等字符形象生动，展现了古人的智慧。',
              examples: [
                '\"日\"字圆形中有一点，表示太阳',
                '\"月\"字弯曲如月牙',
                '\"水\"字像流动的水流'
              ],
              culturalNote: '这些字符反映了古代先民对自然规律的认识和对自然的崇敬。',
              characters: [] // 将在种子数据插入时填充
            },
            exercises: [
              {
                type: 'writing',
                question: '请写出表示\"太阳\"的甲骨文字符',
                options: [],
                correctAnswer: '𣄼',
                explanation: '甲骨文的\"日\"字像太阳的形状',
                points: 25
              }
            ],
            estimatedTime: 50,
            difficulty: 2,
            isPublished: true
          },
          {
            title: '动物世界的甲骨文',
            description: '探索表示各种动物的甲骨文字符及其文化含义',
            courseId: course._id,
            order: 2,
            content: {
              explanation: '商代人与各种动物关系密切，无论是家畜还是野生动物，都在甲骨文中有生动的表现。这些字符不仅形象逼真，还反映了动物在古代社会中的重要作用。',
              examples: [
                '\"马\"字展现了马的侧面形象',
                '\"牛\"字突出了牛的两个角',
                '\"羊\"字体现了羊的温顺特征'
              ],
              culturalNote: '这些动物字符反映了商代的畜牧业发展和动物在祭祀、军事中的重要地位。',
              characters: [] // 将在种子数据插入时填充
            },
            exercises: [
              {
                type: 'recognition',
                question: '这个甲骨文字符「𠃬」代表哪种动物？',
                options: ['牛', '马', '羊', '猪'],
                correctAnswer: '马',
                explanation: '这个字符生动地描绘了马的侧面形象',
                points: 20
              }
            ],
            estimatedTime: 55,
            difficulty: 3,
            isPublished: true
          }
        );
        break;
    }
  });
  
  return lessonSeeds;
};

// 种子数据插入函数
const seedCoursesAndLessons = async () => {
  try {
    // 连接MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jiaguwen_learning';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ 已连接到MongoDB');
    
    // 检查是否已有课程数据
    const existingCourseCount = await Course.countDocuments();
    console.log(`📊 当前数据库中有 ${existingCourseCount} 个课程`);
    
    if (existingCourseCount === 0) {
      console.log('🌱 开始插入课程种子数据...');
      
      // 插入课程
      const insertedCourses = await Course.insertMany(courseSeeds);
      console.log(`✅ 成功插入 ${insertedCourses.length} 个课程`);
      
      // 获取字符数据（用于关联）
      const characters = await Character.find().limit(10); // 获取前10个字符用于演示
      
      // 生成课时数据
      const lessonSeeds = generateLessonSeeds(insertedCourses, characters);
      
      // 为课时分配字符
      lessonSeeds.forEach(lesson => {
        if (lesson.title.includes('象形字') || lesson.title.includes('基本')) {
          // 基础课时分配简单字符
          lesson.content.characters = characters
            .filter(c => ['人', '日', '月', '水'].includes(c.modernForm))
            .map(c => c._id);
        } else if (lesson.title.includes('人物')) {
          // 人物课时分配人物相关字符
          lesson.content.characters = characters
            .filter(c => ['人', '女', '子', '王'].includes(c.modernForm))
            .map(c => c._id);
        } else if (lesson.title.includes('天体') || lesson.title.includes('自然')) {
          // 自然课时分配自然相关字符
          lesson.content.characters = characters
            .filter(c => ['日', '月', '水', '火', '土', '山'].includes(c.modernForm))
            .map(c => c._id);
        } else if (lesson.title.includes('动物')) {
          // 动物课时分配动物相关字符
          lesson.content.characters = characters
            .filter(c => ['马', '牛', '羊'].includes(c.modernForm))
            .map(c => c._id);
        }
      });
      
      // 插入课时
      const insertedLessons = await Lesson.insertMany(lessonSeeds);
      console.log(`✅ 成功插入 ${insertedLessons.length} 个课时`);
      
      // 更新课程的lessons字段
      for (const course of insertedCourses) {
        const courseLessons = insertedLessons.filter(
          lesson => lesson.courseId.toString() === course._id.toString()
        );
        course.lessons = courseLessons.map(lesson => lesson._id);
        await course.save();
      }
      
      console.log('🔗 课程与课时关联关系建立完成');
      
      // 模拟一些统计数据
      for (const course of insertedCourses) {
        course.enrollmentCount = Math.floor(Math.random() * 1000) + 100;
        course.completionCount = Math.floor(course.enrollmentCount * 0.7);
        course.rating.average = (Math.random() * 2 + 3).toFixed(1); // 3-5分
        course.rating.count = Math.floor(course.enrollmentCount * 0.3);
        await course.save();
      }
      
      console.log('📈 统计数据模拟完成');
      
    } else {
      console.log('ℹ️  数据库中已有课程数据，跳过种子数据插入');
    }
    
    // 显示统计信息
    const finalCourseCount = await Course.countDocuments();
    const finalLessonCount = await Lesson.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    
    console.log('\n📈 数据库统计信息:');
    console.log(`总课程数: ${finalCourseCount}`);
    console.log(`已发布课程: ${publishedCourses}`);
    console.log(`总课时数: ${finalLessonCount}`);
    
    // 显示每个课程的详细信息
    const courses = await Course.find().populate('lessons');
    console.log('\n📚 课程详细信息:');
    courses.forEach(course => {
      console.log(`${course.title} - ${course.lessons.length}个课时 - 难度${course.difficulty}级`);
    });
    
  } catch (error) {
    console.error('❌ 课程种子数据插入失败:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('\n👋 数据库连接已关闭');
    process.exit(0);
  }
};

// 执行种子数据插入
if (require.main === module) {
  seedCoursesAndLessons();
}

module.exports = { courseSeeds, seedCoursesAndLessons };