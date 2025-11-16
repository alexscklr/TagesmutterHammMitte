import { supabase } from "@/supabaseClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Meldet einen User mit E-Mail und Passwort an
 */
export async function signInWithPassword({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Meldet den aktuellen User ab
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Holt die aktuelle Session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
}