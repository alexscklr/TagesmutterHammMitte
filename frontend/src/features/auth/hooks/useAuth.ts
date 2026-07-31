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

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      setUser(null);
      setRole(null);
    }
  };

  const canEdit = role === "admin" || role === "auditor";

  return { user, role, loading, canEdit, logout };
};