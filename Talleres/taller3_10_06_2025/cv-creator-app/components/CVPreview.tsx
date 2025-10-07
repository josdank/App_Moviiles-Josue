// components/CVPreview.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
  onDeleteExperience?: (id: string) => void; // función opcional para eliminar
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData, onDeleteExperience }) => {
  const { personalInfo, experiences, education } = cvData;
  const navigation = useNavigation();

  const handleDeleteExperience = (id: string) => {
    Alert.alert(
      "Eliminar experiencia",
      "¿Estás seguro de que deseas eliminar esta experiencia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            if (onDeleteExperience) {
              onDeleteExperience(id);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con información personal */}
        <View style={styles.header}>
          {/* Foto de perfil */}
          {personalInfo.profileImage && (
            <Image
              source={{ uri: personalInfo.profileImage }}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.name}>
            {personalInfo.fullName || "Tu Nombre"}
          </Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <Text style={styles.contactText}>📧 {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactText}>📱 {personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactText}>📍 {personalInfo.location}</Text>
            )}
          </View>
        </View>

        {/* Resumen profesional */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMEN PROFESIONAL</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia laboral */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{exp.position}</Text>
                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                    <Text style={styles.itemDate}>
                      {exp.startDate} - {exp.endDate || "Actual"}
                    </Text>
                  </View>
                  {onDeleteExperience && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteExperience(exp.id)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.itemSubtitle}>{edu.field}</Text>
                )}
                <Text style={styles.itemInstitution}>{edu.institution}</Text>
                {edu.graduationYear && (
                  <Text style={styles.itemDate}>{edu.graduationYear}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Mensaje si no hay datos */}
        {!personalInfo.fullName &&
          experiences.length === 0 &&
          education.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay información para mostrar.{"\n"}
                Completa las secciones para ver tu CV.
              </Text>
            </View>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  contactInfo: {
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    textAlign: "justify",
  },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 4,
    fontWeight: "500",
  },
  itemInstitution: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 4,
    fontStyle: "italic",
  },
  itemDate: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#555",
    marginTop: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 24,
  },
});