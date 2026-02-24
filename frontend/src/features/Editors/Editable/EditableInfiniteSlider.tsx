import type { InfiniteSlider } from "@/features/pages/types/blocks";
import { SaveBlockButton } from "@/shared/components";
import { FaPlus } from "react-icons/fa6";
import styles from "./EditableInfiniteSlider.module.css";

export interface EditableInfiniteSliderProps {
  value: InfiniteSlider;
  onChange: (value: InfiniteSlider) => void;
}

const EditableInfiniteSlider: React.FC<EditableInfiniteSliderProps> = ({ value, onChange }) => {
  const speed = value.speed ?? 0.1;
  const itemCount = value.content?.length ?? 0;

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Math.max(0, Math.min(1, Number(e.target.value)));
    onChange({ ...value, speed: newSpeed });
  };

  const handleAddChild = () => {
    window.dispatchEvent(
      new CustomEvent("pageblocks:insert", {
        detail: { 
          type: "imagery", 
          order: itemCount, 
          parent_block_id: null 
        },
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Unendlicher Slider</h3>
        <p className={styles.subtitle}>{itemCount} Elemente</p>
      </div>

      {/* Speed Control */}
      <div className={styles.section}>
        <label htmlFor="slider-speed" className={styles.label}>
          Scroll-Geschwindigkeit:
        </label>
        <div className={styles.speedControl}>
          <input
            id="slider-speed"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={speed}
            onChange={handleSpeedChange}
            className={styles.slider}
          />
          <span className={styles.speedValue}>{(speed * 100).toFixed(0)}%</span>
        </div>
        <p className={styles.hint}>Langsamer ← Schneller →</p>
      </div>

      {/* Content Info */}
      <div className={styles.section}>
        <div className={styles.contentInfo}>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Elemente im Slider:</span>
            <span className={styles.infoValue}>{itemCount}</span>
          </div>
          <p className={styles.infoText}>
            {itemCount === 0 
              ? "Keine Elemente - fügen Sie welche hinzu, um den Slider zu füllen" 
              : `${itemCount} Element${itemCount !== 1 ? 'e' : ''} werden im Slider angezeigt`}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.section}>
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleAddChild}
            className={styles.buttonPrimary}
            title="Neues Element hinzufügen"
          >
            <FaPlus /> Element hinzufügen
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className={styles.section}>
        <SaveBlockButton />
      </div>

      <p className={styles.note}>
        💡 Tipp: Verwalten Sie die Elemente durch Hinzufügen oder in der Sidebar. Child-Blöcke können dort auch gelöscht oder verschoben werden.
      </p>
    </div>
  );
};

export default EditableInfiniteSlider;
