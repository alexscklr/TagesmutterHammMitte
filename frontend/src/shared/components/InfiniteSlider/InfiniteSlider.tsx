import { useEffect, useRef, useState, type ReactNode } from "react";
import "./InfiniteSlider.css";

type InfiniteSliderProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  speed: number;
  keyExtractor?: (item: T, index: number) => string | number;
};

function InfiniteSlider<T>({ items, renderItem, speed, keyExtractor }: InfiniteSliderProps<T>) {
  const duplicatedItems = [...items, ...items];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Cache layout values specifically to avoid thrashing
  const layoutCache = useRef({ halfScrollWidth: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
        // Initial positioning
        container.scrollLeft = container.scrollWidth / 2 - container.offsetWidth / 2;
        
        // Setup cache
        const updateCache = () => {
             layoutCache.current.halfScrollWidth = container.scrollWidth / 2;
        };
        updateCache();
        
        const resizeObserver = new ResizeObserver(() => {
            updateCache();
        });
        resizeObserver.observe(container);
        
        return () => resizeObserver.disconnect();
    }
  }, [items]); // Re-calculate when items change

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Ensure cache is populated if the previous effect hasn't run yet or if something is out of sync,
    // though the dependency overlap usually handles it.
    if (layoutCache.current.halfScrollWidth === 0) {
        layoutCache.current.halfScrollWidth = container.scrollWidth / 2;
    }

    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isFocused) {
        // Use cached value instead of reading layout property
        const halfScrollWidth = layoutCache.current.halfScrollWidth || container.scrollWidth / 2;
        const nextScrollLeft = container.scrollLeft + speed * delta;

        if (nextScrollLeft >= halfScrollWidth) {
          container.scrollLeft = nextScrollLeft - halfScrollWidth + 30;
        } else {
          container.scrollLeft = nextScrollLeft;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const halfScrollWidth = layoutCache.current.halfScrollWidth || container.scrollWidth / 2;
      container.scrollLeft =
        ((container.scrollLeft + e.deltaY) % halfScrollWidth + halfScrollWidth) % halfScrollWidth;
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("wheel", onWheel);
    };
  }, [isFocused, speed]);

  

  return (
    <div
      ref={containerRef}
      className="sliderContainer"
      onMouseEnter={() => setIsFocused(true)}
      onFocus={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      {duplicatedItems.map((item, i) => (
        <div
          key={keyExtractor ? keyExtractor(item, i).toString().concat(`-${i}`) : i}
          className="sliderItem"
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

export default InfiniteSlider;