import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Progress } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store';
import { registerUser } from '../store/slices/userSlice';

const { Title, Text } = Typography;

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { loading, isAuthenticated } = useAppSelector(state => state.user);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
    return strength;
  };

  // 处理注册表单提交
  const handleSubmit = async (values: RegisterFormData) => {
    setSubmitLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;
      await dispatch(registerUser(registerData)).unwrap();
      
      message.success('注册成功！欢迎加入甲骨文学习之旅！');
      navigate('/', { replace: true });
    } catch (error: any) {
      message.error(error.message || '注册失败，请重试');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 获取密码强度颜色
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return '#ff4d4f';
    if (passwordStrength <= 50) return '#faad14';
    if (passwordStrength <= 75) return '#1890ff';
    return '#52c41a';
  };

  // 获取密码强度文本
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return '弱';
    if (passwordStrength <= 50) return '中等';
    if (passwordStrength <= 75) return '强';
    return '很强';
  };

  return (
    <div className="register-page min-h-screen bg-gradient-to-br from-ivory via-white to-ancient-brown/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* 头部装饰 */}
          <div className="bg-gradient-to-r from-ancient-brown to-vermillion p-6 text-center text-white">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-4"
            >
              <div className="text-4xl font-oracle mb-2">文</div>
            </motion.div>
            <Title level={2} className="text-white mb-2">
              加入我们
            </Title>
            <Text className="text-ivory">
              开启您的甲骨文学习之旅
            </Text>
          </div>

          {/* 注册表单 */}
          <div className="p-8">
            <div className="text-center mb-6">
              <Title level={3} className="text-ancient-brown mb-2">
                创建账号
              </Title>
              <Text type="secondary">
                填写以下信息，开始探索古代文字的魅力
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              scrollToFirstError
            >
              <Form.Item
                name="displayName"
                label="显示名称"
                rules={[
                  { required: true, message: '请输入显示名称' },
                  { min: 2, message: '显示名称至少2个字符' },
                  { max: 20, message: '显示名称最多20个字符' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入您的显示名称"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { max: 20, message: '用户名最多20个字符' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入用户名"
                  autoComplete="username"
                />
              </Form.Item>

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
                  autoComplete="new-password"
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                />
              </Form.Item>

              {/* 密码强度指示器 */}
              {passwordStrength > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <Text type="secondary" className="text-sm">密码强度</Text>
                    <Text 
                      style={{ color: getPasswordStrengthColor() }}
                      className="text-sm font-medium"
                    >
                      {getPasswordStrengthText()}
                    </Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getPasswordStrengthColor()}
                    showInfo={false}
                    size="small"
                  />
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请再次输入密码"
                  autoComplete="new-password"
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
                  {submitLoading || loading ? '注册中...' : '立即注册'}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="my-6">
              <span className="text-gray-400 px-4">已有账号？</span>
            </Divider>

            {/* 登录链接 */}
            <div className="text-center">
              <Link to="/login">
                <Button type="default" block size="large" className="h-12">
                  立即登录
                </Button>
              </Link>
            </div>

            {/* 其他链接 */}
            <div className="flex justify-center space-x-4 mt-6 text-sm">
              <Link to="/" className="text-gray-500 hover:text-ancient-brown">
                返回首页
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/about" className="text-gray-500 hover:text-ancient-brown">
                关于我们
              </Link>
            </div>
          </div>
        </Card>

        {/* 注册优势 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <Title level={4} className="text-ancient-brown mb-4">
                注册即可享受
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <span>个性化学习进度</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <span>收藏喜爱字符</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <span>学习成就系统</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          <div>注册即表示您同意我们的</div>
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

export default RegisterPage;