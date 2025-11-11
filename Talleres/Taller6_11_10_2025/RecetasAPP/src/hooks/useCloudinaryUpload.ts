import { useState } from 'react';
import { uploadImageAsync } from '../services/cloudinary';

export function useCloudinaryUpload() {
	const [loading, setLoading] = useState(false);

	async function upload(uri: string): Promise<string | null> {
		setLoading(true);
		try {
			const url = await uploadImageAsync(uri);
			return url;
		} catch (err) {
			console.log('useCloudinaryUpload error', err);
			return null;
		} finally {
			setLoading(false);
		}
	}

	return { upload, loading };
}
