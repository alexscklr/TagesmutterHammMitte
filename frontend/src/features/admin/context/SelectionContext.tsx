import React, { useState } from "react";
import type { PageBlock } from "@/features/pages/types/page";
import { SelectionContext } from "./SelectionContextValue";

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBlock, setSelectedBlock] = useState<PageBlock | null>(null);
  return (
    <SelectionContext.Provider value={{ selectedBlock, setSelectedBlock }}>
      {children}
    </SelectionContext.Provider>
  );
};

