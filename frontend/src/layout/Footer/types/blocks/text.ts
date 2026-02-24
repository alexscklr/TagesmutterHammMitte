import type { FooterBlock, FooterBlocks } from "../footer";


export interface Text {
    text: string;
}

export type TextBlock = Extract<FooterBlock, {type: typeof FooterBlocks.Text }>;