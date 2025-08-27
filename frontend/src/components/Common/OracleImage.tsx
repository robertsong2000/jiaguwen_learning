import React, { useState } from 'react';
import { Spin } from 'antd';

interface OracleImageProps {
  character: {
    modernForm: string;
    imageUrl?: string;
    imageAlt?: string;
    hasImage?: boolean;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

const OracleImage: React.FC<OracleImageProps> = ({
  character,
  size = 'medium',
  className = '',
  showFallback = true,
  onImageLoad,
  onImageError
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const sizeConfig = {
    small: { width: 80, height: 80, fontSize: '2rem' },
    medium: { width: 120, height: 120, fontSize: '3rem' },
    large: { width: 200, height: 200, fontSize: '5rem' }
  };

  const config = sizeConfig[size];

  const handleImageLoad = () => {
    setImageLoading(false);
    onImageLoad?.();
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    onImageError?.();
  };

  // 获取图片URL
  const getImageUrl = () => {
    if (!character.imageUrl) return null;
    
    // 如果是相对路径，添加前缀
    if (character.imageUrl.startsWith('/images/')) {
      return character.imageUrl;
    }
    
    // 如果是绝对URL，直接使用
    if (character.imageUrl.startsWith('http')) {
      return character.imageUrl;
    }
    
    // 默认构造本地路径
    return `/images/oracle/${character.modernForm}.png`;
  };

  const imageUrl = getImageUrl();
  const shouldShowImage = character.hasImage && imageUrl && !imageError;

  return (
    <div 
      className={`oracle-image-container ${className}`}
      style={{ 
        width: config.width, 
        height: config.height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {shouldShowImage ? (
        <>
          {imageLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gray-50"
              style={{ width: config.width, height: config.height }}
            >
              <Spin size="default" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={character.imageAlt || `${character.modernForm}字的甲骨文字形`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: imageLoading ? 'none' : 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : showFallback ? (
        <div 
          className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded"
          style={{ width: config.width, height: config.height }}
        >
          <img
            src="/images/placeholder/oracle-placeholder.svg"
            alt="甲骨文占位符"
            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
          />
        </div>
      ) : (
        // 使用Unicode字符作为最后的回退方案
        <div 
          className="flex items-center justify-center text-ancient-brown font-oracle"
          style={{ 
            width: config.width, 
            height: config.height,
            fontSize: config.fontSize
          }}
        >
          {character.modernForm}
        </div>
      )}
    </div>
  );
};

export default OracleImage;