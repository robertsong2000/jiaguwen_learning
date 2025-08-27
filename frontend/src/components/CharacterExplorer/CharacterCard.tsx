import React from 'react';
import { Card, Typography, Tag, Badge, Button, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Character } from '../../store/types';
import OracleImage from '../Common/OracleImage';

const { Title, Text, Paragraph } = Typography;

interface CharacterCardProps {
  character: Character & {
    isFavorited?: boolean;
    isBookmarked?: boolean;
  };
  onClick?: () => void;
  onFavorite?: () => void;
  onBookmark?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  onFavorite,
  onBookmark,
  showActions = true,
  compact = false
}) => {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#52c41a'; // 绿色
      case 2: return '#1890ff'; // 蓝色
      case 3: return '#faad14'; // 橙色
      case 4: return '#fa8c16'; // 深橙色
      case 5: return '#f5222d'; // 红色
      default: return '#d9d9d9';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    const levels = ['', '入门', '初级', '中级', '高级', '专家'];
    return levels[difficulty] || '未知';
  };

  const cardContent = (
    <div className="character-card-content">
      {/* 字符主体 */}
      <div className="text-center mb-4">
        <div className="mb-2 flex justify-center">
          <OracleImage 
            character={character}
            size={compact ? 'small' : 'medium'}
            showFallback={true}
          />
        </div>
        <Title level={3} className="modern-character text-ancient-brown mb-1">
          {character.modernForm}
        </Title>
        <Text className="pronunciation text-gray-600">
          [{character.pronunciation}]
        </Text>
      </div>

      {/* 含义 */}
      <div className="mb-3">
        <Paragraph 
          className="meaning text-gray-700 text-center"
          ellipsis={compact ? { rows: 1 } : { rows: 2 }}
        >
          {character.meaning}
        </Paragraph>
      </div>

      {/* 标签和统计 */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        <Tag color={getDifficultyColor(character.difficulty)}>
          {getDifficultyText(character.difficulty)}
        </Tag>
        <Tag color="blue">{character.category}</Tag>
        {character.tags?.slice(0, 2).map(tag => (
          <Tag key={tag} color="default">{tag}</Tag>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="flex justify-center items-center gap-4 text-gray-500 text-sm mb-3">
        <div className="flex items-center gap-1">
          <EyeOutlined />
          <span>{character.viewCount || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <HeartOutlined />
          <span>{character.favoriteCount || 0}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      {showActions && (
        <div className="flex justify-center gap-2">
          <Tooltip title={character.isFavorited ? '取消收藏' : '收藏'}>
            <Button
              type="text"
              icon={character.isFavorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.();
              }}
            />
          </Tooltip>
          <Tooltip title={character.isBookmarked ? '取消收藏' : '收藏'}>
            <Button
              type="text"
              icon={character.isBookmarked ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.();
              }}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Badge.Ribbon 
        text={`难度${character.difficulty}`} 
        color={getDifficultyColor(character.difficulty)}
      >
        <Card
          className={`character-card cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 ${
            compact ? 'h-48' : 'h-80'
          }`}
          bodyStyle={{ 
            padding: compact ? '16px' : '24px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onClick={onClick}
          hoverable
        >
          {cardContent}
        </Card>
      </Badge.Ribbon>
    </motion.div>
  );
};

export default CharacterCard;