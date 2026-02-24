import { BouncyText } from "@/shared/components";
import type { BouncyTextBlock } from "../../types/index";

interface BouncyTextBlockProps {
    block: BouncyTextBlock;
}

export function BouncyTextBlock({ block }: BouncyTextBlockProps) {

    return (
        <BouncyText
          key={block.id}
          text={block.content.text}
          amplitude={block.content.amplitude}
          frequency={block.content.frequency}
          characterDelay={block.content.characterDelay}
          duration={block.content.duration}
          pauseDuration={block.content.pauseDuration}
        />
      );
};