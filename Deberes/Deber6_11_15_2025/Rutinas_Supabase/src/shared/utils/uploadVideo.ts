import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../infra/supabase/client';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET!;

export async function pickAndUploadRoutineVideo(rutinaId: string, exerciseSlug: string) {
  // Abrir selector de video
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    quality: 1
  });

  // Cancelado por el usuario
  if (result.canceled) return null;

  const asset = result.assets[0];
  const uri = asset.uri;

  // Obtener extensión del archivo
  const ext = uri.split('.').pop()?.toLowerCase() || 'mp4';
  const path = `videos/${rutinaId}/${exerciseSlug}.${ext}`;

  // Leer archivo como base64 (corregido)
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  const binary = Buffer.from(base64, 'base64');

  // Subir a Supabase Storage
  const { error } = await supabase.storage.from(BUCKET).upload(path, binary, {
    contentType: asset.mimeType || 'video/mp4',
    upsert: true
  });

  if (error) throw error;

  // Obtener URL pública
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
