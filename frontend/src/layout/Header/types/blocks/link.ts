import type { RichTextContent } from "@/shared/types";
import type { HeaderBlock, HeaderBlocks } from "..";



export interface Link {
    target_site_id?: string;     url?: string;     label?: RichTextContent; }

export type LinkBlock = Extract<HeaderBlock, { type: typeof HeaderBlocks.Link }>;