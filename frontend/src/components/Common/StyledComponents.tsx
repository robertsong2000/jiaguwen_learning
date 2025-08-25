import React from 'react';
import { motion } from 'framer-motion';

// 通用容器组件
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  centered = true,
  className = ''
}) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };
  
  return (
    <div className={`
      ${sizes[size]} 
      ${centered ? 'mx-auto' : ''} 
      px-4 
      ${className}
    `}>
      {children}
    </div>
  );
};

// 古典风格卡片
interface AncientCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'bordered' | 'shadow' | 'gradient';
  hoverable?: boolean;
  className?: string;
}

export const AncientCard: React.FC<AncientCardProps> = ({
  children,
  title,
  variant = 'default',
  hoverable = false,
  className = ''
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-ancient-brown',
    shadow: 'bg-white shadow-lg border border-gray-100',
    gradient: 'bg-gradient-to-br from-ivory to-white border border-ancient-brown/20'
  };
  
  const hoverClass = hoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        ${variants[variant]} 
        rounded-lg 
        overflow-hidden 
        ${hoverClass} 
        ${className}
      `}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-ancient-brown">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

// 动画容器
interface AnimatedBoxProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = ''
}) => {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    }
  };
  
  return (
    <motion.div
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 渐变背景
interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ancient' | 'subtle';
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'primary',
  className = ''
}) => {
  const variants = {
    primary: 'bg-gradient-to-br from-ancient-brown to-vermillion',
    secondary: 'bg-gradient-to-br from-vermillion to-ancient-brown',
    ancient: 'bg-gradient-to-br from-ivory via-white to-ancient-brown/10',
    subtle: 'bg-gradient-to-br from-ivory to-white'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// 装饰性分隔线
interface DecorativeDividerProps {
  variant?: 'simple' | 'ornate' | 'dots';
  className?: string;
}

export const DecorativeDivider: React.FC<DecorativeDividerProps> = ({
  variant = 'simple',
  className = ''
}) => {
  if (variant === 'dots') {
    return (
      <div className={`flex justify-center items-center space-x-2 my-8 ${className}`}>
        <div className="w-2 h-2 bg-ancient-brown rounded-full"></div>
        <div className="w-3 h-3 bg-ancient-brown rounded-full"></div>
        <div className="w-4 h-4 bg-ancient-brown rounded-full"></div>
        <div className="w-3 h-3 bg-ancient-brown rounded-full"></div>
        <div className="w-2 h-2 bg-ancient-brown rounded-full"></div>
      </div>
    );
  }
  
  if (variant === 'ornate') {
    return (
      <div className={`flex justify-center items-center my-8 ${className}`}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-ancient-brown"></div>
        <div className="mx-4 text-ancient-brown text-2xl font-oracle">❦</div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-ancient-brown"></div>
      </div>
    );
  }
  
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-ancient-brown to-transparent my-8 ${className}`} />
  );
};

// 悬浮效果按钮
interface FloatingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-ancient-brown text-white hover:bg-ancient-brown/90',
    secondary: 'bg-vermillion text-white hover:bg-vermillion/90', 
    outline: 'border-2 border-ancient-brown text-ancient-brown hover:bg-ancient-brown hover:text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-lg 
        font-medium 
        transition-all 
        duration-300 
        shadow-md 
        hover:shadow-lg 
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

// 加载骨架屏
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'text',
  className = ''
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };
  
  return (
    <div 
      className={`
        bg-gray-200 
        animate-pulse 
        ${variants[variant]} 
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// 响应式网格
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = ''
}) => {
  const gridCols = `
    grid-cols-${columns.xs || 1}
    ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''}
    ${columns.md ? `md:grid-cols-${columns.md}` : ''}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    ${columns.xl ? `xl:grid-cols-${columns.xl}` : ''}
  `;
  
  return (
    <div className={`grid ${gridCols} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default {
  Container,
  AncientCard,
  AnimatedBox,
  GradientBackground,
  DecorativeDivider,
  FloatingButton,
  Skeleton,
  ResponsiveGrid
};