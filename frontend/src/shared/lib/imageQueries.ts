import { supabase } from '@/supabaseClient';

export async function getImageUrl(path: string, bucketName: string, validity_s: number = 3600, isPublic: boolean = true): Promise<string> {
  if (isPublic) {     return getPublicImageUrl(path, bucketName);
  }   return getSignedImageUrl(path, bucketName, validity_s);
}



async function getPublicImageUrl(path: string, bucketName: string): Promise<string> {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}

async function getSignedImageUrl(path: string, bucketName: string, validity_s: number = 3600): Promise<string> {
  const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, validity_s);
  if (error) {
    console.error(`Error creating signed URL for ${path}:`, error);
    return "";
  }
  return data.signedUrl;
}