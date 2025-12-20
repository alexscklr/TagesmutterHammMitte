import { InfiniteSlider } from "@/shared/components";
import type { InfiniteSliderBlock, PageBlock } from "../../types/index";
import { renderPageBlock } from "..";

interface InfiniteSliderBlockProps {
    block: InfiniteSliderBlock;
}

export function InfiniteSliderBlock({ block }: InfiniteSliderBlockProps) {

    return (
        <InfiniteSlider
          key={block.id}
          items={block.content.content as PageBlock[]}
          speed={block.content.speed}
          keyExtractor={(b: PageBlock) => b.id}
          renderItem={(b: PageBlock) => renderPageBlock(b)}
        />
      );
};