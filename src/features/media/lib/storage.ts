import { supabase } from "@/supabaseClient";

export type BucketFile = {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, unknown> | null;
  size?: number;
};

const BUCKET = "public_images";

export async function listImages(path: string = ""): Promise<BucketFile[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(path, { limit: 1000 });
  if (error) {
    console.error("listImages error", error);
    return [];
  }
  return data ?? [];
}

// For private buckets, use signed URLs for display
export async function getImageSignedUrl(path: string, expiresInSeconds: number = 60 * 10): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error) {
    console.error("getImageSignedUrl error", error);
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function uploadImage(file: File, destPath?: string): Promise<string | null> {
  const path = destPath ?? file.name;
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });
  if (error) {
    console.error("uploadImage error", error);
    return null;
  }
  return data?.path ?? path;
}

export async function deleteImage(path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error("deleteImage error", error);
    return false;
  }
  return true;
}
