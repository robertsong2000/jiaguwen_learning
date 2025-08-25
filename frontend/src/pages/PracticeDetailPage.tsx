import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Row, 
  Col, 
  Progress,
  Radio,
  Checkbox,
  Input,
  Alert,
  Result,
  Statistic,
  Space,
  Breadcrumb,
  Modal,
  Tag
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  TrophyOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';

const { Title, Paragraph, Text } = Typography;
const { Countdown } = Statistic;

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'input';
  question: string;
  oracleCharacter?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: number;
}

interface PracticeSession {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // 秒
  questions: Question[];
  totalQuestions: number;
}

const PracticeDetailPage: React.FC = () => {
  const { practiceType } = useParams<{ practiceType: string }>();
  const navigate = useNavigate();
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { isAuthenticated } = useAppSelector(state => state.user);

  useEffect(() => {
    // 根据练习类型生成对应的练习内容
    const generatePracticeSession = (type: string): PracticeSession => {
      switch (type) {
        case 'recognition':
          return {
            id: 'recognition_001',
            title: '字符识别练习',
            description: '观察甲骨文字符，选择正确的现代汉字或含义',
            timeLimit: 600, // 10分钟
            totalQuestions: 10,
            questions: [
              {
                id: '1',
                type: 'single',
                question: '这个甲骨文字符对应哪个现代汉字？',
                oracleCharacter: '人',
                options: ['人', '大', '小', '子'],
                correctAnswer: '人',
                explanation: '这个字符像一个人的侧面形象，头、身体、手臂和腿都很清晰，所以是"人"字。',
                difficulty: 1
              },
              {
                id: '2',
                type: 'single',
                question: '这个甲骨文字符的含义是？',
                oracleCharacter: '日',
                options: ['月亮', '太阳', '星星', '云朵'],
                correctAnswer: '太阳',
                explanation: '这个字符像太阳的形状，中间的点或横线表示太阳的光芒或内部结构。',
                difficulty: 1
              },
              {
                id: '3',
                type: 'single',
                question: '请选择正确的现代汉字：',
                oracleCharacter: '水',
                options: ['火', '土', '水', '木'],
                correctAnswer: '水',
                explanation: '这个字符像流动的水，中间的曲线表示水流的动态。',
                difficulty: 2
              },
              {
                id: '4',
                type: 'single',
                question: '这个字符代表什么？',
                oracleCharacter: '山',
                options: ['河流', '山峰', '平原', '森林'],
                correctAnswer: '山峰',
                explanation: '字符的形状像山峰的轮廓，有明显的峰顶和斜坡。',
                difficulty: 2
              },
              {
                id: '5',
                type: 'single',
                question: '选择对应的现代汉字：',
                oracleCharacter: '鸟',
                options: ['鱼', '鸟', '虫', '兽'],
                correctAnswer: '鸟',
                explanation: '可以看出鸟的头部、身体、翅膀和尾巴的特征。',
                difficulty: 2
              }
            ]
          };
        
        case 'writing':
          return {
            id: 'writing_001',
            title: '字符书写练习',
            description: '根据现代汉字，选择或书写对应的甲骨文字符',
            timeLimit: 900, // 15分钟
            totalQuestions: 8,
            questions: [
              {
                id: '1',
                type: 'single',
                question: '现代汉字"火"对应哪个甲骨文字符？',
                options: ['🔥', '🌊', '🏔️', '🌳'],
                correctAnswer: '🔥',
                explanation: '火字的甲骨文像燃烧的火焰形状，有向上的火苗。',
                difficulty: 2
              },
              {
                id: '2',
                type: 'input',
                question: '请输入"木"字的甲骨文特征描述：',
                correctAnswer: '像树木的形状',
                explanation: '木字的甲骨文像一棵树，有树干和枝叶。',
                difficulty: 3
              }
            ]
          };
        
        case 'meaning':
          return {
            id: 'meaning_001',
            title: '含义匹配练习',
            description: '将甲骨文字符与正确含义进行匹配',
            timeLimit: 720, // 12分钟
            totalQuestions: 12,
            questions: [
              {
                id: '1',
                type: 'multiple',
                question: '以下哪些是"人"字甲骨文的特征？',
                oracleCharacter: '人',
                options: ['有头部', '有手臂', '有腿部', '呈站立姿态'],
                correctAnswer: ['有头部', '有手臂', '有腿部', '呈站立姿态'],
                explanation: '甲骨文的"人"字确实具备这些人体特征。',
                difficulty: 2
              }
            ]
          };
        
        default:
          return {
            id: 'default_001',
            title: '综合练习',
            description: '综合性练习',
            timeLimit: 600,
            totalQuestions: 5,
            questions: []
          };
      }
    };

    const session = generatePracticeSession(practiceType || 'recognition');
    setPracticeSession(session);
    setTimeLeft(session.timeLimit);
  }, [practiceType]);

  // 倒计时逻辑
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinishPractice();
    }
  }, [timeLeft, isFinished]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (practiceSession && currentQuestionIndex < practiceSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleFinishPractice();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleFinishPractice = () => {
    if (!practiceSession) return;
    
    let correctCount = 0;
    practiceSession.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (question.type === 'multiple') {
        const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        if (correctAnswers.length === userAnswerArray.length) {
          const isCorrect = correctAnswers.every(ans => userAnswerArray.includes(ans));
          if (isCorrect) correctCount++;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      }
    });

    const finalScore = Math.round((correctCount / practiceSession.questions.length) * 100);
    setScore(finalScore);
    setIsFinished(true);
    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeft(practiceSession?.timeLimit || 600);
    setIsFinished(false);
    setShowResult(false);
    setScore(0);
  };

  if (!practiceSession) {
    return <div>加载中...</div>;
  }

  if (showResult) {
    return (
      <div className="practice-result-page bg-ivory min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Result
            icon={score >= 60 ? <TrophyOutlined className="text-gold" /> : <CloseCircleOutlined className="text-red-500" />}
            title={score >= 60 ? "恭喜完成练习！" : "继续努力！"}
            subTitle={`您的得分：${score}分 (${practiceSession.questions.filter(q => userAnswers[q.id] === q.correctAnswer).length}/${practiceSession.questions.length})`}
            extra={[
              <Button key="restart" className="btn-ancient" onClick={handleRestart}>
                重新练习
              </Button>,
              <Button key="back">
                <Link to="/practice">返回练习中心</Link>
              </Button>
            ]}
          />

          {/* 详细结果 */}
          <Card className="ancient-shadow mt-8">
            <Title level={3} className="text-ancient text-center mb-6">答题详情</Title>
            {practiceSession.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="mb-6 pb-4 border-b last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <Text className="font-medium">第{index + 1}题</Text>
                    {isCorrect ? (
                      <CheckCircleOutlined className="text-green-500" />
                    ) : (
                      <CloseCircleOutlined className="text-red-500" />
                    )}
                  </div>
                  <Paragraph className="text-muted-ancient mb-2">{question.question}</Paragraph>
                  {question.oracleCharacter && (
                    <div className="oracle-character text-4xl text-ancient text-center mb-2">
                      {question.oracleCharacter}
                    </div>
                  )}
                  <div className="text-sm">
                    <Text className="text-muted-ancient">您的答案：</Text>
                    <Text className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || '未作答'}
                    </Text>
                  </div>
                  <div className="text-sm">
                    <Text className="text-muted-ancient">正确答案：</Text>
                    <Text className="text-green-600">
                      {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
                    </Text>
                  </div>
                  <div className="text-sm mt-2">
                    <Text className="text-muted-ancient">解析：</Text>
                    <Text>{question.explanation}</Text>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = practiceSession.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / practiceSession.questions.length) * 100;

  return (
    <div className="practice-detail-page bg-ivory min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 面包屑导航 */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> 首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/practice">互动练习</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{practiceSession.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* 练习头部信息 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="ancient-shadow mb-6">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={8}>
                <Title level={3} className="text-ancient mb-0">
                  {practiceSession.title}
                </Title>
                <Text className="text-muted-ancient">{practiceSession.description}</Text>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <Countdown
                    title="剩余时间"
                    value={Date.now() + timeLeft * 1000}
                    format="mm:ss"
                    valueStyle={{ color: timeLeft < 60 ? '#ff4d4f' : '#8B4513' }}
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text className="text-muted-ancient">进度</Text>
                    <Text className="text-ancient font-medium">
                      {currentQuestionIndex + 1}/{practiceSession.questions.length}
                    </Text>
                  </div>
                  <Progress percent={progress} strokeColor="#8B4513" />
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* 题目内容 */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="ancient-shadow mb-6">
              <div className="question-header mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Title level={4} className="text-ancient mb-0">
                    第 {currentQuestionIndex + 1} 题
                  </Title>
                  <Space>
                    <Tag color="blue">
                      {currentQuestion.type === 'single' ? '单选题' : 
                       currentQuestion.type === 'multiple' ? '多选题' : '填空题'}
                    </Tag>
                    <Tag color={currentQuestion.difficulty <= 2 ? 'green' : 
                               currentQuestion.difficulty <= 3 ? 'orange' : 'red'}>
                      {currentQuestion.difficulty <= 2 ? '简单' : 
                       currentQuestion.difficulty <= 3 ? '中等' : '困难'}
                    </Tag>
                  </Space>
                </div>
                <Paragraph className="text-lg text-muted-ancient">
                  {currentQuestion.question}
                </Paragraph>
              </div>

              {/* 甲骨文字符显示 */}
              {currentQuestion.oracleCharacter && (
                <div className="text-center mb-6">
                  <Card className="inline-block ancient-border" bodyStyle={{ padding: '24px' }}>
                    <div className="oracle-character text-8xl text-ancient">
                      {currentQuestion.oracleCharacter}
                    </div>
                  </Card>
                </div>
              )}

              {/* 答题区域 */}
              <div className="answer-area mb-6">
                {currentQuestion.type === 'single' && currentQuestion.options && (
                  <Radio.Group
                    value={userAnswers[currentQuestion.id]}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full"
                  >
                    <Row gutter={[16, 16]}>
                      {currentQuestion.options.map((option, index) => (
                        <Col xs={24} sm={12} key={index}>
                          <Radio value={option} className="text-lg">
                            {option}
                          </Radio>
                        </Col>
                      ))}
                    </Row>
                  </Radio.Group>
                )}

                {currentQuestion.type === 'multiple' && currentQuestion.options && (
                  <Checkbox.Group
                    value={userAnswers[currentQuestion.id] as string[]}
                    onChange={(values) => handleAnswerChange(currentQuestion.id, values)}
                    className="w-full"
                  >
                    <Row gutter={[16, 16]}>
                      {currentQuestion.options.map((option, index) => (
                        <Col xs={24} sm={12} key={index}>
                          <Checkbox value={option} className="text-lg">
                            {option}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                )}

                {currentQuestion.type === 'input' && (
                  <Input.TextArea
                    placeholder="请输入您的答案..."
                    value={userAnswers[currentQuestion.id] as string}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    rows={3}
                    className="text-lg"
                  />
                )}
              </div>

              {/* 解析区域 */}
              {showExplanation && (
                <Alert
                  message="答案解析"
                  description={currentQuestion.explanation}
                  type="info"
                  showIcon
                  className="mb-4"
                />
              )}

              {/* 操作按钮 */}
              <div className="flex justify-between">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  上一题
                </Button>
                
                <Space>
                  <Button onClick={() => setShowExplanation(!showExplanation)}>
                    {showExplanation ? '隐藏解析' : '查看解析'}
                  </Button>
                  
                  {currentQuestionIndex === practiceSession.questions.length - 1 ? (
                    <Button 
                      type="primary" 
                      className="btn-ancient"
                      onClick={handleFinishPractice}
                    >
                      完成练习
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      className="btn-ancient"
                      onClick={handleNextQuestion}
                    >
                      下一题
                    </Button>
                  )}
                </Space>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PracticeDetailPage;