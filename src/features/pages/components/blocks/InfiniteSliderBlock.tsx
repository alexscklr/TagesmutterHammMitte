import { InfiniteSlider } from "@/shared/components";
import type { InfiniteSliderBlock, PageBlock } from "../../types/index";
import { renderPageBlock } from "..";

interface InfiniteSliderBlockProps {
    block: InfiniteSliderBlock;
}

export function InfiniteSliderBlock({ block }: InfiniteSliderBlockProps) {
    const children = (block.content.content as PageBlock[]) || [];

    return (
      <InfiniteSlider
        key={block.id}
        items={children}
        speed={block.content.speed}
        keyExtractor={(b: PageBlock) => b.id}
        renderItem={(b: PageBlock) => renderPageBlock(b, false)}
      />
    );
};