import React from "react";
import { FaTrash } from "react-icons/fa6";
import styles from "../PageAdmin.module.css";
import { gradientToCss } from "../utils";
import type { PageData } from "../types";

interface GradientEditorProps {
  formData: Partial<PageData>;
  isDraggingWheel: boolean;
  onWheelDrag: (e: React.MouseEvent<HTMLDivElement>) => void;
  onUpdateStop: (index: number, color: string) => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
  defaultGradient: { stops: Array<{ color: string }>; direction: string };
}

export const GradientEditor: React.FC<GradientEditorProps> = ({
  formData,
  isDraggingWheel,
  onWheelDrag,
  onUpdateStop,
  onAddStop,
  onRemoveStop,
  defaultGradient,
}) => {
  const gradient = formData.background?.gradient || defaultGradient;
  const stops = gradient.stops || defaultGradient.stops;
  const direction = gradient.direction || defaultGradient.direction;

  return (
    <div className={styles.formGroup}>
      <label>Hintergrund - Gradient</label>
      <div className={styles.gradientLayout}>
        <div className={styles.gradientControls}>
          <div className={styles.gradientControlRow}>
            <label>Richtung: {direction}</label>
            <div
              className={`${styles.directionWheel} ${isDraggingWheel ? styles.dragging : ""}`}
              onMouseDown={onWheelDrag}
            >
              <div
                className={styles.directionIndicator}
                style={{ transform: `rotate(${parseInt(direction.replace("deg", "")) + 180}deg)` }}
              />
            </div>
            <div className={styles.helpText}>Klicken und ziehen um zu drehen</div>
          </div>
          <label className={styles.subLabel}>Farben</label>
          {stops.map((stop, index) => (
            <div key={index} className={styles.gradientStopRow}>
              <input
                type="color"
                value={stop.color}
                onChange={e => onUpdateStop(index, e.target.value)}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={stop.color}
                onChange={e => onUpdateStop(index, e.target.value)}
                placeholder="#FFFFFF"
              />
              {stops.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveStop(index)}
                  className={styles.removeStopButton}
                  title="Farbe entfernen"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={onAddStop} className={styles.addColorButton}>
            + Farbe hinzufügen
          </button>
        </div>
        <div className={styles.gradientPreview}>
          {formData.background?.gradient && (
            <div
              className={styles.gradientPreviewBox}
              style={{ background: gradientToCss(formData.background.gradient) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
