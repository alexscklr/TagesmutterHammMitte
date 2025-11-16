import { useContext } from "react";
import { EditModeContext } from "../context/EditModeContext";

export const useEditMode = () => useContext(EditModeContext);