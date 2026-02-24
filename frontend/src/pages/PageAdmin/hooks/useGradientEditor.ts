import { useState } from "react";
import type { Gradient, PageData } from "../types";

const DEFAULT_GRADIENT: Gradient = {
  stops: [{ color: "#FAF4DC" }, { color: "#B4BEDC" }],
  direction: "180deg",
};

export const useGradientEditor = (
  _formData: Partial<PageData>,
  setFormData: (updater: ((prev: Partial<PageData>) => Partial<PageData>) | Partial<PageData>) => void
) => {
  const [isDraggingWheel, setIsDraggingWheel] = useState(false);

  const handleWheelDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const wheel = e.currentTarget;
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const updateAngle = (clientX: number, clientY: number) => {
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      updateGradientDirection(`${Math.round(angle)}deg`);
    };

    const onMouseMove = (ev: MouseEvent) => {
      updateAngle(ev.clientX, ev.clientY);
    };

    const onMouseUp = () => {
      setIsDraggingWheel(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    setIsDraggingWheel(true);
    updateAngle(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const updateGradientStop = (index: number, color: string) => {
    setFormData((prev: Partial<PageData>) => {
      const currentStops = prev.background?.gradient?.stops || [];
      const newStops = [...currentStops];
      newStops[index] = { color };
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: newStops,
            direction: prev.background?.gradient?.direction || DEFAULT_GRADIENT.direction,
          },
        },
      };
    });
  };

  const updateGradientDirection = (direction: string) => {
    setFormData((prev: Partial<PageData>) => ({
      ...prev,
      background: {
        ...prev.background,
        gradient: {
          stops: prev.background?.gradient?.stops || DEFAULT_GRADIENT.stops,
          direction,
        },
      },
    }));
  };

  const addGradientStop = () => {
    setFormData((prev: Partial<PageData>) => {
      const currentStops = prev.background?.gradient?.stops || DEFAULT_GRADIENT.stops;
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: [...currentStops, { color: "#FFFFFF" }],
            direction: prev.background?.gradient?.direction || DEFAULT_GRADIENT.direction,
          },
        },
      };
    });
  };

  const removeGradientStop = (index: number) => {
    setFormData((prev: Partial<PageData>) => {
      const currentStops = prev.background?.gradient?.stops || [];
      if (currentStops.length <= 2) return prev;
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: currentStops.filter((_: any, i: number) => i !== index),
            direction: prev.background?.gradient?.direction || DEFAULT_GRADIENT.direction,
          },
        },
      };
    });
  };

  return {
    isDraggingWheel,
    handleWheelDrag,
    updateGradientStop,
    updateGradientDirection,
    addGradientStop,
    removeGradientStop,
    DEFAULT_GRADIENT,
  };
};
