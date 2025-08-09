import React, { useEffect, useState, useRef, type CSSProperties } from "react";

interface BouncyTextProps {
  text: string;
  amplitude?: number;
  duration?: number;
  pauseDuration?: number;
  characterDelay?: number;
  frequency?: number;
  style?: CSSProperties;
}


export const BouncyText: React.FC<BouncyTextProps> = ({
  text,
  amplitude = 20,
  duration = 1000,
  pauseDuration = 2000,
  characterDelay = 100,
  frequency = 1,
  style
}) => {
  const [elapsedTime, setElapsedTime] = useState(0); // Zeit innerhalb Zyklus (0..duration+pause)
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Gesamtdauer eines Zyklus: animation + pause
  const cycleDuration = duration + pauseDuration;

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const totalElapsed = time - startTimeRef.current;

    // Zeit im aktuellen Zyklus (modulo cycleDuration)
    const cycleTime = totalElapsed % cycleDuration;
    setElapsedTime(cycleTime);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        fontSize: "3rem",
        fontFamily: "Nunito",
        padding: "2%",
        ...style
      }}
    >
      {text.split("").map((char, index) => {
        // Berechne individuelle Zeit für diesen Buchstaben (mit Delay)
        const charTime = elapsedTime - index * characterDelay;

        // Solange charTime in [0, duration], animieren; sonst y=0
        let y = 0;
        if (charTime >= 0 && charTime <= duration) {
          // Normierte Zeit [0..1] für Sinuswelle
          const tNorm = charTime / duration;

          // Sinusphase: 0..2π*frequency, damit mehrere Wellen möglich sind
          const phase = tNorm * 2 * Math.PI * frequency;

          // Sinuswelle von 0 bis 0 (voller Zyklus)
          y = amplitude * Math.sin(phase);
        } else {
          y = 0; // Pause oder vor Animation: keine Verschiebung
        }

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              transform: `translateY(${y.toFixed(2)}px)`,
              transition: "transform 0.1s linear"
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
};
