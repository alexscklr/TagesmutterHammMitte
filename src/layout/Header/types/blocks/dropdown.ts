import type { RichTextSpan } from "@/shared/types";
import type { Link } from "./link";
import type { HeaderBlock, HeaderBlocks } from "..";



export interface Dropdown {
    title: RichTextSpan[],
    options: Link[]
}

export type DropdownBlock = Extract<HeaderBlock, { type: typeof HeaderBlocks.Dropdown }>;