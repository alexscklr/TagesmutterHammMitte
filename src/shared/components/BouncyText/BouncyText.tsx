import React, { useEffect, useState, useRef } from "react";

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
  const [elapsedTime, setElapsedTime] = useState(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const cycleDuration = duration + pauseDuration;

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const totalElapsed = time - startTimeRef.current;

    const cycleTime = totalElapsed % cycleDuration;
    setElapsedTime(cycleTime);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  });

  return (
    <span>
      {text.split("").map((char, index) => {
        const charTime = elapsedTime - index * characterDelay;

        let y = 0;
        if (charTime >= 0 && charTime <= duration) {
          const tNorm = charTime / duration;
          const phase = tNorm * 2 * Math.PI * frequency;
          y = amplitude * Math.sin(phase);
        }

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              transform: `translateY(${y.toFixed(2)}px)`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
};
