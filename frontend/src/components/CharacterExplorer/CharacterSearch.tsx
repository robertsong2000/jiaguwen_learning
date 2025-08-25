import React, { useState, useCallback } from 'react';
import { 
  Input, 
  Select, 
  Slider, 
  Button, 
  Space, 
  Card, 
  Collapse,
  Tag,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined,
  DownOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateFilters, clearFilters } from '../../store/slices/characterSlice';
import { FilterConfig } from '../../store/types';

const { Option } = Select;
const { Panel } = Collapse;
const { Text } = Typography;

interface CharacterSearchProps {
  onSearch?: (query: string) => void;
  compact?: boolean;
}

const CharacterSearch: React.FC<CharacterSearchProps> = ({ 
  onSearch, 
  compact = false 
}) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.characters);
  
  const [searchValue, setSearchValue] = useState(filters.searchQuery || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 分类选项
  const categories = [
    '人物', '动物', '植物', '器物', '自然', '建筑', '抽象概念', '其他'
  ];

  // 难度标签
  const difficultyLabels: { [key: number]: string } = {
    1: '入门',
    2: '初级', 
    3: '中级',
    4: '高级',
    5: '专家'
  };

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setSearchValue(trimmedValue);
    
    dispatch(updateFilters({ 
      searchQuery: trimmedValue || undefined 
    }));
    
    onSearch?.(trimmedValue);
  }, [dispatch, onSearch]);

  // 处理分类筛选
  const handleCategoryChange = (category: string | undefined) => {
    dispatch(updateFilters({ category }));
  };

  // 处理难度筛选
  const handleDifficultyChange = (difficulty: number[]) => {
    dispatch(updateFilters({ 
      difficulty: difficulty.length > 0 ? difficulty : undefined 
    }));
  };

  // 清除所有筛选
  const handleClearFilters = () => {
    setSearchValue('');
    dispatch(clearFilters());
  };

  // 获取当前筛选标签
  const getFilterTags = () => {
    const tags = [];
    
    if (filters.searchQuery) {
      tags.push({
        key: 'search',
        label: `搜索: ${filters.searchQuery}`,
        closable: true,
        onClose: () => {
          setSearchValue('');
          dispatch(updateFilters({ searchQuery: undefined }));
        }
      });
    }
    
    if (filters.category) {
      tags.push({
        key: 'category',
        label: `分类: ${filters.category}`,
        closable: true,
        onClose: () => dispatch(updateFilters({ category: undefined }))
      });
    }
    
    if (filters.difficulty && filters.difficulty.length > 0) {
      const difficultyText = filters.difficulty
        .map(d => difficultyLabels[d])
        .join(', ');
      tags.push({
        key: 'difficulty',
        label: `难度: ${difficultyText}`,
        closable: true,
        onClose: () => dispatch(updateFilters({ difficulty: undefined }))
      });
    }
    
    return tags;
  };

  const filterTags = getFilterTags();
  const hasFilters = filterTags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="character-search mb-6"
    >
      <Card className="search-card">
        {/* 主搜索区域 */}
        <div className="main-search mb-4">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={16} md={18}>
              <Input.Search
                placeholder="搜索甲骨文字符（支持现代汉字、读音、含义）"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                onPressEnter={() => handleSearch(searchValue)}
                size="large"
                prefix={<SearchOutlined className="text-gray-400" />}
                enterButton="搜索"
                allowClear
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Space size="middle" className="w-full justify-end">
                <Button
                  type={showAdvancedFilters ? 'primary' : 'default'}
                  icon={<FilterOutlined />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {compact ? '' : '高级筛选'}
                </Button>
                {hasFilters && (
                  <Button
                    icon={<ClearOutlined />}
                    onClick={handleClearFilters}
                    title="清除筛选"
                  >
                    {compact ? '' : '清除'}
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {/* 当前筛选标签 */}
        {hasFilters && (
          <div className="filter-tags mb-4">
            <Text type="secondary" className="mr-2">当前筛选:</Text>
            <Space size={[8, 8]} wrap>
              {filterTags.map(tag => (
                <Tag
                  key={tag.key}
                  closable={tag.closable}
                  onClose={tag.onClose}
                  color="blue"
                >
                  {tag.label}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {/* 高级筛选区域 */}
        <motion.div
          initial={false}
          animate={{ 
            height: showAdvancedFilters ? 'auto' : 0,
            opacity: showAdvancedFilters ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <Collapse
            activeKey={showAdvancedFilters ? ['filters'] : []}
            bordered={false}
            ghost
          >
            <Panel 
              header={null} 
              key="filters"
              showArrow={false}
            >
              <div className="advanced-filters">
                <Row gutter={[16, 16]}>
                  {/* 分类筛选 */}
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-group">
                      <Text strong className="block mb-2">字符分类</Text>
                      <Select
                        placeholder="选择分类"
                        value={filters.category}
                        onChange={handleCategoryChange}
                        allowClear
                        className="w-full"
                      >
                        {categories.map(category => (
                          <Option key={category} value={category}>
                            {category}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  {/* 难度筛选 */}
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-group">
                      <Text strong className="block mb-2">学习难度</Text>
                      <Select
                        mode="multiple"
                        placeholder="选择难度等级"
                        value={filters.difficulty}
                        onChange={handleDifficultyChange}
                        allowClear
                        className="w-full"
                      >
                        {Object.entries(difficultyLabels).map(([value, label]) => (
                          <Option key={value} value={parseInt(value)}>
                            {label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  {/* 其他筛选选项预留位置 */}
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-group">
                      <Text strong className="block mb-2">更多选项</Text>
                      <Select
                        placeholder="敬请期待"
                        disabled
                        className="w-full"
                      >
                        <Option value="coming-soon">更多筛选功能开发中...</Option>
                      </Select>
                    </div>
                  </Col>
                </Row>

                {/* 筛选操作按钮 */}
                <div className="filter-actions mt-4 text-center">
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => setShowAdvancedFilters(false)}
                    >
                      应用筛选
                    </Button>
                    <Button onClick={handleClearFilters}>
                      清除所有筛选
                    </Button>
                  </Space>
                </div>
              </div>
            </Panel>
          </Collapse>
        </motion.div>

        {/* 快速搜索建议 */}
        {!hasFilters && !compact && (
          <div className="search-suggestions mt-4">
            <Text type="secondary" className="block mb-2">热门搜索:</Text>
            <Space size={[8, 8]} wrap>
              {['人', '水', '火', '日', '月', '木', '山', '大'].map(char => (
                <Tag
                  key={char}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => handleSearch(char)}
                >
                  {char}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CharacterSearch;