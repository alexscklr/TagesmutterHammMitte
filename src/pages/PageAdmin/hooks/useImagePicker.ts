import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { listImages } from "@/features/media/lib/storage";

export const useImagePicker = () => {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<{ name: string; url: string }[]>([]);

  const openImagePicker = async (onError: (msg: string) => void) => {
    setImagePickerOpen(true);
    try {
      const items = await listImages("");
      const filesWithUrls = items.map(i => {
        const { data } = supabase.storage.from("public_images").getPublicUrl(i.name);
        return { name: i.name, url: data.publicUrl };
      });
      setAvailableImages(filesWithUrls);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Fehler beim Laden der Bilder");
      setImagePickerOpen(false);
    }
  };

  const selectBackgroundImage = (imageName: string) => {
    return imageName;
  };

  const getImagePreviewUrl = (imageName: string) => {
    if (!imageName) return "";
    const { data } = supabase.storage.from("public_images").getPublicUrl(imageName);
    return data.publicUrl;
  };

  return {
    imagePickerOpen,
    setImagePickerOpen,
    availableImages,
    openImagePicker,
    selectBackgroundImage,
    getImagePreviewUrl,
  };
};
