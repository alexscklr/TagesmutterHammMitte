import type { RichTextContent } from "@/shared/types";
import type { FooterBlock, FooterBlocks } from "..";



export interface Link {
    target_site_id?: string; // FK auf Seite
    url?: string;            // Für externe Links
    label?: RichTextContent;  // Optional, falls abweichender Text
}

export type LinkBlock = Extract<FooterBlock, { type: typeof FooterBlocks.Link }>;