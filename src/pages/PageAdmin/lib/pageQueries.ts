import { supabase } from "@/supabaseClient";
import type { PageData } from "../types";

export const pageQueries = {
  async loadPages() {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async savePage(pageData: Partial<PageData>, editingId: string | null) {
    if (editingId) {
      const { error } = await supabase
        .from("pages")
        .update({
          slug: pageData.slug,
          title: pageData.title,
          sitetitle: pageData.sitetitle,
          background: pageData.background || null,
          is_public: pageData.is_public,
        })
        .eq("id", editingId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("pages")
        .insert([
          {
            slug: pageData.slug,
            title: pageData.title,
            sitetitle: pageData.sitetitle,
            background: pageData.background || null,
            is_public: pageData.is_public ?? true, // Default true for new pages
          },
        ]);

      if (error) throw error;
    }
  },

  async deletePage(id: string) {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) throw error;
  },
};
