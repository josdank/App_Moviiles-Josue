import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

export default function CloudinaryUploadScreen() {
	const { upload, loading } = useCloudinaryUpload();
	const [localUri, setLocalUri] = useState<string | null>(null);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

	async function pickAndUpload() {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Permisos de galería requeridos');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			setLocalUri(uri);
			const url = await upload(uri);
			setUploadedUrl(url);
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Cloudinary Upload (Demo)</Text>
			{localUri && <Image source={{ uri: localUri }} style={styles.preview} />}
			{uploadedUrl && <Text>Uploaded URL: {uploadedUrl}</Text>}
			<Button title={loading ? 'Subiendo...' : 'Seleccionar y subir'} onPress={pickAndUpload} disabled={loading} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
	preview: { width: 200, height: 200, marginBottom: 12, borderRadius: 8 },
});
