import React from 'react';
import { Typography, Button, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { BookOutlined, ExperimentOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.div 
        className="hero-section ancient-gradient py-20 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Title level={1} className="text-5xl font-bold mb-6 text-ancient oracle-character-large">
              甲骨文学习
            </Title>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Title level={2} className="text-3xl font-bold mb-6 text-ancient">
              探索甲骨文的奥秘
            </Title>
            <Paragraph className="text-xl mb-8 text-secondary-ancient max-w-2xl mx-auto">
              通过现代化的学习方式，深入了解中国古代文字的魅力与智慧
            </Paragraph>
          </motion.div>
          <motion.div 
            className="space-x-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button 
              type="primary" 
              size="large" 
              className="btn-ancient hover-lift mr-4"
            >
              <Link to="/learn">开始学习</Link>
            </Button>
            <Button 
              size="large" 
              className="border-ancient-brown text-ancient hover:bg-ancient-brown hover:text-white transition-all duration-300"
            >
              <Link to="/explore">探索字符</Link>
            </Button>
          </motion.div>
        </div>
        {/* 装饰性背景元素 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="oracle-character" style={{ fontSize: '20rem', position: 'absolute', top: '10%', left: '5%', color: '#8B4513' }}>甲</div>
          <div className="oracle-character" style={{ fontSize: '15rem', position: 'absolute', bottom: '10%', right: '5%', color: '#A0522D' }}>骨</div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="features-section py-16 bg-ivory"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Title level={2} className="text-center mb-12 text-ancient modern-character-large">
              学习功能
            </Title>
          </motion.div>
          <Row gutter={[32, 32]}>
            {[
              {
                icon: SearchOutlined,
                title: '字符探索',
                description: '浏览和搜索甲骨文字符，了解每个字符的含义、演变历史和文化背景。',
                link: '/explore',
                linkText: '开始探索',
                delay: 0.2
              },
              {
                icon: BookOutlined,
                title: '系统学习', 
                description: '通过结构化的课程，循序渐进地学习甲骨文，掌握古文字的精髓。',
                link: '/learn',
                linkText: '开始学习',
                delay: 0.4
              },
              {
                icon: ExperimentOutlined,
                title: '互动练习',
                description: '通过各种练习形式，包括识别、书写和含义匹配，巩固所学知识。',
                link: '/practice', 
                linkText: '开始练习',
                delay: 0.6
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: feature.delay, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className="text-center h-full ancient-shadow hover-lift ancient-border"
                      cover={
                        <div className="py-8">
                          <IconComponent className="text-6xl text-ancient" />
                        </div>
                      }
                    >
                      <Title level={3} className="text-ancient modern-character">{feature.title}</Title>
                      <Paragraph className="text-muted-ancient mb-6">
                        {feature.description}
                      </Paragraph>
                      <Button type="primary" className="btn-ancient">
                        <Link to={feature.link}>{feature.linkText}</Link>
                      </Button>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div 
        className="stats-section py-16 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2F4F4F 0%, #1C3333 100%)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]} className="text-center relative z-10">
            {[
              { number: '3000+', label: '甲骨文字符', delay: 0.2 },
              { number: '50+', label: '学习课程', delay: 0.4 },
              { number: '10000+', label: '学习者', delay: 0.6 },
              { number: '95%', label: '满意度', delay: 0.8 }
            ].map((stat, index) => (
              <Col xs={24} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: stat.delay, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Title level={2} className="mb-2" style={{ color: '#FFD700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {stat.number}
                  </Title>
                  <Paragraph className="text-ivory text-lg">{stat.label}</Paragraph>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
        {/* 装饰性背景 */}
        <div className="absolute inset-0 opacity-5">
          <div className="oracle-character" style={{ fontSize: '25rem', position: 'absolute', top: '-10%', left: '-5%', color: 'white' }}>文</div>
          <div className="oracle-character" style={{ fontSize: '20rem', position: 'absolute', bottom: '-5%', right: '-5%', color: 'white' }}>字</div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;