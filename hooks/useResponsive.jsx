import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) return 'xs';
      if (width < 768) return 'sm';
      if (width < 1024) return 'md';
      if (width < 1280) return 'lg';
      if (width < 1536) return 'xl';
      return '2xl';
    };

    const handleResize = () => {
      setScreenSize(checkScreenSize());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    isMobile: ['xs', 'sm'].includes(screenSize),
    isTablet: screenSize === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(screenSize),
  };
};