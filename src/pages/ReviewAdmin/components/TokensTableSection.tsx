import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import styles from "../ReviewAdmin.module.css";
import type { ReviewToken } from "../types";

interface TokensTableSectionProps {
  tokensLoading: boolean;
  tokens: ReviewToken[];
  onDeleteToken: (id: string) => void;
  onExtendToken: (id: string, days: number | null) => void;
  onDeleteExpired: () => void;
  onDeleteUsed: () => void;
  formatDate: (date: string | null) => string;
  isTokenExpired: (expiresAt: string | null) => boolean;
}

export const TokensTableSection: React.FC<TokensTableSectionProps> = ({
  tokensLoading,
  tokens,
  onDeleteToken,
  onExtendToken,
  onDeleteExpired,
  onDeleteUsed,
  formatDate,
  isTokenExpired,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmExtend, setConfirmExtend] = useState<{ id: string; days: number | null } | null>(null);
  const [confirmBulk, setConfirmBulk] = useState<"expired" | "used" | null>(null);

  const extendLabel = (days: number | null) => (days === null ? "unbegrenzt" : `+${days} Tage`);

  const handleExtendSelection = (tokenId: string, value: string, selectEl: HTMLSelectElement) => {
    if (!value) return;
    const days = value === "null" ? null : parseInt(value, 10);
    setConfirmExtend({ id: tokenId, days });
    setConfirmDeleteId(null);
    selectEl.selectedIndex = 0;
  };

  const confirmExtendAction = () => {
    if (!confirmExtend) return;
    onExtendToken(confirmExtend.id, confirmExtend.days);
    setConfirmExtend(null);
  };

  const confirmDeleteAction = (id: string) => {
    onDeleteToken(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Review-Tokens</h2>
        <div className={styles.bulkActions}>
          <div className={styles.inlineActionGroup}>
            <button
              className={styles.buttonSmall}
              onClick={() => (confirmBulk === "expired" ? (setConfirmBulk(null), onDeleteExpired()) : setConfirmBulk("expired"))}
              title="Lösche alle abgelaufenen Tokens"
            >
              <FaTrash className={styles.icon} /> Abgelaufene löschen
            </button>
            {confirmBulk === "expired" && (
              <div className={styles.inlineConfirm}>
                <span>Jetzt wirklich löschen?</span>
                <button className={styles.confirmButton} onClick={() => { setConfirmBulk(null); onDeleteExpired(); }}>
                  Löschen
                </button>
                <button className={styles.cancelButton} onClick={() => setConfirmBulk(null)}>
                  Abbrechen
                </button>
              </div>
            )}
          </div>

          <div className={styles.inlineActionGroup}>
            <button
              className={styles.buttonSmall}
              onClick={() => (confirmBulk === "used" ? (setConfirmBulk(null), onDeleteUsed()) : setConfirmBulk("used"))}
              title="Lösche alle benutzten Tokens"
            >
              <FaTrash className={styles.icon} /> Benutzte löschen
            </button>
            {confirmBulk === "used" && (
              <div className={styles.inlineConfirm}>
                <span>Jetzt wirklich löschen?</span>
                <button className={styles.confirmButton} onClick={() => { setConfirmBulk(null); onDeleteUsed(); }}>
                  Löschen
                </button>
                <button className={styles.cancelButton} onClick={() => setConfirmBulk(null)}>
                  Abbrechen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {tokensLoading ? (
        <p className={styles.loading}>Lade Tokens...</p>
      ) : tokens.length === 0 ? (
        <p className={styles.emptyState}>Noch keine Tokens erstellt</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Erstellt am</th>
                <th>Gültig bis</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => {
                const expired = isTokenExpired(token.expires_at);
                return (
                  <tr
                    key={token.id}
                    className={`${styles.tableRow} ${token.is_used ? styles.used : ""} ${
                      expired ? styles.expired : ""
                    }`}
                  >
                    <td className={styles.tokenCell}>
                      <code>{token.token.substring(0, 12)}...</code>
                    </td>
                    <td>{formatDate(token.created_at)}</td>
                    <td>{formatDate(token.expires_at)}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          token.is_used
                            ? styles.badgeUsed
                            : expired
                              ? styles.badgeExpired
                              : styles.badgeActive
                        }`}
                      >
                        {token.is_used ? "Benutzt" : expired ? "Abgelaufen" : "Aktiv"}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      {!token.is_used && !expired && (
                        <div className={styles.inlineActionGroup}>
                          <select
                            className={styles.extendSelect}
                            defaultValue=""
                            onChange={(e) => handleExtendSelection(token.id, e.target.value, e.target)}
                            title="Verlängere die Gültigkeit"
                          >
                            <option value="">Verlängern...</option>
                            <option value="null">Unbegrenzt</option>
                            <option value="7">+7 Tage</option>
                            <option value="14">+14 Tage</option>
                            <option value="30">+30 Tage</option>
                          </select>

                          {confirmExtend?.id === token.id && (
                            <div className={styles.inlineConfirm}>
                              <span>Verlängern um {extendLabel(confirmExtend.days)}?</span>
                              <button className={styles.confirmButton} onClick={confirmExtendAction}>
                                Bestätigen
                              </button>
                              <button className={styles.cancelButton} onClick={() => setConfirmExtend(null)}>
                                Abbrechen
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <div className={styles.inlineActionGroup}>
                        <button
                          className={styles.deleteButton}
                          onClick={() => setConfirmDeleteId(token.id)}
                          title="Token löschen"
                        >
                          <FaTrash className={styles.icon} />
                        </button>
                        {confirmDeleteId === token.id && (
                          <div className={styles.inlineConfirm}>
                            <span>Token löschen?</span>
                            <button className={styles.confirmButton} onClick={() => confirmDeleteAction(token.id)}>
                              Löschen
                            </button>
                            <button className={styles.cancelButton} onClick={() => setConfirmDeleteId(null)}>
                              Abbrechen
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
