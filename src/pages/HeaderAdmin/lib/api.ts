import { supabase } from "@/supabaseClient";
import type { HeaderBlock } from "@/layout/Header/types/header";

export const fetchHeaderBlocks = async (): Promise<HeaderBlock[]> => {
  const { data, error } = await supabase
    .from("header_blocks")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data as HeaderBlock[]) ?? [];
};

export const saveHeaderBlock = async (payload: Partial<HeaderBlock>, id?: string) => {
  if (id) {
    const { error } = await supabase.from("header_blocks").update(payload).eq("id", id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("header_blocks").insert([payload]);
  if (error) throw error;
};

export const deleteHeaderBlock = async (id: string) => {
  const { error } = await supabase.from("header_blocks").delete().eq("id", id);
  if (error) throw error;
};

export const upsertHeaderOrder = async (updates: Array<{ id: string; order: number }>) => {
  if (updates.length === 0) return;

  const { data, error } = await supabase
    .from("header_blocks")
    .upsert(updates, { onConflict: "id" })
    .select();

  if (error) throw error;
  return data;
};
