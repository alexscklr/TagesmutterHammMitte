import React, { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";

interface DeleteBlockButtonProps {
  blockId: string;
  onBlockDeleted?: () => void;
}

export const DeleteBlockButton: React.FC<DeleteBlockButtonProps> = ({ blockId, onBlockDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isEditing } = useEditMode();
  const { setSelectedBlock } = useSelection();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('delete_page_block_and_reorder', {
        p_block_id: blockId
      });

      if (error) {
        console.error('Fehler beim Löschen:', error.message);
      } else {
        console.log('Block gelöscht und Reihenfolge angepasst.');
        onBlockDeleted?.();
        // Deselect any selected block to avoid referencing a deleted one
        setSelectedBlock(null);
        window.dispatchEvent(new Event("pageblocks:updated"));
      }
    } catch (err) {
      console.error('Delete crashed:', err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (!isEditing) return null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {!showConfirm ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          disabled={loading}
          style={{
            padding: "0.5rem",
            width: "2.75rem",
            height: "2.75rem",
            background: "var(--gradient-danger)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 0.8,
            fontSize: "1.2rem",
            transition: "opacity 0.2s",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "0.8";
          }}
          title="Block löschen"
        >
          <RiDeleteBinLine />
        </button>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
            padding: "0.25rem",
            backgroundColor: "var(--color-neutral-900)",
            borderRadius: "0.3rem",
            border: "1px solid var(--color-danger, #da190b)",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={loading}
            style={{
              padding: "0.5rem",
              width: "2.4rem",
              height: "2.4rem",
              background: "var(--gradient-danger)",
              color: "white",
              border: "none",
              borderRadius: "0.4rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? "..." : <FaCheck />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(false);
            }}
            disabled={loading}
            style={{
              padding: "0.5rem",
              width: "2.4rem",
              height: "2.4rem",
              backgroundColor: "var(--color-neutral-700)",
              color: "var(--color-neutral-100)",
              border: "none",
              borderRadius: "0.4rem",
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GiCancel />
          </button>
        </div>
      )}
    </div>
  );
};
