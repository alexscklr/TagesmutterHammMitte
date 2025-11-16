import type { FooterBlock } from "../types";
import { buildNestedFooterBlocks } from "./index";
import { supabase } from "@/supabaseClient"; // zentralen Client verwenden

export async function getFooterBlocks(): Promise<FooterBlock[]> {
  const { data, error } = await supabase
    .from("footer_blocks")
    .select("id, parent_block_id, target_site_id, type, order, content")
    .order("order", { ascending: true });

  if (error || !data) {
    console.error("Fehler beim Laden der Footer-Blöcke:", error);
    return [];
  }

  return buildNestedFooterBlocks(data as FooterBlock[]);
}