import { useContext } from "react";
import { SelectionContext } from "../SelectionContextValue";
import type { SelectionContextType } from "../SelectionContextValue";

export const useSelection = (): SelectionContextType => useContext(SelectionContext);
