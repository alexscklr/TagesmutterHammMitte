import type { ImageryBlock } from "../../types/index";
import { Imagery } from "@/shared/components/Imagery/Imagery";
import { useEditMode } from "@/features/admin/hooks/useEditMode";

interface ImageryBlockProps {
  block: ImageryBlock;
}

export function ImageryBlock({ block }: ImageryBlockProps) {
  const { isEditing } = useEditMode();
  const isEmpty = !block.content.images || block.content.images.length === 0;

  if (isEmpty) {
    if (isEditing) {
      return (
        <div style={{ minHeight: "100px", border: "2px dashed rgba(255,255,255,0.2)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
          Imagery-Block (leer)
        </div>
      );
    }
    return null;
  }

  // Use only the first image
  return <Imagery id={block.id} image={block.content.images[0]} />;
}
