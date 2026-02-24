import { createContext } from "react";
import type { PageBlock } from "@/features/pages/types/page";

export interface SelectionContextType {
  selectedBlock: PageBlock | null;
  setSelectedBlock: (block: PageBlock | null) => void;
}

export const SelectionContext = createContext<SelectionContextType>({
  selectedBlock: null,
  setSelectedBlock: () => {},
});
