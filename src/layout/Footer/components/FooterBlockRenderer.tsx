// render/renderPageBlock.tsx
import type { JSX, ReactNode } from "react";
import { FooterBlocks, type FooterBlock } from "../types/index";
import {
    LinkBlock,
    ListBlock,
    PortraitBlock,
    CopyrightNoticeBlock,
    TextBlock
} from "./blocks";
import React from "react";

import {
    type LinkBlock as LinkBlockType,
    type ListBlock as ListBlockType,
    type PortraitBlock as PortraitBlockType,
    type CopyrightNoticeBlock as CopyrightNoticeBlockType,
    type TextBlock as TextBlockType
} from "../types/blocks";




type BlockComponentMap = {
    [FooterBlocks.Link]: (block: LinkBlockType) => JSX.Element;
    [FooterBlocks.List]: (block: ListBlockType) => JSX.Element;
    [FooterBlocks.Portrait]: (block: PortraitBlockType) => JSX.Element;
    [FooterBlocks.CopyrightNotice]: (block: CopyrightNoticeBlockType) => JSX.Element;
    [FooterBlocks.Text]: (block: TextBlockType) => JSX.Element;
};


const blockMap: BlockComponentMap = {
    [FooterBlocks.Link]: (block) => <LinkBlock block={block} />,
    [FooterBlocks.List]: (block) => <ListBlock block={block} />,
    [FooterBlocks.Portrait]: (block) => <PortraitBlock block={block} />,
    [FooterBlocks.CopyrightNotice]: (block) => <CopyrightNoticeBlock block={block} />,
    [FooterBlocks.Text]: (block) => <TextBlock block={block} />,
}


export function renderFooterBlock(block: FooterBlock): ReactNode {
    const render = blockMap[block.type] as ((block: FooterBlock) => JSX.Element | null) | undefined;
    return <React.Fragment key={block.id}>{render ? render(block) : null}</React.Fragment>
}
