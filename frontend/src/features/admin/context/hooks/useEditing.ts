import { useContext } from "react";
import { EditingContext } from "../EditingContextValue";
import type { EditingContextType } from "../EditingContextValue";

export const useEditing = (): EditingContextType => useContext(EditingContext);
