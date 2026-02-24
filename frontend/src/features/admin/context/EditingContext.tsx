import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { updatePageBlock } from "@/features/pages/lib/pageQueries";
import type { PageBlock } from "@/features/pages/types/page";
import { EditingContext } from "./EditingContextValue";

// Context value and type moved to EditingContextValue.ts

export const EditingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [changedBlock, setChangedBlock] = useState<PageBlock | null>(null);
  const { selectedBlock, setSelectedBlock } = useSelection();

  // When selection changes, reset changed block baseline
  useEffect(() => {
    setChangedBlock(selectedBlock);
  }, [selectedBlock]);

  const isDirty = useMemo(() => {
    if (!selectedBlock || !changedBlock) return false;
    try {
      return JSON.stringify(selectedBlock.content) !== JSON.stringify(changedBlock.content);
    } catch {
      return false;
    }
  }, [selectedBlock, changedBlock]);


  const save = useCallback(async () => {
    if (!changedBlock) {
      console.warn("EditingContext.save: No changedBlock selected");
      return;
    }
    console.info("EditingContext.save: Saving block", {
      id: changedBlock.id,
      type: changedBlock.type,
      content: changedBlock.content,
    });
    const updated = await updatePageBlock(changedBlock);
    if (updated) {
      console.info("EditingContext.save: Update success", { id: updated.id });
      // Trigger a full refetch instead of partial update to preserve nested children
      window.dispatchEvent(new Event("pageblocks:updated"));
      setSelectedBlock(null);
    } else {
      console.error("EditingContext.save: Update returned null/undefined");
      window.dispatchEvent(new Event("pageblocks:updated"));
    }
    // no explicit dirty flag; derived from selected vs changed
  }, [changedBlock, setSelectedBlock]);

  return (
    <EditingContext.Provider value={{ isDirty, changedBlock, setChangedBlock, save }}>
      {children}
    </EditingContext.Provider>
  );
};

