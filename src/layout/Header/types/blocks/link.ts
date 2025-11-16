import type { RichTextSpan } from "@/shared/types";
import type { HeaderBlock, HeaderBlocks } from "..";



export interface Link {
    target_site_id?: string; // FK auf Seite
    url?: string;            // Für externe Links
    label?: RichTextSpan[];  // Optional, falls abweichender Text
}

export type LinkBlock = Extract<HeaderBlock, { type: typeof HeaderBlocks.Link }>;