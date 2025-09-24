import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number; // Distance from bottom in pixels
}

export const useScrollTrigger = (options: UseScrollTriggerOptions = {}) => {
  const [shouldLoadMore, setShouldLoadMore] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const threshold = options.threshold || 200; // 200px from bottom

  const checkScroll = useCallback(() => {
    const target = targetRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if element is within threshold distance from bottom of viewport
    const distanceFromBottom = rect.top - windowHeight;
    const isNearBottom = distanceFromBottom <= threshold;
    
    console.log('Scroll check:', {
      elementTop: rect.top,
      windowHeight,
      distanceFromBottom,
      threshold,
      isNearBottom
    });

    setShouldLoadMore(isNearBottom);
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      checkScroll();
    };

    // Check on mount
    checkScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [checkScroll]);

  return { targetRef, shouldLoadMore };
};