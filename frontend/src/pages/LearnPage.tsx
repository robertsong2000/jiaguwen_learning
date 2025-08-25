import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Progress, Tag, Skeleton } from 'antd';
import { BookOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface Course {
  _id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  lessonsCount: number;
  progress?: number;
  category: string;
  coverImage?: string;
}

const LearnPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAppSelector(state => state.user);

  // 模拟课程数据
  useEffect(() => {
    setTimeout(() => {
      setCourses([
        {
          _id: '1',
          title: '甲骨文入门基础',
          description: '了解甲骨文的起源、发展历史和基本结构，为深入学习打下坚实基础。',
          difficulty: 1,
          estimatedTime: 120,
          lessonsCount: 8,
          progress: isAuthenticated ? 75 : 0,
          category: '基础课程'
        },
        {
          _id: '2', 
          title: '常用字符识别',
          description: '学习最常见的甲骨文字符，掌握识别技巧和记忆方法。',
          difficulty: 2,
          estimatedTime: 180,
          lessonsCount: 12,
          progress: isAuthenticated ? 30 : 0,
          category: '字符学习'
        },
        {
          _id: '3',
          title: '字形演变历史',
          description: '深入了解甲骨文字符如何演变为现代汉字，探索文字发展脉络。',
          difficulty: 3,
          estimatedTime: 240,
          lessonsCount: 15,
          progress: isAuthenticated ? 0 : 0,
          category: '历史文化'
        },
        {
          _id: '4',
          title: '古代文化背景',
          description: '学习甲骨文产生的历史背景，了解商朝的政治、经济和社会生活。',
          difficulty: 3,
          estimatedTime: 200,
          lessonsCount: 10,
          progress: isAuthenticated ? 0 : 0,
          category: '历史文化'
        },
        {
          _id: '5',
          title: '高级字符解析',
          description: '学习复杂的甲骨文字符，掌握高级识别和理解技巧。',
          difficulty: 4,
          estimatedTime: 300,
          lessonsCount: 18,
          progress: isAuthenticated ? 0 : 0,
          category: '进阶学习'
        },
        {
          _id: '6',
          title: '古文字研究方法',
          description: '了解甲骨文研究的科学方法，培养独立研究和分析能力。',
          difficulty: 5,
          estimatedTime: 360,
          lessonsCount: 20,
          progress: isAuthenticated ? 0 : 0,
          category: '研究方法'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated]);

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['green', 'blue', 'orange', 'red', 'purple'];
    return colors[difficulty - 1] || 'gray';
  };

  const getDifficultyText = (difficulty: number) => {
    const texts = ['入门', '初级', '中级', '高级', '专家'];
    return texts[difficulty - 1] || '未知';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  return (
    <div className="learn-page bg-ivory min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title level={1} className="text-ancient oracle-character-large mb-4">
            系统学习
          </Title>
          <Paragraph className="text-xl text-secondary-ancient max-w-3xl mx-auto">
            通过精心设计的课程体系，循序渐进地掌握甲骨文知识，从基础入门到专业研究，开启古文字学习之旅
          </Paragraph>
        </motion.div>

        {/* 学习统计 */}
        {isAuthenticated && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="ancient-shadow">
              <Row gutter={[24, 24]} className="text-center">
                <Col xs={24} sm={8}>
                  <div>
                    <TrophyOutlined className="text-3xl text-gold mb-2" />
                    <Title level={3} className="text-ancient mb-1">3</Title>
                    <Paragraph className="text-muted-ancient">已完成课程</Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div>
                    <BookOutlined className="text-3xl text-ancient mb-2" />
                    <Title level={3} className="text-ancient mb-1">24</Title>
                    <Paragraph className="text-muted-ancient">已学习课时</Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div>
                    <ClockCircleOutlined className="text-3xl text-vermillion mb-2" />
                    <Title level={3} className="text-ancient mb-1">8.5</Title>
                    <Paragraph className="text-muted-ancient">学习时长(小时)</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        )}

        {/* 课程列表 */}
        <div className="courses-grid">
          {loading ? (
            <Row gutter={[24, 24]}>
              {[1, 2, 3, 4, 5, 6].map(item => (
                <Col xs={24} lg={12} key={item}>
                  <Card className="h-full">
                    <Skeleton active />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Row gutter={[24, 24]}>
              {courses.map((course, index) => (
                <Col xs={24} lg={12} key={course._id}>
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
                          <Link to={`/learn/course/${course._id}`}>
                            {course.progress && course.progress > 0 ? '继续学习' : '开始学习'}
                          </Link>
                        </Button>
                      ]}
                    >
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Title level={3} className="text-ancient modern-character mb-0">
                            {course.title}
                          </Title>
                          <Tag color={getDifficultyColor(course.difficulty)}>
                            {getDifficultyText(course.difficulty)}
                          </Tag>
                        </div>
                        <Tag className="mb-3">{course.category}</Tag>
                      </div>

                      <Paragraph className="text-muted-ancient mb-4 min-h-[3rem]">
                        {course.description}
                      </Paragraph>

                      <div className="course-meta mb-4">
                        <div className="flex justify-between text-sm text-muted-ancient mb-2">
                          <span>
                            <BookOutlined className="mr-1" />
                            {course.lessonsCount} 课时
                          </span>
                          <span>
                            <ClockCircleOutlined className="mr-1" />
                            {formatTime(course.estimatedTime)}
                          </span>
                        </div>
                        
                        {isAuthenticated && course.progress !== undefined && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-ancient">学习进度</span>
                              <span className="text-ancient font-medium">{course.progress}%</span>
                            </div>
                            <Progress 
                              percent={course.progress} 
                              showInfo={false}
                              strokeColor="#8B4513"
                              trailColor="#f0f0f0"
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* 学习建议 */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="ancient-shadow">
            <Title level={3} className="text-ancient text-center mb-6">学习建议</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <div className="oracle-character text-4xl text-ancient mb-3">学</div>
                  <Title level={4} className="text-ancient">循序渐进</Title>
                  <Paragraph className="text-muted-ancient">
                    建议按照课程难度顺序学习，确保基础知识扎实
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <div className="oracle-character text-4xl text-ancient mb-3">习</div>
                  <Title level={4} className="text-ancient">勤练不辍</Title>
                  <Paragraph className="text-muted-ancient">
                    每天坚持练习，通过重复学习加深记忆和理解
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <div className="oracle-character text-4xl text-ancient mb-3">思</div>
                  <Title level={4} className="text-ancient">善于思考</Title>
                  <Paragraph className="text-muted-ancient">
                    主动思考字符背后的文化内涵和历史背景
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

export default LearnPage;