import { createContext } from "react";
import type { PageBlock } from "@/features/pages/types/page";

export interface EditingContextType {
  isDirty: boolean;
  changedBlock: PageBlock | null;
  setChangedBlock: (b: PageBlock | null) => void;
  save: () => Promise<void>;
}

export const EditingContext = createContext<EditingContextType>({
  isDirty: false,
  changedBlock: null,
  setChangedBlock: () => {},
  save: async () => {},
});
