import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface RequireAdminProps {
  children: React.ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        color: "var(--color-neutral-100)" 
      }}>
        Lädt...
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        padding: "2rem",
        textAlign: "center"
      }}>
        <h2 style={{ color: "var(--color-neutral-100)", marginBottom: "1rem" }}>
          Zugriff verweigert
        </h2>
        <p style={{ color: "var(--color-neutral-300)", marginBottom: "2rem" }}>
          Sie haben keine Berechtigung, auf diese Seite zuzugreifen.
        </p>
        <a 
          href="/" 
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--color-accent)",
            color: "white",
            textDecoration: "none",
            borderRadius: "0.5rem"
          }}
        >
          Zur Startseite
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
