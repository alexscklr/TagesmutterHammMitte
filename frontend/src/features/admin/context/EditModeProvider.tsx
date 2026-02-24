import { type ReactNode, useState } from "react";
import { EditModeContext } from "./EditModeContext";

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const [isEditing, setEditing] = useState(false);
  return (
    <EditModeContext.Provider value={{ isEditing, setEditing }}>
      {children}
    </EditModeContext.Provider>
  );
};

