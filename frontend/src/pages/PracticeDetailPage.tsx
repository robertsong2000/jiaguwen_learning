import React, { useState, useEffect, useCallback } from 'react';
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
  Tag
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  TrophyOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import OracleImage from '../components/Common/OracleImage';

const { Title, Paragraph, Text } = Typography;
const { Countdown } = Statistic;

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'input';
  question: string;
  oracleCharacter?: string;
  modernCharacter?: string; // 用于显示现代汉字
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
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleFinishPractice = useCallback(() => {
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
  }, [practiceSession, userAnswers]);

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
                oracleCharacter: '人', // 对应的现代字符，用于获取甲骨文图片
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
                oracleCharacter: '火',
                options: ['水', '火', '土', '木'],
                correctAnswer: '火',
                explanation: '可以看出火焰向上燃烧的动态形状，是典型的火字甲骨文。',
                difficulty: 2
              },
              {
                id: '6',
                type: 'single',
                question: '这个甲骨文字符是？',
                oracleCharacter: '木',
                options: ['草', '木', '竹', '花'],
                correctAnswer: '木',
                explanation: '字符像一棵树的形状，有树干、树根和树枝，是木字的甲骨文。',
                difficulty: 2
              },
              {
                id: '7',
                type: 'single',
                question: '请选择正确答案：',
                oracleCharacter: '大',
                options: ['小', '中', '大', '少'],
                correctAnswer: '大',
                explanation: '这个字符像一个人张开双臂双腿站立的样子，表示人的最大形态。',
                difficulty: 1
              },
              {
                id: '8',
                type: 'single',
                question: '这个字符的含义是？',
                oracleCharacter: '月',
                options: ['太阳', '月亮', '星星', '彩虹'],
                correctAnswer: '月亮',
                explanation: '字符像月牙的形状，弯弯的弧形很好地表现了月亮的特征。',
                difficulty: 1
              },
              {
                id: '9',
                type: 'single',
                question: '选择对应的现代汉字：',
                oracleCharacter: '土',
                options: ['石', '土', '沙', '泥'],
                correctAnswer: '土',
                explanation: '这个字符像一个土堆的形状，或者是神位的象征。',
                difficulty: 2
              },
              {
                id: '10',
                type: 'single',
                question: '这个甲骨文字符代表？',
                oracleCharacter: '女',
                options: ['男', '女', '老', '少'],
                correctAnswer: '女',
                explanation: '字符像一个跪坐的女性形象，双手交叉在胸前，体现了古代女性的典型姿态。',
                difficulty: 1
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
                modernCharacter: '火', // 现代汉字用于题目显示
                options: ['火', '水', '土', '木'], // 甲骨文选项（现代字标识）
                correctAnswer: '火',
                explanation: '火字的甲骨文像燃烧的火焰形状，有向上的火苗。',
                difficulty: 2
              },
              {
                id: '2',
                type: 'single',
                question: '现代汉字"水"对应哪个甲骨文字符？',
                modernCharacter: '水',
                options: ['山', '水', '日', '月'],
                correctAnswer: '水',
                explanation: '水字的甲骨文像流动的水流，中间一竖代表主流，两边的点代表水滴。',
                difficulty: 2
              },
              {
                id: '3',
                type: 'single',
                question: '现代汉字"山"对应哪个甲骨文字符？',
                modernCharacter: '山',
                options: ['土', '山', '石', '丘'],
                correctAnswer: '山',
                explanation: '山字的甲骨文像山峰的轮廓，三个突起代表连绵的山峰。',
                difficulty: 2
              },
              {
                id: '4',
                type: 'single',
                question: '现代汉字"人"对应哪个甲骨文字符？',
                modernCharacter: '人',
                options: ['大', '人', '女', '子'],
                correctAnswer: '人',
                explanation: '人字的甲骨文像一个侧身而立的人形，突出了人的直立行走特征。',
                difficulty: 1
              },
              {
                id: '5',
                type: 'single',
                question: '现代汉字"日"对应哪个甲骨文字符？',
                modernCharacter: '日',
                options: ['月', '日', '星', '云'],
                correctAnswer: '日',
                explanation: '日字的甲骨文像太阳的形状，圆形中间有一点，代表太阳的光芒。',
                difficulty: 1
              },
              {
                id: '6',
                type: 'single',
                question: '现代汉字"月"对应哪个甲骨文字符？',
                modernCharacter: '月',
                options: ['日', '月', '星', '云'],
                correctAnswer: '月',
                explanation: '月字的甲骨文像月牙的形状，弯弯的弧形很好地表现了月亮的特征。',
                difficulty: 1
              },
              {
                id: '7',
                type: 'input',
                question: '请输入"木"字甲骨文的特征描述：',
                modernCharacter: '木',
                correctAnswer: '像树木的形状',
                explanation: '木字的甲骨文像一棵树，有树干和枝叶。',
                difficulty: 3
              },
              {
                id: '8',
                type: 'input',
                question: '请输入"女"字甲骨文的主要特征：',
                modernCharacter: '女',
                correctAnswer: '跪坐的女性形象',
                explanation: '女字的甲骨文像一个跪坐的女性形象，双手交叉在胸前。',
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
              },
              {
                id: '2',
                type: 'multiple',
                question: '以下哪些是"日"字甲骨文的特征？',
                oracleCharacter: '日',
                options: ['圆形或方形', '中间有点或线', '表示光芒', '像太阳形状'],
                correctAnswer: ['圆形或方形', '中间有点或线', '表示光芒', '像太阳形状'],
                explanation: '甲骨文的"日"字确实具备这些太阳的特征。',
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
  }, [timeLeft, isFinished, handleFinishPractice]);

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
                    <div className="text-center mb-2">
                      <OracleImage 
                        character={{
                          modernForm: question.oracleCharacter,
                          imageUrl: `/images/oracle/${question.oracleCharacter}.png`,
                          hasImage: true,
                          imageAlt: `${question.oracleCharacter}字的甲骨文字形`
                        }}
                        size="medium"
                        showFallback={true}
                      />
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

              {/* 现代汉字显示（用于字符书写练习） */}
              {currentQuestion.modernCharacter && (
                <div className="text-center mb-6">
                  <Card className="inline-block ancient-border" bodyStyle={{ padding: '24px' }}>
                    <div className="modern-character text-8xl text-ancient font-bold">
                      {currentQuestion.modernCharacter}
                    </div>
                    <div className="text-sm text-muted-ancient mt-2">
                      现代汉字
                    </div>
                  </Card>
                </div>
              )}

              {/* 甲骨文字符显示 */}
              {currentQuestion.oracleCharacter && (
                <div className="text-center mb-6">
                  <Card className="inline-block ancient-border" bodyStyle={{ padding: '24px' }}>
                    <OracleImage 
                      character={{
                        modernForm: currentQuestion.oracleCharacter,
                        imageUrl: `/images/oracle/${currentQuestion.oracleCharacter}.png`,
                        hasImage: true,
                        imageAlt: `${currentQuestion.oracleCharacter}字的甲骨文字形`
                      }}
                      size="large"
                      showFallback={true}
                    />
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
                          <Card 
                            className={`cursor-pointer oracle-option-card transition-all duration-300 hover:shadow-lg ${
                              userAnswers[currentQuestion.id] === option ? 'border-ancient bg-ancient-light' : 'border-gray-300'
                            }`}
                            bodyStyle={{ padding: '16px' }}
                            onClick={() => handleAnswerChange(currentQuestion.id, option)}
                          >
                            <Radio 
                              value={option} 
                              className="hidden"
                              checked={userAnswers[currentQuestion.id] === option}
                            />
                            <div className="text-center">
                              <div className="oracle-image-container mb-3">
                                <OracleImage 
                                  character={{
                                    modernForm: option,
                                    imageUrl: `/images/oracle/${option}.png`,
                                    hasImage: true,
                                    imageAlt: `${option}字的甲骨文字形`
                                  }}
                                  size="medium"
                                  showFallback={true}
                                />
                              </div>
                              <div className="text-lg font-medium text-ancient">{option}</div>
                              <div className="text-sm text-muted-ancient">现代汉字</div>
                            </div>
                          </Card>
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
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = (userAnswers[currentQuestion.id] as string[] || []).includes(option);
                        return (
                          <Col xs={24} sm={12} md={8} key={index}>
                            <Card 
                              className={`cursor-pointer oracle-option-card transition-all duration-300 hover:shadow-lg ${
                                isSelected ? 'border-ancient bg-ancient-light' : 'border-gray-300'
                              }`}
                              bodyStyle={{ padding: '16px' }}
                              onClick={() => {
                                const currentValues = (userAnswers[currentQuestion.id] as string[]) || [];
                                const newValues = currentValues.includes(option)
                                  ? currentValues.filter(v => v !== option)
                                  : [...currentValues, option];
                                handleAnswerChange(currentQuestion.id, newValues);
                              }}
                            >
                              <Checkbox 
                                value={option} 
                                className="hidden"
                                checked={isSelected}
                              />
                              <div className="text-center">
                                <div className="oracle-image-container mb-3">
                                  <OracleImage 
                                    character={{
                                      modernForm: option,
                                      imageUrl: `/images/oracle/${option}.png`,
                                      hasImage: true,
                                      imageAlt: `${option}字的甲骨文字形`
                                    }}
                                    size="medium"
                                    showFallback={true}
                                  />
                                </div>
                                <div className="text-lg font-medium text-ancient">{option}</div>
                                <div className="text-sm text-muted-ancient">现代汉字</div>
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
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