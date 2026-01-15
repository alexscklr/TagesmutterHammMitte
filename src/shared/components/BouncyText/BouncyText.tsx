import React, { useEffect, useRef } from "react";

interface BouncyTextProps {
  text: string;
  amplitude?: number;
  duration?: number;
  pauseDuration?: number;
  characterDelay?: number;
  frequency?: number;
}

export const BouncyText: React.FC<BouncyTextProps> = ({
  text,
  amplitude = 20,
  duration = 1000,
  pauseDuration = 2000,
  characterDelay = 100,
  frequency = 1,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const cycleDuration = duration + pauseDuration;

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const totalElapsed = time - startTimeRef.current;
    
    // Calculate global cycle time
    const cycleTime = totalElapsed % cycleDuration;
    
    if (containerRef.current) {
        const spans = containerRef.current.children;
        for(let i=0; i < spans.length; i++) {
            const span = spans[i] as HTMLElement;
            // Calculate y for this specific character
            const charTime = cycleTime - i * characterDelay;
            let y = 0;
            
            if (charTime >= 0 && charTime <= duration) {
                const tNorm = charTime / duration;
                const phase = tNorm * 2 * Math.PI * frequency;
                y = amplitude * Math.sin(phase);
            }
            
            span.style.transform = `translateY(${y.toFixed(2)}px)`;
        }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [amplitude, duration, pauseDuration, characterDelay, frequency]);

  return (
    <span ref={containerRef} style={{ display: "inline-block" }}>
      {text.split("").map((char, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              transform: "translateY(0px)", // Initialize
              willChange: "transform" // Hint to browser
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
      ))}
    </span>
  );
};
