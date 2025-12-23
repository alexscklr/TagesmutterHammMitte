import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { fetchUserRole, signOut } from "../lib";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Hilfsfunktion um User & Rolle zu setzen
    const updateAuthState = async (session: any) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRole = await fetchUserRole(currentUser.id);
          if (isMounted) setRole(userRole);
        } catch (err) {
          console.error("Role fetch failed", err);
          if (isMounted) setRole(null);
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    };

    // 1. Hole die aktuelle Session einmalig beim Start
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    // 2. Lausche auf Änderungen (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Vermeide unnötiges Laden bei INITIAL_SESSION, wenn getSession schon läuft
      if (event !== 'INITIAL_SESSION') {
        updateAuthState(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear local auth state immediately so the UI updates even if the event listener lags
      setUser(null);
      setRole(null);
    }
  };

  const canEdit = role === "admin" || role === "auditor";

  return { user, role, loading, canEdit, logout };
};