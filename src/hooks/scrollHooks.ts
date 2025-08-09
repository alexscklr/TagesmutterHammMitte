// hooks/useScrollDirection.ts
import { useEffect, useRef, useState } from 'react';

export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current) {
        setDirection('down');
      } else if (currentY < lastScrollY.current) {
        setDirection('up');
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
}
