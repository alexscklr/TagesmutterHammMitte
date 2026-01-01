import { supabase } from "@/supabaseClient";
import type { PageMeta } from "../types/types";


export async function fetchPageMeta(slug: string): Promise<PageMeta | null> {
    const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        console.log("Error fetching page meta:", error.message);
        return null;
    }

    if (!data) {
        // No page found for this slug - this is okay, we'll use defaults
        return null;
    }
    
    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        sitetitle: data.sitetitle,
        created_at: data.created_at,
        background: data.background
    };
}