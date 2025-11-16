import { supabase } from "@/supabaseClient";

export interface UserProfile {
  id: string;
  role: string;
}

/**
 * Lädt die Rolle eines Users aus der profiles Tabelle
 */
export async function fetchUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
  return data?.role || null;
}

/**
 * Lädt das komplette Profil eines Users
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}