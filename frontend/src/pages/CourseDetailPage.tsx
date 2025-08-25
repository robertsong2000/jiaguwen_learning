import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  List, 
  Progress, 
  Tag, 
  Row, 
  Col, 
  Avatar,
  Skeleton,
  Alert,
  Breadcrumb
} from 'antd';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  BookOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';

const { Title, Paragraph, Text } = Typography;

interface Lesson {
  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  content: {
    characters: string[];
    explanation: string;
    examples: string[];
    culturalNote: string;
  };
}

interface Course {
  _id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  lessonsCount: number;
  progress?: number;
  category: string;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  lessons: Lesson[];
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAppSelector(state => state.user);

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      const mockCourse: Course = {
        _id: courseId || '1',
        title: '甲骨文入门基础',
        description: '本课程将带您深入了解甲骨文的起源、发展历史和基本结构。通过系统性的学习，您将掌握甲骨文的基础知识，为进一步的研究学习打下坚实的基础。课程内容包括甲骨文的发现历史、字形特点、常见结构、以及与现代汉字的关系。',
        difficulty: 1,
        estimatedTime: 120,
        lessonsCount: 8,
        progress: isAuthenticated ? 75 : 0,
        category: '基础课程',
        instructor: {
          name: '王教授',
          avatar: '',
          title: '古文字学专家'
        },
        lessons: [
          {
            _id: '1',
            title: '甲骨文的发现与研究史',
            description: '了解甲骨文的发现过程、重要人物和研究发展历程',
            duration: 15,
            order: 1,
            isCompleted: true,
            isLocked: false,
            content: {
              characters: ['甲', '骨', '文'],
              explanation: '甲骨文是商朝的文字记录...',
              examples: ['商王询问天意', '记录祭祀活动'],
              culturalNote: '反映了商朝的政治制度和宗教信仰'
            }
          },
          {
            _id: '2',
            title: '甲骨文的字形特点',
            description: '学习甲骨文字形的基本特征和构造规律',
            duration: 20,
            order: 2,
            isCompleted: true,
            isLocked: false,
            content: {
              characters: ['人', '大', '小', '上', '下'],
              explanation: '甲骨文字形具有象形性...',
              examples: ['人字像站立的人形', '大字像张开双臂的人'],
              culturalNote: '体现了古人的观察力和抽象思维'
            }
          },
          {
            _id: '3',
            title: '象形字的识别与理解',
            description: '掌握象形字的特点，学会识别和理解常见象形字',
            duration: 25,
            order: 3,
            isCompleted: true,
            isLocked: false,
            content: {
              characters: ['日', '月', '山', '水', '火'],
              explanation: '象形字是甲骨文的重要组成部分...',
              examples: ['日字像太阳的形状', '月字像月亮的弯形'],
              culturalNote: '反映了古人对自然界的认识'
            }
          },
          {
            _id: '4',
            title: '指事字的学习方法',
            description: '了解指事字的构造原理，学习识别技巧',
            duration: 18,
            order: 4,
            isCompleted: false,
            isLocked: false,
            content: {
              characters: ['上', '下', '本', '末'],
              explanation: '指事字通过符号来表达抽象概念...',
              examples: ['上字在横线上方加点', '下字在横线下方加点'],
              culturalNote: '展现了古人的抽象思维能力'
            }
          },
          {
            _id: '5',
            title: '会意字的构成规律',
            description: '学习会意字的组合方式和意义表达',
            duration: 22,
            order: 5,
            isCompleted: false,
            isLocked: false,
            content: {
              characters: ['明', '休', '好', '安'],
              explanation: '会意字由两个或多个字符组合而成...',
              examples: ['明字由日月组成', '休字由人倚木组成'],
              culturalNote: '体现了汉字的组合智慧'
            }
          },
          {
            _id: '6',
            title: '形声字的解析',
            description: '掌握形声字的声旁和形旁识别方法',
            duration: 20,
            order: 6,
            isCompleted: false,
            isLocked: true,
            content: {
              characters: ['河', '清', '请', '晴'],
              explanation: '形声字包含表意的形旁和表音的声旁...',
              examples: ['河字以水为形旁', '请字以言为形旁'],
              culturalNote: '是汉字发展的重要阶段'
            }
          },
          {
            _id: '7',
            title: '甲骨文与现代汉字对比',
            description: '探索甲骨文到现代汉字的演变轨迹',
            duration: 15,
            order: 7,
            isCompleted: false,
            isLocked: true,
            content: {
              characters: ['人', '马', '鸟', '鱼', '木'],
              explanation: '现代汉字继承了甲骨文的基本结构...',
              examples: ['人字的演变过程', '马字的简化发展'],
              culturalNote: '见证了中华文字的传承发展'
            }
          },
          {
            _id: '8',
            title: '课程总结与实践',
            description: '回顾课程要点，进行综合练习',
            duration: 25,
            order: 8,
            isCompleted: false,
            isLocked: true,
            content: {
              characters: ['学', '习', '知', '识', '智'],
              explanation: '通过实践巩固所学知识...',
              examples: ['综合识别练习', '字形演变追踪'],
              culturalNote: '学以致用，知行合一'
            }
          }
        ]
      };
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [courseId, isAuthenticated]);

  const formatDuration = (minutes: number) => {
    return `${minutes}分钟`;
  };

  const getDifficultyText = (difficulty: number) => {
    const texts = ['入门', '初级', '中级', '高级', '专家'];
    return texts[difficulty - 1] || '未知';
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['green', 'blue', 'orange', 'red', 'purple'];
    return colors[difficulty - 1] || 'gray';
  };

  const handleStartLesson = (lessonId: string) => {
    navigate(`/learn/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="course-detail-page bg-ivory min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-page bg-ivory min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Alert
            message="课程未找到"
            description="抱歉，您访问的课程不存在或已被删除。"
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page bg-ivory min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 面包屑导航 */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> 首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/learn">系统学习</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{course.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          {/* 课程信息 */}
          <Col xs={24} lg={16}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="ancient-shadow mb-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Title level={1} className="text-ancient modern-character mb-0">
                      {course.title}
                    </Title>
                    <Tag color={getDifficultyColor(course.difficulty)} className="text-lg px-3 py-1">
                      {getDifficultyText(course.difficulty)}
                    </Tag>
                  </div>
                  <Tag className="mb-4">{course.category}</Tag>
                </div>

                <Paragraph className="text-muted-ancient text-lg mb-6">
                  {course.description}
                </Paragraph>

                {/* 课程统计 */}
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={12} sm={6}>
                    <div className="text-center">
                      <BookOutlined className="text-2xl text-ancient mb-2" />
                      <div className="text-lg font-semibold text-ancient">{course.lessonsCount}</div>
                      <div className="text-muted-ancient">课时</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center">
                      <ClockCircleOutlined className="text-2xl text-ancient mb-2" />
                      <div className="text-lg font-semibold text-ancient">{Math.floor(course.estimatedTime / 60)}h</div>
                      <div className="text-muted-ancient">时长</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center">
                      <UserOutlined className="text-2xl text-ancient mb-2" />
                      <div className="text-lg font-semibold text-ancient">1000+</div>
                      <div className="text-muted-ancient">学员</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center">
                      <div className="oracle-character text-2xl text-ancient mb-2">学</div>
                      <div className="text-lg font-semibold text-ancient">4.9</div>
                      <div className="text-muted-ancient">评分</div>
                    </div>
                  </Col>
                </Row>

                {/* 学习进度 */}
                {isAuthenticated && course.progress !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <Text className="text-muted-ancient">学习进度</Text>
                      <Text className="text-ancient font-semibold">{course.progress}%</Text>
                    </div>
                    <Progress 
                      percent={course.progress} 
                      strokeColor="#8B4513"
                      trailColor="#f0f0f0"
                    />
                  </div>
                )}

                {/* 讲师信息 */}
                <div className="instructor-info border-t pt-4">
                  <Title level={4} className="text-ancient mb-3">课程讲师</Title>
                  <div className="flex items-center">
                    <Avatar 
                      size={64} 
                      icon={<UserOutlined />} 
                      src={course.instructor.avatar}
                      className="mr-4"
                    />
                    <div>
                      <Title level={5} className="text-ancient mb-1">{course.instructor.name}</Title>
                      <Text className="text-muted-ancient">{course.instructor.title}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* 课时列表 */}
          <Col xs={24} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Card 
                title={
                  <Title level={3} className="text-ancient mb-0">
                    课程大纲
                  </Title>
                }
                className="ancient-shadow"
              >
                <List
                  dataSource={course.lessons}
                  renderItem={(lesson, index) => (
                    <List.Item className="border-0 px-0">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {lesson.isCompleted ? (
                              <CheckCircleOutlined className="text-green-500 mr-2" />
                            ) : lesson.isLocked ? (
                              <div className="w-4 h-4 rounded-full bg-gray-300 mr-2" />
                            ) : (
                              <PlayCircleOutlined className="text-ancient mr-2" />
                            )}
                            <Text 
                              className={`font-medium ${
                                lesson.isLocked ? 'text-gray-400' : 'text-ancient'
                              }`}
                            >
                              第{lesson.order}课
                            </Text>
                          </div>
                          <Text className="text-muted-ancient text-sm">
                            {formatDuration(lesson.duration)}
                          </Text>
                        </div>
                        
                        <Title 
                          level={5} 
                          className={`mb-2 ${
                            lesson.isLocked ? 'text-gray-400' : 'text-ancient'
                          }`}
                        >
                          {lesson.title}
                        </Title>
                        
                        <Paragraph 
                          className={`text-sm mb-3 ${
                            lesson.isLocked ? 'text-gray-400' : 'text-muted-ancient'
                          }`}
                        >
                          {lesson.description}
                        </Paragraph>
                        
                        {!lesson.isLocked && (
                          <Button
                            type={lesson.isCompleted ? 'default' : 'primary'}
                            size="small"
                            className={lesson.isCompleted ? '' : 'btn-ancient'}
                            onClick={() => handleStartLesson(lesson._id)}
                            block
                          >
                            {lesson.isCompleted ? '重新学习' : '开始学习'}
                          </Button>
                        )}
                        
                        {lesson.isLocked && (
                          <Text className="text-gray-400 text-sm">
                            完成前置课程后解锁
                          </Text>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CourseDetailPage;