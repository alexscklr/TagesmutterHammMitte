import type { Dropdown, Link, Logo } from "./index";


export const HeaderBlocks = {
    Logo: "logo",
    Link: "link",
    Dropdown: "dropdown"
} as const;

export type HeaderBlockType = typeof HeaderBlocks[keyof typeof HeaderBlocks];

export type HeaderBlock =
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof HeaderBlocks.Logo; order: number; content: Logo }
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof HeaderBlocks.Link; order: number; content: Link }
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof HeaderBlocks.Dropdown; order: number; content: Dropdown };


export type Header = HeaderBlock[];