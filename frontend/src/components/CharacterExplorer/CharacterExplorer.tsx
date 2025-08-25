import React, { useEffect, useState } from 'react';
import { Layout, Typography, Modal, Button, Affix, Space } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchCharacters, setSelectedCharacter } from '../../store/slices/characterSlice';
import CharacterGrid from './CharacterGrid';
import CharacterDetail from './CharacterDetail';
import CharacterSearch from './CharacterSearch';
import { Character } from '../../store/types';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const CharacterExplorer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: characters, loading, selected: selectedCharacter, filters } = useAppSelector(state => state.characters);
  
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    dispatch(fetchCharacters({}));
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCharacterClick = (character: Character) => {
    dispatch(setSelectedCharacter(character));
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    dispatch(setSelectedCharacter(null));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const getFilterStats = () => {
    let stats = '';
    const hasFilters = filters.searchQuery || filters.category || filters.difficulty;
    
    if (hasFilters) {
      stats += '筛选结果: ';
    }
    
    if (filters.searchQuery) {
      stats += `"${filters.searchQuery}" `;
    }
    
    if (filters.category) {
      stats += `${filters.category}类 `;
    }
    
    if (filters.difficulty && filters.difficulty.length > 0) {
      const difficultyText = filters.difficulty.length === 1 
        ? `难度${filters.difficulty[0]}级`
        : `难度${Math.min(...filters.difficulty)}-${Math.max(...filters.difficulty)}级`;
      stats += difficultyText;
    }
    
    return stats.trim();
  };

  return (
    <div className="character-explorer min-h-screen bg-ivory">
      <Content className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-header text-center mb-8"
        >
          <Title level={1} className="text-ancient-brown mb-4">
            甲骨文字符探索
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            探索中国古代文字的奥秘，了解每个甲骨文字符的演变历史、文化内涵和深层含义。
            通过分类浏览和智能搜索，发现汉字的源头之美。
          </Paragraph>
        </motion.div>

        <CharacterSearch onSearch={handleSearch} />

        {getFilterStats() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="filter-stats mb-4"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-blue-700 font-medium">{getFilterStats()}</span>
              <span className="text-blue-600 ml-2">共找到 {characters.length} 个字符</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CharacterGrid onCharacterClick={handleCharacterClick} />
        </motion.div>

        {!loading && characters.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="learning-suggestions mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-ancient-brown/10 to-vermillion/10 rounded-lg p-8">
              <Title level={3} className="text-ancient-brown mb-4">
                没有找到相关字符？
              </Title>
              <Paragraph className="text-gray-600 mb-6">
                尝试调整搜索词或筛选条件，或者从以下建议开始探索：
              </Paragraph>
              <Space wrap size="middle">
                <Button 
                  type="primary" 
                  className="bg-ancient-brown border-ancient-brown"
                  onClick={() => handleSearch('人')}
                >
                  搜索"人"字
                </Button>
                <Button onClick={() => handleSearch('水')}>
                  搜索"水"字
                </Button>
                <Button onClick={() => handleSearch('日')}>
                  搜索"日"字
                </Button>
              </Space>
            </div>
          </motion.div>
        )}

        {!loading && characters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="learning-stats mt-12"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <Title level={4} className="text-ancient-brown mb-4 text-center">
                学习小贴士
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {characters.filter(c => c.difficulty <= 2).length}
                  </div>
                  <div className="text-gray-600">适合入门的字符</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {characters.filter(c => c.category === '人物').length}
                  </div>
                  <div className="text-gray-600">人物相关字符</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {characters.filter(c => c.category === '自然').length}
                  </div>
                  <div className="text-gray-600">自然相关字符</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Content>

      <Modal
        title={null}
        open={detailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={1000}
        className="character-detail-modal"
        destroyOnClose
      >
        {selectedCharacter && (
          <CharacterDetail 
            character={selectedCharacter}
            onClose={closeDetailModal}
          />
        )}
      </Modal>

      <Affix offsetBottom={24}>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: showBackToTop ? 1 : 0,
            scale: showBackToTop ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            size="large"
            onClick={scrollToTop}
            className="bg-ancient-brown border-ancient-brown shadow-lg"
            style={{ 
              position: 'fixed',
              right: 24,
              bottom: 24,
              zIndex: 1000
            }}
          />
        </motion.div>
      </Affix>
    </div>
  );
};

export default CharacterExplorer;