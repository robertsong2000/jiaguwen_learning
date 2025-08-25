import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page p-6">
      <Title level={2}>个人资料</Title>
      <p>这里将显示用户学习进度和成就...</p>
    </div>
  );
};

export default ProfilePage;