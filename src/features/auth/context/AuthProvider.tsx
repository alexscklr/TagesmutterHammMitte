import {type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, loading, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
