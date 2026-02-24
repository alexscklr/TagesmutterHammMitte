import type { Portrait, Link, List, Text, CopyrightNotice } from "./blocks";



export const FooterBlocks = {
    Portrait: "portrait",
    Link: "link",
    List: "list",
    Text: "text",
    CopyrightNotice: "copyrightNotice"
} as const;

export type FooterBlockType = typeof FooterBlocks[keyof typeof FooterBlocks];

export type FooterBlock =
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof FooterBlocks.Portrait; order: number; content: Portrait }
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof FooterBlocks.Link; order: number; content: Link }
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof FooterBlocks.List; order: number; content: List }
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof FooterBlocks.Text; order: number; content: Text }
    | { id: string; parent_block_id: string | null; target_site_id: string | null; type: typeof FooterBlocks.CopyrightNotice; order: number; content: CopyrightNotice };


export type Footer = FooterBlock[];