import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Spin, Empty, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchCharacters, setPage } from '../../store/slices/characterSlice';
import { Character } from '../../store/types';
import CharacterCard from './CharacterCard';

interface CharacterGridProps {
  onCharacterClick?: (character: Character) => void;
  compact?: boolean;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({
  onCharacterClick,
  compact = false
}) => {
  const dispatch = useAppDispatch();
  const { 
    list: characters, 
    loading, 
    pagination, 
    filters, 
    error 
  } = useAppSelector(state => state.characters);
  
  const [localLoading, setLocalLoading] = useState(false);

  // 加载字符数据
  useEffect(() => {
    const loadCharacters = async () => {
      setLocalLoading(true);
      try {
        await dispatch(fetchCharacters({
          page: pagination.page,
          limit: pagination.limit,
          filters
        })).unwrap();
      } catch (error) {
        message.error('加载字符数据失败');
        console.error('Load characters error:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadCharacters();
  }, [dispatch, pagination.page, pagination.limit, filters]);

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    dispatch(setPage(page));
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理字符收藏
  const handleFavorite = async (character: Character) => {
    try {
      // TODO: 实现收藏功能
      message.success(`${character.isFavorited ? '取消收藏' : '收藏'}成功`);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  // 处理字符书签
  const handleBookmark = async (character: Character) => {
    try {
      // TODO: 实现书签功能
      message.success(`${character.isBookmarked ? '取消书签' : '添加书签'}成功`);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const isLoading = loading || localLoading;

  // 如果出错且没有数据，显示错误状态
  if (error && characters.length === 0) {
    return (
      <div className="character-grid-error text-center py-12">
        <Empty
          description="加载字符数据时出现错误"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  // 如果没有数据且不在加载中，显示空状态
  if (!isLoading && characters.length === 0) {
    return (
      <div className="character-grid-empty text-center py-12">
        <Empty
          description="暂无字符数据"
          image={Empty.PRESENTED_IMAGE_DEFAULT}
        />
      </div>
    );
  }

  return (
    <div className="character-grid">
      {/* 加载指示器 */}
      <Spin 
        spinning={isLoading} 
        tip="正在加载字符数据..."
        size="large"
      >
        {/* 字符网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Row gutter={[16, 16]} className="mb-8">
            <AnimatePresence mode="popLayout">
              {characters.map((character, index) => (
                <Col
                  key={character._id}
                  xs={24}
                  sm={12}
                  md={compact ? 8 : 6}
                  lg={compact ? 6 : 4}
                  xl={compact ? 4 : 4}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05 // 错开动画时间
                    }}
                    layout
                  >
                    <CharacterCard
                      character={character}
                      onClick={() => onCharacterClick?.(character)}
                      onFavorite={() => handleFavorite(character)}
                      onBookmark={() => handleBookmark(character)}
                      compact={compact}
                    />
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>
        </motion.div>
      </Spin>

      {/* 分页组件 */}
      {!isLoading && characters.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 项，共 ${total} 个字符`
            }
            className="character-grid-pagination"
          />
        </motion.div>
      )}

      {/* 加载更多提示 */}
      {isLoading && characters.length > 0 && (
        <div className="text-center py-4">
          <Spin tip="正在加载更多字符..." />
        </div>
      )}
    </div>
  );
};

export default CharacterGrid;