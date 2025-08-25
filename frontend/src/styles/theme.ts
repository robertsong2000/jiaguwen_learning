export const theme = {
  colors: {
    primary: {
      main: '#8B4513',
      light: '#A0522D', 
      dark: '#654321',
      contrast: '#FFFFFF'
    },
    
    secondary: {
      main: '#FF4500',
      light: '#FF6347',
      dark: '#DC143C',
      contrast: '#FFFFFF'
    },
    
    background: {
      default: '#FFFFF0',
      paper: '#FFFFFF',
      subtle: '#FFF8DC',
      accent: '#F5F5DC'
    },
    
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
      ancient: '#8B4513',
      muted: '#8B7D6B'
    },
    
    status: {
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      info: '#1890ff'
    },
    
    decoration: {
      gold: '#FFD700',
      darkGreen: '#2F4F4F',
      bronze: '#CD7F32',
      jade: '#00A86B'
    }
  },
  
  typography: {
    fontFamily: {
      primary: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      oracle: "'Oracle Bone Script Font', serif",
      mono: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
      '9xl': '8rem'
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem'
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px rgba(139, 69, 19, 0.05)',
    md: '0 4px 6px rgba(139, 69, 19, 0.1), 0 1px 3px rgba(139, 69, 19, 0.08)',
    lg: '0 10px 15px rgba(139, 69, 19, 0.1), 0 4px 6px rgba(139, 69, 19, 0.05)',
    xl: '0 20px 25px rgba(139, 69, 19, 0.1), 0 8px 10px rgba(139, 69, 19, 0.04)',
    ancient: '0 4px 6px rgba(139, 69, 19, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    glow: '0 0 20px rgba(255, 215, 0, 0.3)'
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px'
  },
  
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
};

export default theme;