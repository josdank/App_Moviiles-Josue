import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "@/components/inputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience, updateExperience } = useCVContext();

  const editingExp = cvData.editingExperience;

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (editingExp) {
      const { id, ...rest } = editingExp;
      setFormData(rest);
    }
  }, [editingExp]);

  const validationSchema = Yup.object().shape({
  company: Yup.string().required("Empresa es obligatoria"),
  position: Yup.string().required("Cargo es obligatorio"),
  startDate: Yup.date()
    .required("Fecha de inicio es obligatoria")
    .max(new Date(), "La fecha de inicio no puede ser futura"),
  endDate: Yup.date()
    .nullable()
    .max(new Date(), "La fecha de fin no puede ser futura")
    .test(
      "fecha-fin-valida",
      "La fecha de fin debe ser posterior a la fecha de inicio",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) > new Date(startDate);
      }
    ),
  description: Yup.string()
    .max(100, "La descripción no puede superar los 100 caracteres"),
});

  const handleAddOrUpdate = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const parsedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString().split("T")[0],
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString().split("T")[0]
          : "",
      };

      if (editingExp) {
        const updated = {
          ...editingExp,
          ...parsedData,
        };
        updateExperience(updated.id, updated);
        Alert.alert("Éxito", "Experiencia actualizada correctamente");
      } else {
        const newExperience: Experience = {
          id: Date.now().toString(),
          ...parsedData,
        };
        addExperience(newExperience);
        Alert.alert("Éxito", "Experiencia agregada correctamente");
      }

      setFormData({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      });

      setErrors({});
      router.back();
    } catch (validationErrors: any) {
      const formattedErrors: { [key: string]: string } = {};
      validationErrors.inner.forEach((error: any) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      Alert.alert("Error", "Por favor corrige los campos marcados.");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {editingExp ? "Editar Experiencia" : "Agregar Nueva Experiencia"}
        </Text>

        <InputField
          label="Empresa *"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
        />
        {errors.company && <Text style={styles.error}>{errors.company}</Text>}

        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) => setFormData({ ...formData, position: text })}
        />
        {errors.position && <Text style={styles.error}>{errors.position}</Text>}

        <Text style={styles.label}>Fecha de Inicio *</Text>
        <NavigationButton
          title={
            formData.startDate
              ? new Date(formData.startDate).toISOString().split("T")[0]
              : "Seleccionar fecha"
          }
          onPress={() => setShowStartPicker(true)}
        />
        {showStartPicker && (
          <DateTimePicker
            value={formData.startDate ? new Date(formData.startDate) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setFormData({
                  ...formData,
                  startDate: selectedDate,
                });
              }
            }}
          />
        )}
        {errors.startDate && <Text style={styles.error}>{errors.startDate}</Text>}

        <Text style={styles.label}>Fecha de Fin</Text>
        <NavigationButton
          title={
            formData.endDate
              ? new Date(formData.endDate).toISOString().split("T")[0]
              : "Seleccionar fecha"
          }
          onPress={() => setShowEndPicker(true)}
          variant="secondary"
        />
        {showEndPicker && (
          <DateTimePicker
            value={formData.endDate ? new Date(formData.endDate) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setFormData({
                  ...formData,
                  endDate: selectedDate,
                });
              }
            }}
          />
        )}
        {errors.endDate && <Text style={styles.error}>{errors.endDate}</Text>}

            <InputField
            label="Descripción"
            placeholder="Describe tus responsabilidades y logros..."
            value={formData.description}
            onChangeText={(text) =>
                setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: "top" }}
            />
            {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
            )}

        <NavigationButton
          title={editingExp ? "Actualizar Experiencia" : "Agregar Experiencia"}
          onPress={handleAddOrUpdate}
        />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 4 },
  error: { color: "red", fontSize: 12, marginBottom: 8 },
  listTitle: { fontSize: 18, fontWeight: "bold", marginTop: 24 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginTop: 8,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { fontSize: 14, color: "#555" },
  cardDate: { fontSize: 12, color: "#777" },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: "#ff4d4d",
    borderRadius: 16,
    padding: 6,
  },
  deleteButtonText: { color: "#fff", fontSize: 16 },
});
