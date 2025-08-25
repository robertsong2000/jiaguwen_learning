import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Row, Col, Tag, Progress, Statistic, Space } from 'antd';
import { 
  ExperimentOutlined, 
  EyeOutlined, 
  EditOutlined, 
  QuestionCircleOutlined,
  TrophyOutlined,
  AimOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';

const { Title, Paragraph, Text } = Typography;

interface PracticeType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  difficulty: number;
  timeRequired: number;
  questionsCount: number;
  userProgress?: number;
  bestScore?: number;
  category: string;
}

const PracticePage: React.FC = () => {
  const [practiceTypes, setPracticeTypes] = useState<PracticeType[]>([]);
  const [userStats, setUserStats] = useState({
    totalPractices: 0,
    averageScore: 0,
    streakDays: 0,
    practiceTime: 0
  });
  const { isAuthenticated } = useAppSelector(state => state.user);

  useEffect(() => {
    // 模拟练习类型数据
    setPracticeTypes([
      {
        id: 'recognition',
        title: '字符识别',
        description: '通过观察甲骨文字形，选择对应的现代汉字或含义',
        icon: EyeOutlined,
        difficulty: 2,
        timeRequired: 10,
        questionsCount: 20,
        userProgress: isAuthenticated ? 75 : 0,
        bestScore: isAuthenticated ? 85 : 0,
        category: '基础练习'
      },
      {
        id: 'writing',
        title: '字符书写',
        description: '根据现代汉字或含义，选择或绘制对应的甲骨文字符',
        icon: EditOutlined,
        difficulty: 3,
        timeRequired: 15,
        questionsCount: 15,
        userProgress: isAuthenticated ? 45 : 0,
        bestScore: isAuthenticated ? 72 : 0,
        category: '进阶练习'
      },
      {
        id: 'meaning',
        title: '含义匹配',
        description: '将甲骨文字符与其正确的含义或用法进行匹配',
        icon: QuestionCircleOutlined,
        difficulty: 2,
        timeRequired: 12,
        questionsCount: 25,
        userProgress: isAuthenticated ? 60 : 0,
        bestScore: isAuthenticated ? 78 : 0,
        category: '理解练习'
      },
      {
        id: 'evolution',
        title: '字形演变',
        description: '学习甲骨文到现代汉字的演变过程，按顺序排列字形',
        icon: AimOutlined,
        difficulty: 4,
        timeRequired: 20,
        questionsCount: 10,
        userProgress: isAuthenticated ? 30 : 0,
        bestScore: isAuthenticated ? 65 : 0,
        category: '高级练习'
      },
      {
        id: 'comprehensive',
        title: '综合测试',
        description: '包含识别、书写、含义等多种题型的综合性测试',
        icon: TrophyOutlined,
        difficulty: 5,
        timeRequired: 30,
        questionsCount: 50,
        userProgress: isAuthenticated ? 15 : 0,
        bestScore: isAuthenticated ? 58 : 0,
        category: '综合测试'
      },
      {
        id: 'daily',
        title: '每日挑战',
        description: '每天更新的特色练习题目，挑战您的甲骨文知识',
        icon: CheckCircleOutlined,
        difficulty: 3,
        timeRequired: 8,
        questionsCount: 10,
        userProgress: isAuthenticated ? 90 : 0,
        bestScore: isAuthenticated ? 92 : 0,
        category: '特色练习'
      }
    ]);

    // 模拟用户统计数据
    if (isAuthenticated) {
      setUserStats({
        totalPractices: 156,
        averageScore: 76,
        streakDays: 12,
        practiceTime: 18.5
      });
    }
  }, [isAuthenticated]);

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['green', 'blue', 'orange', 'red', 'purple'];
    return colors[difficulty - 1] || 'gray';
  };

  const getDifficultyText = (difficulty: number) => {
    const texts = ['入门', '初级', '中级', '高级', '专家'];
    return texts[difficulty - 1] || '未知';
  };

  return (
    <div className="practice-page bg-ivory min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title level={1} className="text-ancient oracle-character-large mb-4">
            互动练习
          </Title>
          <Paragraph className="text-xl text-secondary-ancient max-w-3xl mx-auto">
            通过多样化的练习形式，巩固甲骨文知识，提升识别能力和理解水平
          </Paragraph>
        </motion.div>

        {/* 用户统计（仅登录用户） */}
        {isAuthenticated && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="ancient-shadow">
              <Title level={3} className="text-ancient text-center mb-6">练习统计</Title>
              <Row gutter={[24, 24]} className="text-center">
                <Col xs={12} sm={6}>
                  <Statistic
                    title="累计练习"
                    value={userStats.totalPractices}
                    suffix="次"
                    valueStyle={{ color: '#8B4513' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="平均分数"
                    value={userStats.averageScore}
                    suffix="分"
                    valueStyle={{ color: '#FF4500' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="连续天数"
                    value={userStats.streakDays}
                    suffix="天"
                    valueStyle={{ color: '#2F4F4F' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="练习时长"
                    value={userStats.practiceTime}
                    suffix="小时"
                    valueStyle={{ color: '#FFD700' }}
                  />
                </Col>
              </Row>
            </Card>
          </motion.div>
        )}

        {/* 练习类型网格 */}
        <Row gutter={[24, 24]}>
          {practiceTypes.map((practice, index) => {
            const IconComponent = practice.icon;
            return (
              <Col xs={24} md={12} lg={8} key={practice.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card 
                    className="h-full ancient-shadow hover-lift transition-all duration-300"
                    actions={[
                      <Button 
                        type="primary" 
                        className="btn-ancient"
                        size="large"
                        block
                      >
                        <Link to={`/practice/${practice.id}`}>
                          开始练习
                        </Link>
                      </Button>
                    ]}
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl text-ancient mb-3">
                        <IconComponent />
                      </div>
                      <Title level={3} className="text-ancient modern-character mb-2">
                        {practice.title}
                      </Title>
                      <Space>
                        <Tag color={getDifficultyColor(practice.difficulty)}>
                          {getDifficultyText(practice.difficulty)}
                        </Tag>
                        <Tag>{practice.category}</Tag>
                      </Space>
                    </div>

                    <Paragraph className="text-muted-ancient mb-4 min-h-[3rem]">
                      {practice.description}
                    </Paragraph>

                    <div className="practice-meta mb-4">
                      <div className="flex justify-between text-sm text-muted-ancient mb-2">
                        <span>
                          <QuestionCircleOutlined className="mr-1" />
                          {practice.questionsCount} 题
                        </span>
                        <span>
                          <ClockCircleOutlined className="mr-1" />
                          {practice.timeRequired} 分钟
                        </span>
                      </div>
                      
                      {isAuthenticated && practice.userProgress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-ancient">完成进度</span>
                            <span className="text-ancient font-medium">{practice.userProgress}%</span>
                          </div>
                          <Progress 
                            percent={practice.userProgress} 
                            showInfo={false}
                            strokeColor="#8B4513"
                            trailColor="#f0f0f0"
                          />
                        </div>
                      )}
                      
                      {isAuthenticated && practice.bestScore !== undefined && (
                        <div className="text-center">
                          <Text className="text-muted-ancient text-sm">
                            最佳成绩: <span className="text-ancient font-medium">{practice.bestScore}分</span>
                          </Text>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* 练习建议 */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="ancient-shadow">
            <Title level={3} className="text-ancient text-center mb-6">练习建议</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <ExperimentOutlined className="text-4xl text-ancient mb-3" />
                  <Title level={4} className="text-ancient">循序渐进</Title>
                  <Paragraph className="text-muted-ancient">
                    建议从基础练习开始，逐步提高难度，确保扎实掌握
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <ClockCircleOutlined className="text-4xl text-ancient mb-3" />
                  <Title level={4} className="text-ancient">每日坚持</Title>
                  <Paragraph className="text-muted-ancient">
                    每天保持一定的练习量，养成良好的学习习惯
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <TrophyOutlined className="text-4xl text-ancient mb-3" />
                  <Title level={4} className="text-ancient">挑战自我</Title>
                  <Paragraph className="text-muted-ancient">
                    不断挑战更高难度，突破自己的知识边界
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PracticePage;