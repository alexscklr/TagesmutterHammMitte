import type { FooterBlock, FooterBlocks } from "../footer";


export interface CopyrightNotice {
    notice: string;
}

export type CopyrightNoticeBlock = Extract<FooterBlock, {type: typeof FooterBlocks.CopyrightNotice }>;