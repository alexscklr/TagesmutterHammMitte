import { createContext} from "react";

interface EditModeContextType {
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
}

export const EditModeContext = createContext<EditModeContextType>({
  isEditing: false,
  setEditing: () => {},
});