const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  oracleForm: {
    type: String,
    required: [true, '甲骨文字形不能为空'],
    trim: true,
    maxlength: [50, '甲骨文字形长度不能超过50个字符']
  },
  modernForm: {
    type: String,
    required: [true, '对应现代汉字不能为空'],
    trim: true,
    maxlength: [10, '现代汉字长度不能超过10个字符']
  },
  pronunciation: {
    type: String,
    required: [true, '读音不能为空'],
    trim: true,
    maxlength: [20, '读音长度不能超过20个字符']
  },
  meaning: {
    type: String,
    required: [true, '含义解释不能为空'],
    trim: true,
    maxlength: [500, '含义解释长度不能超过500个字符']
  },
  etymology: {
    type: String,
    trim: true,
    maxlength: [1000, '字源演变长度不能超过1000个字符']
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.startsWith('http') || v.startsWith('/images/');
      },
      message: '图片URL格式不正确，应为HTTP(S)链接或本地路径（/images/开头）'
    }
  },
  hasImage: {
    type: Boolean,
    default: false
  },
  imageAlt: {
    type: String,
    trim: true,
    maxlength: [100, '图片描述长度不能超过100个字符']
  },
  strokeOrder: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: Number,
    required: [true, '难度等级不能为空'],
    min: [1, '难度等级最小为1'],
    max: [5, '难度等级最大为5'],
    default: 1
  },
  category: {
    type: String,
    required: [true, '分类不能为空'],
    enum: {
      values: ['人物', '动物', '植物', '器物', '自然', '建筑', '抽象概念', '其他'],
      message: '分类必须是预定义的类别之一'
    }
  },
  relatedCharacters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  historicalContext: {
    type: String,
    trim: true,
    maxlength: [1000, '历史背景长度不能超过1000个字符']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, '标签长度不能超过20个字符']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 创建索引
CharacterSchema.index({ modernForm: 1 });
CharacterSchema.index({ category: 1 });
CharacterSchema.index({ difficulty: 1 });
CharacterSchema.index({ isActive: 1 });
CharacterSchema.index({ 
  modernForm: 'text', 
  meaning: 'text', 
  pronunciation: 'text',
  etymology: 'text'
}, {
  weights: {
    modernForm: 10,
    meaning: 8,
    pronunciation: 5,
    etymology: 3
  }
});

// 虚拟字段
CharacterSchema.virtual('popularityScore').get(function() {
  return this.viewCount * 0.1 + this.favoriteCount * 0.9;
});

// 实例方法
CharacterSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

CharacterSchema.methods.incrementFavoriteCount = function() {
  this.favoriteCount += 1;
  return this.save();
};

CharacterSchema.methods.decrementFavoriteCount = function() {
  if (this.favoriteCount > 0) {
    this.favoriteCount -= 1;
  }
  return this.save();
};

// 静态方法
CharacterSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

CharacterSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty, isActive: true });
};

CharacterSchema.statics.searchCharacters = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' }
  });
};

// 中间件
CharacterSchema.pre('save', function(next) {
  // 确保相关字符不包含自己
  if (this.relatedCharacters) {
    this.relatedCharacters = this.relatedCharacters.filter(
      id => !id.equals(this._id)
    );
  }
  
  // 自动设置hasImage标志
  this.hasImage = !!(this.imageUrl && this.imageUrl.trim());
  
  // 如果没有设置图片描述，自动生成
  if (this.hasImage && !this.imageAlt) {
    this.imageAlt = `${this.modernForm}字的甲骨文字形`;
  }
  
  next();
});

CharacterSchema.pre('remove', function(next) {
  // 从其他字符的relatedCharacters中移除自己
  this.model('Character').updateMany(
    { relatedCharacters: this._id },
    { $pull: { relatedCharacters: this._id } }
  ).exec();
  next();
});

module.exports = mongoose.model('Character', CharacterSchema);