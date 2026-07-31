import { supabase } from "@/supabaseClient";

export interface UserProfile {
  id: string;
  role: string;
}


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