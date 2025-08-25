import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Row, 
  Col, 
  Progress,
  Breadcrumb,
  Divider,
  Tag,
  Alert,
  Space,
  Skeleton
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  BookOutlined,
  BulbOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';

const { Title, Paragraph, Text } = Typography;

interface LessonContent {
  characters: string[];
  explanation: string;
  examples: string[];
  culturalNote: string;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  courseId: string;
  courseName: string;
  content: LessonContent;
  isCompleted?: boolean;
  previousLessonId?: string;
  nextLessonId?: string;
}

const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { isAuthenticated } = useAppSelector(state => state.user);

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      const mockLesson: Lesson = {
        _id: lessonId || '1',
        title: '甲骨文的发现与研究史',
        description: '了解甲骨文的发现过程、重要人物和研究发展历程',
        duration: 15,
        order: 1,
        courseId: '1',
        courseName: '甲骨文入门基础',
        content: {
          characters: ['甲', '骨', '文', '字', '史'],
          explanation: `
            甲骨文是中国最早的成熟文字系统，距今约3000多年，主要发现于河南安阳的殷墟遗址。
            
            甲骨文的发现始于1899年，当时的金石学家王懿荣在中药"龙骨"上发现了奇特的刻画符号，
            意识到这可能是古代文字。随后，学者们开始系统性的研究和收集工作。
            
            经过一个多世纪的研究，学者们已经识读出约1500个甲骨文字符，其中确认的有1000多个。
            这些文字记录了商朝的政治、经济、宗教、社会生活等各个方面，为我们了解中国古代历史
            提供了珍贵的第一手资料。
            
            甲骨文的字形特点鲜明，具有浓厚的象形色彩。许多字符直接描绘事物的外形特征，
            如"人"字像人的侧面形象，"马"字像马的全身轮廓。这种造字方法体现了古人敏锐的
            观察力和丰富的想象力。
          `,
          examples: [
            '商王询问天意："贞：王其田？"（占卜：王要去打猎吗？）',
            '记录祭祀活动："癸巳卜，贞：王宾于父丁？"（癸巳日占卜，王要祭祀父丁吗？）',
            '天气预报："贞：今日雨？"（占卜：今天会下雨吗？）',
            '军事活动："贞：王其征人方？"（占卜：王要征伐人方吗？）'
          ],
          culturalNote: `
            甲骨文不仅是文字，更是商朝文化的载体。通过甲骨文，我们可以了解到：
            
            1. 政治制度：商朝实行王权制，国王拥有至高无上的权力
            2. 宗教信仰：商人崇拜祖先，相信鬼神，占卜活动频繁
            3. 社会结构：存在明显的等级制度，有王族、贵族、平民等
            4. 经济生活：农业发达，手工业兴盛，商业贸易活跃
            5. 军事活动：经常进行征伐，维护和扩张领土
            
            甲骨文的发现，不仅证实了商朝的存在，也为中华文明的研究提供了重要依据。
            它被誉为"中华文明的基因"，对于理解中华文化的根源具有重要意义。
          `
        },
        isCompleted: false,
        previousLessonId: undefined,
        nextLessonId: '2'
      };
      setLesson(mockLesson);
      setLoading(false);
    }, 1000);
  }, [lessonId]);

  // 模拟学习进度
  useEffect(() => {
    if (!lesson) return;
    
    const progressInterval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 100) {
          setIsCompleted(true);
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 150); // 每150ms增加1%，总共15秒完成

    return () => clearInterval(progressInterval);
  }, [lesson]);

  const handleCompleteLesson = () => {
    setIsCompleted(true);
    setCurrentProgress(100);
    // 这里应该调用API标记课程为完成状态
  };

  const handleNextLesson = () => {
    if (lesson?.nextLessonId) {
      navigate(`/learn/lesson/${lesson.nextLessonId}`);
    }
  };

  const handlePreviousLesson = () => {
    if (lesson?.previousLessonId) {
      navigate(`/learn/lesson/${lesson.previousLessonId}`);
    }
  };

  if (loading) {
    return (
      <div className="lesson-detail-page bg-ivory min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Skeleton active paragraph={{ rows: 15 }} />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-detail-page bg-ivory min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Alert
            message="课时未找到"
            description="抱歉，您访问的课时不存在或已被删除。"
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-detail-page bg-ivory min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
          <Breadcrumb.Item>
            <Link to={`/learn/course/${lesson.courseId}`}>{lesson.courseName}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>第{lesson.order}课</Breadcrumb.Item>
        </Breadcrumb>

        {/* 课时标题和进度 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="ancient-shadow mb-6">
            <div className="mb-4">
              <Tag className="mb-2">第{lesson.order}课</Tag>
              <Title level={1} className="text-ancient modern-character mb-2">
                {lesson.title}
              </Title>
              <Paragraph className="text-muted-ancient text-lg">
                {lesson.description}
              </Paragraph>
            </div>

            {/* 学习进度 */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <Text className="text-muted-ancient">学习进度</Text>
                <Text className="text-ancient font-semibold">{currentProgress}%</Text>
              </div>
              <Progress 
                percent={currentProgress} 
                strokeColor="#8B4513"
                trailColor="#f0f0f0"
                status={isCompleted ? 'success' : 'active'}
              />
            </div>

            {isCompleted && (
              <Alert
                message="恭喜完成学习！"
                description="您已经完成了本课时的学习，可以继续下一课时。"
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                className="mb-4"
              />
            )}
          </Card>
        </motion.div>

        {/* 主要学习内容 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* 重点字符 */}
              <Card 
                title={
                  <div className="flex items-center">
                    <BookOutlined className="mr-2" />
                    <span>重点字符</span>
                  </div>
                }
                className="ancient-shadow mb-6"
              >
                <div className="text-center">
                  <Space size="large" wrap>
                    {lesson.content.characters.map((char, index) => (
                      <motion.div
                        key={index}
                        className="character-display"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <Card 
                          className="text-center hover-lift transition-all duration-300"
                          bodyStyle={{ padding: '16px' }}
                        >
                          <div className="oracle-character text-6xl text-ancient mb-2">
                            {char}
                          </div>
                          <Text className="modern-character text-lg text-secondary-ancient">
                            {char}
                          </Text>
                        </Card>
                      </motion.div>
                    ))}
                  </Space>
                </div>
              </Card>

              {/* 课程内容 */}
              <Card 
                title={
                  <div className="flex items-center">
                    <BulbOutlined className="mr-2" />
                    <span>课程内容</span>
                  </div>
                }
                className="ancient-shadow mb-6"
              >
                <div className="lesson-content text-lg leading-relaxed">
                  {lesson.content.explanation.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <Paragraph key={index} className="text-muted-ancient mb-4">
                        {paragraph.trim()}
                      </Paragraph>
                    )
                  ))}
                </div>
              </Card>

              {/* 实例解析 */}
              <Card 
                title={
                  <div className="flex items-center">
                    <HistoryOutlined className="mr-2" />
                    <span>实例解析</span>
                  </div>
                }
                className="ancient-shadow mb-6"
              >
                {lesson.content.examples.map((example, index) => (
                  <motion.div
                    key={index}
                    className="example-item mb-4 last:mb-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                  >
                    <Card className="bg-gray-50 border-l-4 border-ancient">
                      <Text className="oracle-character text-lg text-ancient mr-3">
                        {index + 1}.
                      </Text>
                      <Text className="text-muted-ancient">{example}</Text>
                    </Card>
                  </motion.div>
                ))}
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* 文化背景 */}
              <Card 
                title="文化背景"
                className="ancient-shadow mb-6"
              >
                <div className="cultural-note">
                  {lesson.content.culturalNote.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <Paragraph key={index} className="text-muted-ancient mb-3 text-sm">
                        {paragraph.trim()}
                      </Paragraph>
                    )
                  ))}
                </div>
              </Card>

              {/* 学习工具 */}
              <Card title="学习工具" className="ancient-shadow">
                <Space direction="vertical" className="w-full">
                  <Button 
                    type="primary" 
                    className="btn-ancient w-full"
                    onClick={handleCompleteLesson}
                    disabled={isCompleted}
                  >
                    {isCompleted ? '已完成学习' : '标记为完成'}
                  </Button>
                  
                  <Button className="w-full">
                    <Link to="/practice">进入练习中心</Link>
                  </Button>
                  
                  <Button className="w-full">
                    笔记收藏
                  </Button>
                </Space>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* 导航按钮 */}
        <motion.div
          className="navigation-buttons mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Card className="ancient-shadow">
            <div className="flex justify-between">
              <Button
                size="large"
                disabled={!lesson.previousLessonId}
                onClick={handlePreviousLesson}
                icon={<ArrowLeftOutlined />}
              >
                上一课时
              </Button>
              
              <Button 
                type="primary"
                size="large"
                className="btn-ancient"
                disabled={!lesson.nextLessonId || !isCompleted}
                onClick={handleNextLesson}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                下一课时
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonDetailPage;