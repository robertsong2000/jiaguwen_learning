import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/userSlice';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, profile } = useAppSelector((state) => state.user);

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/explore',
      label: <Link to="/explore">探索字符</Link>,
    },
    {
      key: '/learn',
      label: <Link to="/learn">系统学习</Link>,
    },
    {
      key: '/practice',
      label: <Link to="/practice">互动练习</Link>,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人资料</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-md px-0">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="oracle-character text-2xl font-bold text-ancient-brown">
              甲
            </div>
            <span className="text-xl font-bold text-ancient-brown hidden sm:inline">
              甲骨文学习
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="border-none justify-center bg-transparent"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="cursor-pointer">
                <Space>
                  <Avatar 
                    src={profile?.profile.avatar} 
                    icon={<UserOutlined />}
                    className="bg-ancient-brown"
                  />
                  <span className="text-ancient-brown">
                    {profile?.profile.displayName || profile?.username}
                  </span>
                </Space>
              </div>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text">
                <Link to="/login">登录</Link>
              </Button>
              <Button type="primary" className="bg-ancient-brown border-ancient-brown">
                <Link to="/register">注册</Link>
              </Button>
            </Space>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;