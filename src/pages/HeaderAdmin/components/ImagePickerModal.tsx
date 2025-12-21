import React from "react";

type ImagePickerModalProps = {
  open: boolean;
  images: { name: string; url: string }[];
  styles: { [key: string]: string };
  onSelect: (name: string) => void;
  onClose: () => void;
};

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({ open, images, styles, onSelect, onClose }) => {
  if (!open) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <strong>Logo-Bild auswählen</strong>
          <button onClick={onClose} className={styles.btnClose}>✕</button>
        </div>
        <div className={styles.imageGrid}>
          {images.map(img => (
            <button key={img.name} onClick={() => onSelect(img.name)} className={styles.imageCard}>
              <img src={img.url} alt={img.name} />
              <div className={styles.imageName}>{img.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
