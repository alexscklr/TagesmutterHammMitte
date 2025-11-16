import type { ImageryBlock } from "../../types/index";
import { Imagery } from "@/shared/components/Imagery/Imagery";

interface ImageryBlockProps {
  block: ImageryBlock;
}

export function ImageryBlock({ block }: ImageryBlockProps) {
  
  return <Imagery id={block.id}  images={block.content.images} />;
}
