import type { RichTextContent } from "@/shared/types";
import type { Link } from "./link";
import type { HeaderBlock, HeaderBlocks } from "..";



export interface Dropdown {
    title: RichTextContent,
    options: Link[]
}

export type DropdownBlock = Extract<HeaderBlock, { type: typeof HeaderBlocks.Dropdown }>;