import React from "react";
import type { Gradient, PageData } from "../types";

interface PageListProps {
  pages: PageData[];
  styles: { [key: string]: string };
  gradientToCss: (g?: Gradient | null) => string;
  onEdit: (page: PageData) => void;
  onDelete: (id: string) => void;
}

export const PageList: React.FC<PageListProps> = ({ pages, styles, gradientToCss, onEdit, onDelete }) => {
  return (
    <div className={styles.pageList}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Slug</th>
            <th>Titel</th>
            <th>Site-Titel</th>
            <th>Hintergrund</th>
            <th>Erstellt</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.id}>
              <td><code>{page.slug}</code></td>
              <td>{page.title}</td>
              <td>{page.sitetitle}</td>
              <td>
                <div className={styles.backgroundPreview}>
                  {page.background?.gradient ? (
                    <div className={styles.previewItem}>
                      <span className={styles.label}>Gradient:</span>
                      <div className={styles.gradientPreview} style={{ background: gradientToCss(page.background.gradient) }} />
                    </div>
                  ) : null}
                  {page.background?.image_url ? (
                    <div className={styles.previewItem}>
                      <span className={styles.label}>Bild:</span>
                      <span className={styles.imageUrl}>{page.background.image_url}</span>
                    </div>
                  ) : null}
                  {!page.background && (
                    <div className={styles.noBackground}>Kein Hintergrund</div>
                  )}
                </div>
              </td>
              <td>{new Date(page.created_at).toLocaleDateString()}</td>
              <td>
                <div className={styles.actions}>
                  <button onClick={() => onEdit(page)} className={styles.editButton}>Bearbeiten</button>
                  {!page.is_static && (
                    <button onClick={() => onDelete(page.id)} className={styles.deleteButton}>Löschen</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
