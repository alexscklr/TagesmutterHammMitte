import { useEffect, useRef, useState } from "react";
import "./ImageSlider.css"

type SliderProps = {
    items: string[];
    speed: number;
}

const ImageSlider = ({ items, speed }: SliderProps) => {
    const duplicatedItems = [...items, ...items];
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFocussed, setIsFocussed] = useState(false);

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

        const step = (timestamp: number) => {
            if (lastTimestamp === null) {
                lastTimestamp = timestamp;
                animationFrameId = requestAnimationFrame(step);
                return;
            }

            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (!isFocussed) {
                const halfScrollWidth = container.scrollWidth / 2;
                const nextScrollLeft = container.scrollLeft + speed * delta;

                if (nextScrollLeft >= halfScrollWidth) {
                    // sanft zurücksetzen, aber mit kleinem Offset
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
            container.scrollLeft = ((container.scrollLeft + e.deltaY) % halfScrollWidth + halfScrollWidth) % halfScrollWidth;

        };

        container.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener("wheel", onWheel);
        };
    }, [isFocussed]);


    return (
        <div
            ref={containerRef}
            className="slider-container"
            onMouseEnter={() => setIsFocussed(true)}
            onFocus={() => setIsFocussed(true)}
            onMouseLeave={() => setIsFocussed(false)}
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