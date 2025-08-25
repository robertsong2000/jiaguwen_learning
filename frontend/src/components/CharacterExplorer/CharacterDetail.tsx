import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Divider, 
  Space,
  Image,
  Tooltip,
  Badge,
  message,
  Spin
} from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  StarOutlined,
  StarFilled,
  BookOutlined,
  EyeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchCharacterById } from '../../store/slices/characterSlice';
import { Character } from '../../store/types';
import CharacterCard from './CharacterCard';

const { Title, Text, Paragraph } = Typography;

interface CharacterDetailProps {
  characterId?: string;
  character?: Character;
  onClose?: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({
  characterId,
  character: propCharacter,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const { selected: selectedCharacter, loading } = useAppSelector(state => state.characters);
  
  const [localLoading, setLocalLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const character = propCharacter || selectedCharacter;

  // 根据ID获取字符详情
  useEffect(() => {
    if (characterId && !propCharacter) {
      const loadCharacter = async () => {
        setLocalLoading(true);
        try {
          await dispatch(fetchCharacterById(characterId)).unwrap();
        } catch (error) {
          message.error('加载字符详情失败');
          console.error('Load character detail error:', error);
        } finally {
          setLocalLoading(false);
        }
      };

      loadCharacter();
    }
  }, [characterId, propCharacter, dispatch]);

  // 播放发音
  const playPronunciation = () => {
    if (audioPlaying) return;
    
    setAudioPlaying(true);
    // TODO: 实现音频播放功能
    setTimeout(() => {
      setAudioPlaying(false);
    }, 1000);
    message.info('发音功能开发中...');
  };

  // 分享字符
  const shareCharacter = () => {
    if (navigator.share && character) {
      navigator.share({
        title: `甲骨文字符：${character.modernForm}`,
        text: `了解甲骨文字符"${character.modernForm}"的含义和演变历史`,
        url: window.location.href
      }).catch(() => {
        // 如果分享失败，复制到剪贴板
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (character) {
      const text = `甲骨文字符：${character.modernForm} (${character.pronunciation}) - ${character.meaning}`;
      navigator.clipboard.writeText(text).then(() => {
        message.success('已复制到剪贴板');
      }).catch(() => {
        message.error('复制失败');
      });
    }
  };

  // 下载字符图片
  const downloadCharacter = () => {
    message.info('下载功能开发中...');
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#52c41a';
      case 2: return '#1890ff';
      case 3: return '#faad14';
      case 4: return '#fa8c16';
      case 5: return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    const levels = ['', '入门', '初级', '中级', '高级', '专家'];
    return levels[difficulty] || '未知';
  };

  const isLoading = loading || localLoading;

  if (isLoading) {
    return (
      <div className="character-detail-loading flex justify-center items-center h-96">
        <Spin size="large" tip="正在加载字符详情..." />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="character-detail-empty text-center py-12">
        <Text type="secondary">未找到字符信息</Text>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="character-detail"
    >
      <Card className="character-detail-card shadow-lg">
        {/* 头部区域 */}
        <Row gutter={[24, 24]}>
          {/* 左侧：字符展示 */}
          <Col xs={24} md={8}>
            <div className="character-display text-center">
              {/* 甲骨文字形 */}
              <div className="oracle-character-large mb-4">
                <Text className="text-8xl font-oracle text-ancient-brown block">
                  {character.oracleForm}
                </Text>
              </div>
              
              {/* 现代字形 */}
              <Title level={1} className="modern-character-large text-ancient-brown mb-2">
                {character.modernForm}
              </Title>
              
              {/* 读音 */}
              <div className="pronunciation-section mb-4">
                <Space size="middle">
                  <Text className="text-xl text-gray-600">
                    [{character.pronunciation}]
                  </Text>
                  <Button
                    type="text"
                    icon={<SoundOutlined />}
                    loading={audioPlaying}
                    onClick={playPronunciation}
                    className="text-blue-500"
                  />
                </Space>
              </div>

              {/* 操作按钮 */}
              <Space size="middle" className="mb-4">
                <Tooltip title="收藏">
                  <Button
                    type={character.isFavorited ? 'primary' : 'default'}
                    icon={character.isFavorited ? <HeartFilled /> : <HeartOutlined />}
                    onClick={() => message.info('收藏功能开发中...')}
                  />
                </Tooltip>
                <Tooltip title="收藏">
                  <Button
                    type={character.isBookmarked ? 'primary' : 'default'}
                    icon={character.isBookmarked ? <StarFilled /> : <StarOutlined />}
                    onClick={() => message.info('收藏功能开发中...')}
                  />
                </Tooltip>
                <Tooltip title="分享">
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={shareCharacter}
                  />
                </Tooltip>
                <Tooltip title="下载">
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={downloadCharacter}
                  />
                </Tooltip>
              </Space>

              {/* 统计信息 */}
              <div className="statistics">
                <Space split={<Divider type="vertical" />}>
                  <div className="flex items-center gap-1">
                    <EyeOutlined className="text-gray-400" />
                    <Text type="secondary">{character.viewCount || 0}</Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <HeartOutlined className="text-gray-400" />
                    <Text type="secondary">{character.favoriteCount || 0}</Text>
                  </div>
                </Space>
              </div>
            </div>
          </Col>

          {/* 右侧：详细信息 */}
          <Col xs={24} md={16}>
            <div className="character-info">
              {/* 基本信息 */}
              <div className="basic-info mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    count={getDifficultyText(character.difficulty)}
                    style={{ backgroundColor: getDifficultyColor(character.difficulty) }}
                  />
                  <Tag color="blue" className="text-sm">{character.category}</Tag>
                  {character.tags?.map(tag => (
                    <Tag key={tag} color="default">{tag}</Tag>
                  ))}
                </div>

                {/* 含义解释 */}
                <Title level={4} className="text-ancient-brown">含义解释</Title>
                <Paragraph className="text-base text-gray-700 mb-4">
                  {character.meaning}
                </Paragraph>
              </div>

              {/* 字源演变 */}
              {character.etymology && (
                <div className="etymology mb-6">
                  <Title level={4} className="text-ancient-brown">字源演变</Title>
                  <Paragraph className="text-base text-gray-700">
                    {character.etymology}
                  </Paragraph>
                </div>
              )}

              {/* 历史背景 */}
              {character.historicalContext && (
                <div className="historical-context mb-6">
                  <Title level={4} className="text-ancient-brown">历史背景</Title>
                  <Paragraph className="text-base text-gray-700">
                    {character.historicalContext}
                  </Paragraph>
                </div>
              )}

              {/* 笔画顺序 */}
              {character.strokeOrder && character.strokeOrder.length > 0 && (
                <div className="stroke-order mb-6">
                  <Title level={4} className="text-ancient-brown">笔画顺序</Title>
                  <div className="flex flex-wrap gap-2">
                    {character.strokeOrder.map((stroke, index) => (
                      <div 
                        key={index}
                        className="stroke-item bg-gray-100 px-3 py-1 rounded text-lg font-mono"
                      >
                        {index + 1}. {stroke}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* 相关字符 */}
        {character.relatedCharacters && character.relatedCharacters.length > 0 && (
          <>
            <Divider />
            <div className="related-characters">
              <Title level={4} className="text-ancient-brown mb-4">相关字符</Title>
              <Row gutter={[16, 16]}>
                {character.relatedCharacters.map((relatedChar: any) => (
                  <Col key={relatedChar._id} xs={12} sm={8} md={6} lg={4}>
                    <CharacterCard
                      character={relatedChar}
                      onClick={() => message.info('跳转功能开发中...')}
                      showActions={false}
                      compact={true}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default CharacterDetail;