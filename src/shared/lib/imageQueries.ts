import { supabase } from '@/supabaseClient';

export async function getImageUrl(path: string, bucketName: string, validity_s: number) : Promise<string> {
  // path = 'library.jpg' oder 'folder/library.jpg', NICHT volle URL
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .createSignedUrl(path, validity_s);

  if (error) {
    console.error(`Error creating signed URL for ${path} of bucket ${bucketName}:`, error);
    return "";
  }

  return data.signedUrl;
}
