const User = require('../models/User');

const progressTracker = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // 异步处理学习行为记录，不阻塞响应
    setImmediate(async () => {
      try {
        if (!req.user || !req.user._id) {
          return;
        }

        const userId = req.user._id;
        const method = req.method;
        const path = req.path;
        
        // 记录练习活动
        if (path.includes('/practice') && method === 'POST') {
          await trackPracticeActivity(userId, req.body);
        }
        
        // 记录课程学习
        if (path.includes('/lessons') && method === 'GET') {
          await trackLessonView(userId, req.params.id);
        }
        
        // 记录字符查看
        if (path.includes('/characters') && method === 'GET' && req.params.id) {
          await trackCharacterView(userId, req.params.id);
        }
        
        // 记录学习时间
        if (isLearningActivity(path, method)) {
          await updateStudyTime(userId);
        }
        
      } catch (error) {
        console.error('学习进度追踪错误:', error);
      }
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

// 追踪练习活动
async function trackPracticeActivity(userId, practiceData) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 更新练习统计
    user.statistics.practiceCount += 1;
    
    // 如果有分数信息，更新平均分数
    if (practiceData.score !== undefined) {
      const currentAvg = user.statistics.averageScore || 0;
      const count = user.statistics.practiceCount;
      user.statistics.averageScore = (currentAvg * (count - 1) + practiceData.score) / count;
    }
    
    // 添加经验值
    await user.addExperience(10); // 每次练习获得10经验
    
    // 更新连续学习天数
    await user.updateStreak();
    
    await user.save();
  } catch (error) {
    console.error('追踪练习活动失败:', error);
  }
}

// 追踪课程学习
async function trackLessonView(userId, lessonId) {
  try {
    if (!lessonId) return;
    
    const user = await User.findById(userId);
    if (!user) return;
    
    // 添加经验值
    await user.addExperience(5); // 每次查看课程获得5经验
    
    // 更新连续学习天数
    await user.updateStreak();
    
    await user.save();
  } catch (error) {
    console.error('追踪课程学习失败:', error);
  }
}

// 追踪字符查看
async function trackCharacterView(userId, characterId) {
  try {
    if (!characterId) return;
    
    const user = await User.findById(userId);
    if (!user) return;
    
    // 添加到学习过的字符中（如果还没有）
    const hasStudied = user.learningProgress.studiedCharacters.some(
      sc => sc.character.toString() === characterId
    );
    
    if (!hasStudied) {
      await user.addStudiedCharacter(characterId, 10); // 初始掌握度10%
      await user.addExperience(2); // 查看新字符获得2经验
    }
    
    await user.save();
  } catch (error) {
    console.error('追踪字符查看失败:', error);
  }
}

// 更新学习时间
async function updateStudyTime(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    // 每次学习活动增加1分钟学习时间（简化计算）
    user.statistics.totalStudyTime += 1;
    
    await user.save();
  } catch (error) {
    console.error('更新学习时间失败:', error);
  }
}

// 判断是否为学习活动
function isLearningActivity(path, method) {
  const learningPaths = [
    '/characters',
    '/lessons',
    '/practice',
    '/courses'
  ];
  
  return learningPaths.some(lp => path.includes(lp)) && 
         ['GET', 'POST'].includes(method);
}

module.exports = progressTracker;