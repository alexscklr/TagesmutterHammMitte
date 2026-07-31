import type { RichTextContent } from "@/shared/types";
import type { FooterBlock, FooterBlocks } from "..";



export interface Link {
    target_site_id?: string;
    url?: string;            
    label?: RichTextContent;  
}

export type LinkBlock = Extract<FooterBlock, { type: typeof FooterBlocks.Link }>