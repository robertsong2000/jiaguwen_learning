const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符'],
    match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  passwordHash: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符']
  },
  profile: {
    displayName: {
      type: String,
      required: [true, '显示名称不能为空'],
      trim: true,
      maxlength: [50, '显示名称最多50个字符']
    },
    avatar: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || v.startsWith('http');
        },
        message: '头像URL格式不正确'
      }
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [200, '个人简介最多200个字符']
    },
    studyGoal: {
      type: String,
      enum: ['入门了解', '系统学习', '深入研究', '学术研究'],
      default: '入门了解'
    }
  },
  learningProgress: {
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    studiedCharacters: [{
      character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character'
      },
      masteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      lastStudied: {
        type: Date,
        default: Date.now
      }
    }],
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastStudyDate: {
      type: Date
    }
  },
  achievements: [{
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  preferences: {
    studyReminder: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '提醒时间格式不正确'],
      default: '20:00'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive'
    },
    practiceMode: {
      type: String,
      enum: ['recognition', 'writing', 'meaning', 'mixed'],
      default: 'mixed'
    },
    language: {
      type: String,
      enum: ['zh-CN', 'zh-TW', 'en'],
      default: 'zh-CN'
    }
  },
  statistics: {
    totalStudyTime: {
      type: Number,
      default: 0,
      min: 0
    },
    practiceCount: {
      type: Number,
      default: 0,
      min: 0
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    strongCategories: [String],
    weakCategories: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'teacher', 'admin'],
    default: 'user'
  },
  lastLoginAt: {
    type: Date
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.refreshTokens;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// 创建其他索引
UserSchema.index({ 'learningProgress.level': 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ role: 1 });

// 虚拟字段
UserSchema.virtual('studiedCharacterCount').get(function() {
  return this.learningProgress.studiedCharacters.length;
});

UserSchema.virtual('completedLessonCount').get(function() {
  return this.learningProgress.completedLessons.length;
});

UserSchema.virtual('achievementCount').get(function() {
  return this.achievements.length;
});

// 实例方法
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

UserSchema.methods.addStudiedCharacter = function(characterId, masteryLevel = 0) {
  const existingIndex = this.learningProgress.studiedCharacters.findIndex(
    sc => sc.character.toString() === characterId.toString()
  );
  
  if (existingIndex >= 0) {
    this.learningProgress.studiedCharacters[existingIndex].masteryLevel = masteryLevel;
    this.learningProgress.studiedCharacters[existingIndex].lastStudied = new Date();
  } else {
    this.learningProgress.studiedCharacters.push({
      character: characterId,
      masteryLevel,
      lastStudied: new Date()
    });
  }
  
  return this.save();
};

UserSchema.methods.addExperience = function(exp) {
  this.learningProgress.experience += exp;
  
  // 计算等级（每100经验升一级）
  const newLevel = Math.floor(this.learningProgress.experience / 100) + 1;
  if (newLevel > this.learningProgress.level && newLevel <= 100) {
    this.learningProgress.level = newLevel;
  }
  
  return this.save();
};

UserSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastStudy = this.learningProgress.lastStudyDate;
  
  if (!lastStudy) {
    this.learningProgress.currentStreak = 1;
    this.learningProgress.longestStreak = Math.max(1, this.learningProgress.longestStreak);
  } else {
    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // 连续学习
      this.learningProgress.currentStreak += 1;
      this.learningProgress.longestStreak = Math.max(
        this.learningProgress.currentStreak,
        this.learningProgress.longestStreak
      );
    } else if (daysDiff > 1) {
      // 中断了连续学习
      this.learningProgress.currentStreak = 1;
    }
    // daysDiff === 0 表示今天已经学习过，不更新连续天数
  }
  
  this.learningProgress.lastStudyDate = today;
  return this.save();
};

UserSchema.methods.addRefreshToken = function(token, expiresAt) {
  // 清理过期的token
  this.refreshTokens = this.refreshTokens.filter(rt => rt.expiresAt > new Date());
  
  // 添加新token
  this.refreshTokens.push({ token, expiresAt });
  
  // 最多保留5个token
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return this.save();
};

UserSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

// 静态方法
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username, isActive: true });
};

// 中间件
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre('save', function(next) {
  // 清理过期的refreshTokens
  this.refreshTokens = this.refreshTokens.filter(rt => rt.expiresAt > new Date());
  next();
});

module.exports = mongoose.model('User', UserSchema);