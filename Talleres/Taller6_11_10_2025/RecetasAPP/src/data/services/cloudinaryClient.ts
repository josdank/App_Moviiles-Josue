import * as FileSystem from 'expo-file-system';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

/**
 * Subir una imagen a Cloudinary mediante un upload preset sin firmar.
 * Devuelve la URL segura (secure_url) o null si falla.
 */
export async function uploadToCloudinary(uri: string): Promise<string | null> {
  if (!CLOUD_NAME || !UPLOAD_PRESET || UPLOAD_PRESET === 'your_unsigned_preset') {
    // No hay configuración de Cloudinary
    return null;
  }

  try {
    // Intentar obtener un blob (en algunos entornos RN funciona)
    try {
      const res = await fetch(uri);
      // @ts-ignore blob en runtime
      const blob = typeof (res as any).blob === 'function' ? await (res as any).blob() : null;
      const formData = new FormData();

      if (blob) {
        // En React Native/FormData, el blob se acepta directamente
        formData.append('file', blob as any);
      } else {
        // Fallback: leer como base64 y adjuntar como data URI
        const extension = uri.split('.').pop() || 'jpg';
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        const dataUri = `data:image/${extension};base64,${base64}`;
        formData.append('file', dataUri as any);
      }

      formData.append('upload_preset', UPLOAD_PRESET);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

      const uploadResp = await fetch(uploadUrl, {
        method: 'POST',
        body: formData as any,
      });

      const result = await uploadResp.json();

      if (!uploadResp.ok) {
        console.log('Cloudinary upload failed:', result);
        return null;
      }

      return result.secure_url || result.url || null;
    } catch (err) {
      console.log('Cloudinary: error preparando/realizando upload', err);
      return null;
    }
  } catch (error) {
    console.log('Cloudinary upload error', error);
    return null;
  }
}
