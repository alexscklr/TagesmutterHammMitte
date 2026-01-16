import { createContext, useContext } from "react";
import type { BackgroundStyle } from "../types/types";

interface BackgroundContextType {
  setPreviewBackground: (bg: BackgroundStyle | null | undefined) => void;
}

export const BackgroundContext = createContext<BackgroundContextType>({
  setPreviewBackground: () => {},
});

export const useBackgroundPreview = () => useContext(BackgroundContext);
