import React, { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { PageBlocks, type PageBlockType } from "../types/page";
import { BLOCK_TYPE_LABELS, getDefaultContent } from "./blockDefaults";

interface AddBlockButtonProps {
  pageId?: string;
  order: number;
  parentBlockId?: string | null;
  onBlockAdded?: () => void;
}

export const AddBlockButton: React.FC<AddBlockButtonProps> = ({ pageId, order, parentBlockId = null, onBlockAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { isEditing } = useEditMode();

  const handleInsert = async (blockType: PageBlockType) => {
    setLoading(true);
    setError(null);
    setShowMenu(false);
    try {
      if (pageId) {
        const { error: insertError } = await supabase.rpc('insert_page_block_and_reorder', {
          p_page_id: pageId,
          p_type: blockType,
          p_content: getDefaultContent(blockType),
          p_order: order,
          p_parent_block_id: parentBlockId ?? null,
        });
        if (insertError) {
          setError("Fehler: " + insertError.message);
        } else {
          onBlockAdded?.();
        }
      } else {
        // Fall-back: Event-basiert, PageRenderer führt Insert mit pageId aus
        window.dispatchEvent(
          new CustomEvent("pageblocks:insert", {
            detail: { type: blockType, order, parent_block_id: parentBlockId ?? null },
          })
        );
      }
    } catch (err) {
      setError("Fehler beim Einfügen des Blocks");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) return null;

  const blockTypes = Object.values(PageBlocks) as PageBlockType[];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0",
        gap: "0.5rem",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--color-accent)",
            color: "white",
            border: "none",
            borderRadius: "0.4rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            fontSize: "0.9rem",
          }}
        >
          {loading ? "Einfügen..." : "+ Block einfügen"}
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "0.5rem",
              backgroundColor: "var(--color-neutral-900)",
              border: "1px solid var(--color-accent)",
              borderRadius: "0.4rem",
              zIndex: 1000,
              minWidth: "200px",
              maxHeight: "400px",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {blockTypes.map((blockType) => (
              <button
                key={blockType}
                onClick={() => handleInsert(blockType)}
                disabled={loading}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-neutral-100)",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                {BLOCK_TYPE_LABELS[blockType]}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <span style={{ color: "red", fontSize: "0.9rem" }}>{error}</span>}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};
