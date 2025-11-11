import { uploadToCloudinary } from '../data/services/cloudinaryClient';

/**
 * Wrapper pequeño para mantener la API esperada por la app.
 * uploadImageAsync recibe un URI local y devuelve la URL pública en Cloudinary o null.
 */
export async function uploadImageAsync(uri: string): Promise<string | null> {
	try {
		return await uploadToCloudinary(uri);
	} catch (err) {
		console.log('uploadImageAsync error:', err);
		return null;
	}
}
