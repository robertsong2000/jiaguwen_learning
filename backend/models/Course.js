const mongoose = require('mongoose');

// 课程模型
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '课程标题不能为空'],
    trim: true,
    maxlength: [100, '课程标题最多100个字符']
  },
  description: {
    type: String,
    required: [true, '课程描述不能为空'],
    trim: true,
    maxlength: [500, '课程描述最多500个字符']
  },
  coverImage: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\\/\\/.+\\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: '封面图片URL格式不正确'
    }
  },
  difficulty: {
    type: Number,
    required: [true, '难度等级不能为空'],
    min: [1, '难度等级最小为1'],
    max: [5, '难度等级最大为5']
  },
  estimatedHours: {
    type: Number,
    required: [true, '预计学习时长不能为空'],
    min: [0.5, '预计学习时长最少0.5小时'],
    max: [100, '预计学习时长最多100小时']
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, '标签长度不能超过20个字符']
  }],
  instructor: {
    name: {
      type: String,
      required: [true, '讲师姓名不能为空'],
      trim: true,
      maxlength: [50, '讲师姓名最多50个字符']
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [200, '讲师简介最多200个字符']
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrollmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  completionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 课时模型
const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '课时标题不能为空'],
    trim: true,
    maxlength: [100, '课时标题最多100个字符']
  },
  description: {
    type: String,
    required: [true, '课时描述不能为空'],
    trim: true,
    maxlength: [300, '课时描述最多300个字符']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, '课程ID不能为空']
  },
  order: {
    type: Number,
    required: [true, '课时顺序不能为空'],
    min: [1, '课时顺序最小为1']
  },
  content: {
    characters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    }],
    explanation: {
      type: String,
      required: [true, '课程解释不能为空'],
      maxlength: [2000, '课程解释最多2000个字符']
    },
    examples: [{
      type: String,
      maxlength: [200, '例句最多200个字符']
    }],
    culturalNote: {
      type: String,
      maxlength: [1000, '文化背景最多1000个字符']
    },
    videoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\\/\\/.+/.test(v);
        },
        message: '视频URL格式不正确'
      }
    },
    audioUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\\/\\/.+/.test(v);
        },
        message: '音频URL格式不正确'
      }
    }
  },
  exercises: [{
    type: {
      type: String,
      enum: ['recognition', 'writing', 'meaning', 'choice'],
      required: true
    },
    question: {
      type: String,
      required: [true, '题目不能为空'],
      maxlength: [200, '题目最多200个字符']
    },
    options: [{
      type: String,
      maxlength: [100, '选项最多100个字符']
    }],
    correctAnswer: {
      type: String,
      required: [true, '正确答案不能为空'],
      maxlength: [100, '正确答案最多100个字符']
    },
    explanation: {
      type: String,
      maxlength: [300, '答案解释最多300个字符']
    },
    points: {
      type: Number,
      default: 10,
      min: 1,
      max: 100
    }
  }],
  estimatedTime: {
    type: Number,
    required: [true, '预计学习时间不能为空'],
    min: [1, '预计学习时间最少1分钟'],
    max: [180, '预计学习时间最多180分钟']
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  difficulty: {
    type: Number,
    required: [true, '难度等级不能为空'],
    min: [1, '难度等级最小为1'],
    max: [5, '难度等级最大为5']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  completionCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ difficulty: 1 });
CourseSchema.index({ isPublished: 1, isActive: 1 });
CourseSchema.index({ 'rating.average': -1 });
CourseSchema.index({ enrollmentCount: -1 });

LessonSchema.index({ courseId: 1, order: 1 });
LessonSchema.index({ title: 'text', 'content.explanation': 'text' });
LessonSchema.index({ difficulty: 1 });
LessonSchema.index({ isPublished: 1, isActive: 1 });

// 虚拟字段
CourseSchema.virtual('lessonCount').get(function() {
  return this.lessons.length;
});

CourseSchema.virtual('completionRate').get(function() {
  if (this.enrollmentCount === 0) return 0;
  return (this.completionCount / this.enrollmentCount * 100).toFixed(1);
});

LessonSchema.virtual('exerciseCount').get(function() {
  return this.exercises.length;
});

LessonSchema.virtual('totalPoints').get(function() {
  return this.exercises.reduce((sum, ex) => sum + ex.points, 0);
});

// 实例方法
CourseSchema.methods.incrementEnrollment = function() {
  this.enrollmentCount += 1;
  return this.save();
};

CourseSchema.methods.incrementCompletion = function() {
  this.completionCount += 1;
  return this.save();
};

CourseSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

LessonSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

LessonSchema.methods.incrementCompletion = function() {
  this.completionCount += 1;
  return this.save();
};

// 静态方法
CourseSchema.statics.findPublished = function() {
  return this.find({ isPublished: true, isActive: true });
};

CourseSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty, isPublished: true, isActive: true });
};

LessonSchema.statics.findByCourse = function(courseId) {
  return this.find({ courseId, isPublished: true, isActive: true }).sort({ order: 1 });
};

// 中间件
CourseSchema.pre('save', function(next) {
  // 确保前置课程不包含自己
  if (this.prerequisites) {
    this.prerequisites = this.prerequisites.filter(
      id => !id.equals(this._id)
    );
  }
  next();
});

LessonSchema.pre('save', function(next) {
  // 确保前置课时不包含自己
  if (this.prerequisites) {
    this.prerequisites = this.prerequisites.filter(
      id => !id.equals(this._id)
    );
  }
  next();
});

const Course = mongoose.model('Course', CourseSchema);
const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = { Course, Lesson };