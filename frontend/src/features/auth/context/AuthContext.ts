import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  canEdit: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  canEdit: false,
  logout: async () => {},
});