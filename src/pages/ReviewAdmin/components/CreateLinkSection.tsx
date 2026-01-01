import React from "react";
import { FaLink, FaCopy } from "react-icons/fa6";
import styles from "../ReviewAdmin.module.css";

interface CreateLinkSectionProps {
  validityDays: number | null;
  onValidityChange: (days: number | null) => void;
  onCreate: () => void;
  loading: boolean;
  error: string | null;
  reviewLink: string | null;
  copied: boolean;
  onCopy: () => void;
}

export const CreateLinkSection: React.FC<CreateLinkSectionProps> = ({
  validityDays,
  onValidityChange,
  onCreate,
  loading,
  error,
  reviewLink,
  copied,
  onCopy,
}) => {
  return (
    <div className={styles.section}>
      <h2>Neuen Review-Link erstellen</h2>
      <p className={styles.description}>
        Erstelle einen sicheren Link, den du an Kunden senden kannst, damit diese eine Bewertung abgeben können.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="validity">Gültigkeit:</label>
        <select
          id="validity"
          value={validityDays === null ? "null" : validityDays}
          onChange={(e) => onValidityChange(e.target.value === "null" ? null : parseInt(e.target.value))}
          className={styles.select}
        >
          <option value="null">Unbegrenzt</option>
          <option value="7">7 Tage</option>
          <option value="14">14 Tage</option>
          <option value="30">30 Tage</option>
        </select>
      </div>

      <button className={styles.button} onClick={onCreate} disabled={loading}>
        <FaLink className={styles.icon} />
        {loading ? "Erstelle Link..." : "Review-Link erstellen"}
      </button>

      {error && (
        <div className={styles.error}>
          <strong>Fehler:</strong> {error}
        </div>
      )}

      {reviewLink && (
        <div className={styles.linkContainer}>
          <h3>Review-Link erstellt!</h3>
          <div className={styles.linkBox}>
            <input type="text" value={reviewLink} readOnly className={styles.linkInput} />
            <button className={styles.copyButton} onClick={onCopy} title="Link kopieren">
              <FaCopy className={styles.icon} />
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
          <p className={styles.hint}>Sende diesen Link an deinen Kunden. Der Link kann nur einmal verwendet werden.</p>
        </div>
      )}
    </div>
  );
};
