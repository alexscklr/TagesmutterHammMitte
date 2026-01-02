import React, { createContext, useContext } from "react";
import type { DragControls } from "@/shared/hooks/useDragAndDrop";

interface PageDragContextValue {
    drag: DragControls | null;
    isEditing: boolean;
}

const PageDragContext = createContext<PageDragContextValue>({ drag: null, isEditing: false });

export const PageDragProvider: React.FC<{ value: PageDragContextValue; children: React.ReactNode }> = ({ value, children }) => {
    return <PageDragContext.Provider value={value}>{children}</PageDragContext.Provider>;
};

export const usePageDrag = () => useContext(PageDragContext);
