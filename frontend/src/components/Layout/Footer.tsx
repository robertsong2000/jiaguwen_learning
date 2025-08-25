import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { GithubOutlined, WeiboOutlined, WechatOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="bg-dark-green text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Title level={4} className="text-gold mb-4">
              甲骨文学习
            </Title>
            <Text className="text-ivory">
              传承中华古代文字文化，通过现代化的学习方式探索甲骨文的奥秘。
            </Text>
          </Col>
          
          <Col xs={24} md={6}>
            <Title level={5} className="text-ivory mb-4">
              学习资源
            </Title>
            <div className="space-y-2">
              <div><Link href="/explore" className="text-ivory hover:text-gold">字符探索</Link></div>
              <div><Link href="/learn" className="text-ivory hover:text-gold">系统学习</Link></div>
              <div><Link href="/practice" className="text-ivory hover:text-gold">互动练习</Link></div>
              <div><Link href="/help" className="text-ivory hover:text-gold">学习帮助</Link></div>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <Title level={5} className="text-ivory mb-4">
              关于我们
            </Title>
            <div className="space-y-2">
              <div><Link href="/about" className="text-ivory hover:text-gold">项目介绍</Link></div>
              <div><Link href="/team" className="text-ivory hover:text-gold">团队成员</Link></div>
              <div><Link href="/contact" className="text-ivory hover:text-gold">联系我们</Link></div>
              <div><Link href="/feedback" className="text-ivory hover:text-gold">意见反馈</Link></div>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <Title level={5} className="text-ivory mb-4">
              关注我们
            </Title>
            <Space size="large">
              <GithubOutlined className="text-xl text-ivory hover:text-gold cursor-pointer" />
              <WeiboOutlined className="text-xl text-ivory hover:text-gold cursor-pointer" />
              <WechatOutlined className="text-xl text-ivory hover:text-gold cursor-pointer" />
            </Space>
          </Col>
        </Row>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <Text className="text-ivory">
            © 2024 甲骨文学习平台. 保留所有权利.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;