import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser } from '../store/slices/userSlice';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { loading, isAuthenticated, error } = useAppSelector(state => state.user);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 如果已经登录，重定向到目标页面或首页
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // 处理登录表单提交
  const handleSubmit = async (values: LoginFormData) => {
    setSubmitLoading(true);
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success('登录成功！');
      
      // 重定向到目标页面或首页
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查邮箱和密码');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 演示账号登录
  const handleDemoLogin = () => {
    form.setFieldsValue({
      email: 'demo@jiaguwen.com',
      password: 'demo123'
    });
    message.info('已填入演示账号，点击登录即可体验');
  };

  return (
    <div className="login-page min-h-screen bg-gradient-to-br from-ivory via-white to-ancient-brown/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* 头部装饰 */}
          <div className="bg-gradient-to-r from-ancient-brown to-vermillion p-6 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-4"
            >
              <div className="text-4xl font-oracle mb-2">甲</div>
            </motion.div>
            <Title level={2} className="text-white mb-2">
              甲骨文学习
            </Title>
            <Text className="text-ivory">
              探索中华古代文字的奥秘
            </Text>
          </div>

          {/* 登录表单 */}
          <div className="p-8">
            <div className="text-center mb-6">
              <Title level={3} className="text-ancient-brown mb-2">
                用户登录
              </Title>
              <Text type="secondary">
                欢迎回来，继续您的甲骨文学习之旅
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="请输入邮箱地址"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item className="mb-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading || loading}
                  block
                  className="bg-ancient-brown border-ancient-brown hover:bg-ancient-brown/90 h-12 text-lg font-medium"
                >
                  {submitLoading || loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            {/* 演示账号 */}
            <div className="text-center mb-4">
              <Button
                type="link"
                onClick={handleDemoLogin}
                className="text-blue-600 hover:text-blue-700"
              >
                使用演示账号登录
              </Button>
            </div>

            <Divider className="my-6">
              <span className="text-gray-400 px-4">还没有账号？</span>
            </Divider>

            {/* 注册链接 */}
            <div className="text-center">
              <Link to="/register">
                <Button type="default" block size="large" className="h-12">
                  立即注册
                </Button>
              </Link>
            </div>

            {/* 其他链接 */}
            <div className="flex justify-center space-x-4 mt-6 text-sm">
              <Link to="/" className="text-gray-500 hover:text-ancient-brown">
                返回首页
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/forgot-password" className="text-gray-500 hover:text-ancient-brown">
                忘记密码
              </Link>
            </div>
          </div>
        </Card>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <div>通过登录，您同意我们的</div>
          <div className="space-x-2">
            <Link to="/terms" className="hover:text-ancient-brown">服务条款</Link>
            <span>和</span>
            <Link to="/privacy" className="hover:text-ancient-brown">隐私政策</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;