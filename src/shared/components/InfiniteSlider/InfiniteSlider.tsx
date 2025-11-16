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

  useEffect(() => {
  if (containerRef.current) {
    const container = containerRef.current;
    container.scrollLeft = container.scrollWidth / 2 - container.offsetWidth / 2;
  }
}, []);



  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
        const halfScrollWidth = container.scrollWidth / 2;
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
      const halfScrollWidth = container.scrollWidth / 2;
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