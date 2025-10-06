import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "@/components/inputField";
import { NavigationButton } from "@/components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "@/types/cv.types";
import * as Yup from "yup";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();
  const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Nombre completo es obligatorio"),
    email: Yup.string().email("Email inválido").required("Email es obligatorio"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "El número debe tener exactamente 10 dígitos")
      .required("Teléfono es obligatorio"),
    location: Yup.string().required("Ubicación es obligatoria"),
    summary: Yup.string().required("Resumen profesional es obligatorio"),
  });

  const handleSave = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      updatePersonalInfo(formData);
      Alert.alert("Éxito", "Información guardada correctamente!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (validationErrors: any) {
      const formattedErrors: { [key: string]: string } = {};
      validationErrors.inner.forEach((error: any) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      Alert.alert("Error", "Por favor corrige los campos marcados.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <InputField
          label="Nombre Completo"
          placeholder="Josué Guerra"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

        <InputField
          label="Email"
          placeholder="example@email.com"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <InputField
          label="Teléfono"
          placeholder="0999999999"
          value={formData.phone}
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, "").slice(0, 10);
            setFormData({ ...formData, phone: onlyNumbers });
          }}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

        <InputField
          label="Ubicación"
          placeholder="Quito, Ecuador"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
        {errors.location && <Text style={styles.error}>{errors.location}</Text>}

        <InputField
          label="Resumen Profesional"
          placeholder="Describe Brevemente tu perfil profesional..."
          value={formData.summary}
          onChangeText={(text) => setFormData({ ...formData, summary: text })}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />
        {errors.summary && <Text style={styles.error}>{errors.summary}</Text>}

        <NavigationButton title="Guardar Información" onPress={handleSave} />

        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  error: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
});
