import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../infra/supabase/client';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET!;

export async function pickAndUploadProgressPhoto(planId: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  const uri = asset.uri;
  const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `progress/${planId}/${Date.now()}.${ext}`;

  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  const binary = Buffer.from(base64, 'base64');

  const { error } = await supabase.storage.from(BUCKET).upload(path, binary, {
    contentType: asset.mimeType || 'image/jpeg',
    upsert: true
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

