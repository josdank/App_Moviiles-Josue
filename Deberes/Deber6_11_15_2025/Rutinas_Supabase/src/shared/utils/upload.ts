import { supabase } from '../infra/supabase/client';

export async function uploadImage(planId: string, uri: string) {
  const fileName = `${planId}/${Date.now()}.jpg`;
  const res = await fetch(uri);
  const blob = await res.blob();

  const { error } = await supabase.storage
    .from('media')
    .upload(fileName, blob, { contentType: 'image/jpeg' });
  if (error) throw error;

  return supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl;
}
