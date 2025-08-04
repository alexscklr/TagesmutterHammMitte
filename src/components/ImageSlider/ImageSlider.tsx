import { useEffect, useRef, useState } from "react";
import "./ImageSlider.css"

type SliderProps = {
    items: any[];
}

const ImageSlider = ({items} : SliderProps) => {
    const duplicatedItems = [...items, ...items];
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth / 2;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId: number;
        let lastTimestamp: number | null = null;
        const speed = 0.3; // px/ms

        const step = (timestamp: number) => {
            if (lastTimestamp === null) {
                lastTimestamp = timestamp;
                animationFrameId = requestAnimationFrame(step);
                return;
            }

            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (!isHovered) {
                const scrollAmount = speed * delta;
                container.scrollLeft += scrollAmount;

                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft -= container.scrollWidth / 2;
                } else if (container.scrollLeft <= 0) {
                    container.scrollLeft += container.scrollWidth / 2;
                }
            }

            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            container.scrollLeft += e.deltaY;

            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft -= container.scrollWidth / 2;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += container.scrollWidth / 2;
            }
        };

        container.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener("wheel", onWheel);
        };
    }, [isHovered]);


    return (
        <div
            ref={containerRef}
            className="slider-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {duplicatedItems.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`Slide ${i}`}
                    className="slider-item"
                    draggable={false}
                />
            ))}
        </div>
    );
}

export default ImageSlider;