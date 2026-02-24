import React, { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { PageBlocks, type PageBlockType } from "../../types/page";
import { BLOCK_TYPE_LABELS, getDefaultContent } from "../../types/blockDefaults";

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

  const excludedTypes: PageBlockType[] = [
    PageBlocks.Title,
    PageBlocks.Heading,
    PageBlocks.BouncyText,
  ];

  const containerTypes: PageBlockType[] = [
    PageBlocks.Section,
    PageBlocks.SplitContent,
    PageBlocks.InfiniteSlider,
    PageBlocks.Timeline,
  ];

  const contentTypes: PageBlockType[] = [
    PageBlocks.Paragraph,
    PageBlocks.Imagery,
    PageBlocks.List,
    PageBlocks.Quote,
    PageBlocks.TimelineEntry,
    PageBlocks.GoogleLocation,
    PageBlocks.ContactForm,
  ];

  const filterAllowed = (types: PageBlockType[]) =>
    types.filter(t => !excludedTypes.includes(t));

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
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
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
              marginTop: "0.75rem",
              backgroundColor: "var(--color-neutral-1000)",
              border: "1px solid #e0e0e0",
              borderRadius: "var(--radius-m)",
              zIndex: 1000,
              minWidth: "300px",
              maxHeight: "500px",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
              padding: "0.5rem",
            }}
          >
            {[
              { title: "Container", items: filterAllowed(containerTypes) },
              { title: "Inhalte", items: filterAllowed(contentTypes) },
            ]
              .filter(group => group.items.length > 0)
              .map(group => (
                <div key={group.title} style={{ padding: "0.25rem 0 0.4rem" }}>
                  <div
                    style={{
                      padding: "0.35rem 0.5rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--color-neutral-400)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {group.title}
                  </div>
                  {group.items.map((blockType: PageBlockType) => (
                    <button
                      key={blockType}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInsert(blockType);
                      }}
                      disabled={loading}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "1.05rem 1.35rem",
                        textAlign: "left",
                        backgroundColor: "var(--color-neutral-900)",
                        border: "1px solid #f2dcb6",
                        borderRadius: "var(--radius-m)",
                        color: "var(--color-text)",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                        transition: "all var(--transition-fast)",
                        marginBottom: "0.3rem",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          const btn = e.target as HTMLButtonElement;
                          btn.style.background = "linear-gradient(135deg, #ffe8c7 0%, #f7ddba 100%)";
                          btn.style.borderColor = "var(--color-accent)";
                          btn.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
                          btn.style.transform = "translateY(-2px) scale(1.01)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const btn = e.target as HTMLButtonElement;
                        btn.style.background = "var(--color-neutral-900)";
                        btn.style.borderColor = "#f2dcb6";
                        btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                        btn.style.transform = "translateY(0) scale(1)";
                      }}
                    >
                      {BLOCK_TYPE_LABELS[blockType]}
                    </button>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>

      {error && <span style={{ color: "red", fontSize: "0.9rem" }}>{error}</span>}
      {showMenu && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
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
