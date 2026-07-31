import { supabase } from "@/supabaseClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function signInWithPassword({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: 'global' });
  if (error) throw error;
}