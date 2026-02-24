import type { HeaderBlock } from "../types";
import { buildNestedHeaderBlocks } from "./index";
import { supabase } from "@/supabaseClient"; // zentralen Client verwenden

export async function getHeaderBlocks(): Promise<HeaderBlock[]> {
  const { data, error } = await supabase
    .from("header_blocks")
    .select("id, parent_block_id, target_site_id, type, order, content")
    .order("order", { ascending: true });

  if (error || !data) {
    console.error("Fehler beim Laden der Header-Blöcke:", error);
    return [];
  }

  return buildNestedHeaderBlocks(data as HeaderBlock[]);
}