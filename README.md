# 甲骨文学习网站

一个帮助用户学习和探索甲骨文字符的现代化Web应用程序。

## 项目结构

这是一个monorepo项目，包含前端和后端代码：

```
jiaguwen_learning/
├── frontend/          # React前端应用
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── store/        # Redux状态管理
│   │   ├── services/     # API服务
│   │   └── styles/       # 样式配置
│   ├── package.json
│   └── ...
├── backend/           # Node.js后端API
│   ├── models/           # MongoDB数据模型
│   ├── routes/           # API路由
│   ├── middleware/       # 中间件
│   ├── seeds/           # 数据种子文件
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## 技术栈

### 前端
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Redux Toolkit** - 状态管理
- **Tailwind CSS** - 实用优先的CSS框架
- **Ant Design** - 企业级UI组件库

### 后端
- **Node.js** - JavaScript运行时
- **Express** - Web应用框架
- **MongoDB** - NoSQL数据库
- **JWT** - 身份认证
- **Mongoose** - MongoDB对象建模

## 快速开始

### 前置要求
- Node.js >= 14.x
- npm >= 6.x
- MongoDB

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 启动开发服务器

```bash
# 启动后端服务器 (端口: 5000)
cd backend
npm run dev

# 启动前端开发服务器 (端口: 3000)
cd frontend
npm start
```

## 功能特性

- 🔐 **用户认证** - 注册、登录、JWT身份验证
- 📚 **课程学习** - 结构化的甲骨文学习课程
- 🔍 **字符探索** - 搜索和浏览甲骨文字符
- 💪 **练习模式** - 互动式学习练习
- 📊 **学习进度** - 跟踪用户学习进展
- 📱 **响应式设计** - 适配各种设备屏幕

## 开发指南

### Git工作流
本项目使用单一仓库管理前后端代码，便于版本同步和统一管理。

### 提交规范
使用[约定式提交](https://www.conventionalcommits.org/zh-hans/)格式：

```
type(scope): description

feat: 新功能
fix: 修复Bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试
chore: 构建工具或依赖更新
```

### 目录说明
- `frontend/src/components/` - 可复用React组件
- `frontend/src/pages/` - 页面级组件
- `backend/routes/` - API路由定义
- `backend/models/` - 数据库模型
- `backend/middleware/` - Express中间件

## 部署

### 前端构建
```bash
cd frontend
npm run build
```

### 后端部署
```bash
cd backend
npm start
```

## 贡献

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证 - 详见[LICENSE](LICENSE)文件

## 联系方式

如有问题或建议，请提交Issue或联系项目维护者。