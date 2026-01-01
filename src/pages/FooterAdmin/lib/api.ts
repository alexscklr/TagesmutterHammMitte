import { supabase } from "@/supabaseClient";
import type { FooterBlock } from "@/layout/Footer/types";

export const fetchFooterBlocks = async (): Promise<FooterBlock[]> => {
  const { data, error } = await supabase
    .from("footer_blocks")
    .select("id, parent_block_id, target_site_id, type, order, content")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data as FooterBlock[]) ?? [];
};

export const saveFooterBlock = async (payload: Partial<FooterBlock>, id?: string) => {
  if (id) {
    const { error } = await supabase.from("footer_blocks").update(payload).eq("id", id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("footer_blocks").insert([payload]);
  if (error) throw error;
};

export const deleteFooterBlock = async (id: string) => {
  const { error } = await supabase.from("footer_blocks").delete().eq("id", id);
  if (error) throw error;
};

export const upsertFooterOrder = async (updates: Array<{ id: string; order: number }>) => {
  if (updates.length === 0) return;

  const { data, error } = await supabase
    .from("footer_blocks")
    .upsert(updates, { onConflict: "id" })
    .select();

  if (error) throw error;
  return data;
};
