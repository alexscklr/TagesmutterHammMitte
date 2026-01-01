import React from "react";
import { FaTrash } from "react-icons/fa6";
import styles from "../PageAdmin.module.css";
import type { PageData, ColorSpot } from "../types";

interface ColorSpotsEditorProps {
  formData: Partial<PageData>;
  onAddSpot: () => void;
  onUpdateSpot: (id: string, field: keyof ColorSpot, value: unknown) => void;
  onRemoveSpot: (id: string) => void;
}

export const ColorSpotsEditor: React.FC<ColorSpotsEditorProps> = ({
  formData,
  onAddSpot,
  onUpdateSpot,
  onRemoveSpot,
}) => {
  const colorSpots = formData.background?.colorSpots || [];

  return (
    <div className={styles.formGroup}>
      <label>Hintergrund - Farbflecken (Pastel Spots)</label>
      <div className={styles.colorSpotsLayout}>
        <div className={styles.colorSpotsControls}>
          <div className={styles.colorSpotsContainer}>
            {colorSpots.map((spot, index) => (
              <div key={spot.id} className={styles.colorSpotRow}>
                <div className={styles.colorSpotHeader}>
                  <label>Fleck #{index + 1}</label>
                  <button
                    type="button"
                    onClick={() => onRemoveSpot(spot.id)}
                    className={styles.removeSpotButton}
                    title="Fleck entfernen"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className={styles.colorSpotGrid}>
                  <div>
                    <label>Farbe</label>
                    <div className={styles.colorInputRow}>
                      <input
                        type="color"
                        value={spot.color}
                        onChange={e => onUpdateSpot(spot.id, "color", e.target.value)}
                        className={styles.colorInput}
                      />
                      <input
                        type="text"
                        value={spot.color}
                        onChange={e => onUpdateSpot(spot.id, "color", e.target.value)}
                        placeholder="#C8F0F8"
                      />
                    </div>
                  </div>

                  <div>
                    <label>Horizontal Position: {spot.x}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={spot.x}
                      onChange={e => onUpdateSpot(spot.id, "x", parseFloat(e.target.value))}
                      className={styles.rangeInput}
                    />
                  </div>

                  <div>
                    <label>Vertikale Position: {spot.y}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={spot.y}
                      onChange={e => onUpdateSpot(spot.id, "y", parseFloat(e.target.value))}
                      className={styles.rangeInput}
                    />
                  </div>

                  <div>
                    <label>Größe (%)</label>
                    <input
                      type="number"
                      min="10"
                      max="80"
                      value={spot.size}
                      onChange={e => onUpdateSpot(spot.id, "size", parseFloat(e.target.value))}
                      className={styles.numberInput}
                    />
                  </div>

                  <div>
                    <label>Transparenz</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={spot.opacity}
                      onChange={e => onUpdateSpot(spot.id, "opacity", parseFloat(e.target.value))}
                      className={styles.rangeInput}
                    />
                    <span>{(spot.opacity * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={onAddSpot} className={styles.addSpotButton}>
            + Farbfleck hinzufügen
          </button>
        </div>
        <div className={styles.colorSpotsPreview}>
          <div
            className={styles.colorSpotsPreviewBox}
            style={{
              background: `
                ${colorSpots
                  .map(
                    spot =>
                      `radial-gradient(at ${spot.x}% ${spot.y}%, rgba(${parseInt(spot.color.slice(1, 3), 16)}, ${parseInt(spot.color.slice(3, 5), 16)}, ${parseInt(spot.color.slice(5, 7), 16)}, ${spot.opacity}) 0%, rgba(${parseInt(spot.color.slice(1, 3), 16)}, ${parseInt(spot.color.slice(3, 5), 16)}, ${parseInt(spot.color.slice(5, 7), 16)}, 0) ${spot.size}%)`
                  )
                  .join(", ")}, linear-gradient(180deg, #f5f1e8, #e8f4f0)
              `
            }}
          />
        </div>
      </div>
    </div>
  );
};
