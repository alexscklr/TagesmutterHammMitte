import { supabase } from "@/supabaseClient";
import type { PageMeta } from "../types/types";


export async function fetchPageMeta(slug: string): Promise<PageMeta | null> {
    const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        console.log(error?.message, "\n", !data ? "No data!" : "");
        return null;
    }
    
    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        created_at: data.created_at,
        background: data.background
    };
}