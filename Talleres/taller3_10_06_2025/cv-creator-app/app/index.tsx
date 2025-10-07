import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  console.log("CV Data cargado:", cvData); // Para debugging

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasPhoto = !!cvData.personalInfo.profileImage;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Crea tu CV Profesional</Text>

      {/* Sección: Foto de Perfil */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>Foto de Perfil</Text>
            <Text style={styles.status}>
              {hasPhoto ? "✓ Agregada" : "Opcional"}
            </Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image
              source={{ uri: cvData.personalInfo.profileImage }}
              style={styles.thumbnail}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/photo")}
        >
          <Text style={styles.buttonText}>
            {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Información Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Información Personal</Text>
        <Text style={styles.status}>
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/personal-info")}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Experiencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Experiencia</Text>
        <Text style={styles.status}>
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/experience")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Educación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Educación</Text>
        <Text style={styles.status}>
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/education")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Vista Previa */}
      <View style={styles.previewSection}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => router.push("/preview")}
          activeOpacity={0.8}
        >
          <Text style={styles.previewButtonIcon}>👁️</Text>
          <Text style={styles.previewButtonText}>Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>

      {/* Espacio adicional */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionInfo: {
    flexDirection: "column",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  previewSection: {
    marginTop: 30,
    alignItems: "center",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a286e2ff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  previewButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  bottomSpacer: {
    height: 50,
  },
});