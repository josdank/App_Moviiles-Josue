import React, { useState } from "react";
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
import { Education } from "../types/cv.types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    graduationYear: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const degrees = ["Licenciatura", "Maestría", "Doctorado", "Técnico", "Otro"];

  const handleAdd = () => {
    const institutionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$/;
    const fieldRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

    if (!formData.institution || !formData.degree) {
      Alert.alert("Error", "Por favor completa al menos institución y título");
      return;
    }

    if (!institutionRegex.test(formData.institution)) {
      Alert.alert(
        "Error",
        "La institución solo debe contener letras y tener máximo 30 caracteres"
      );
      return;
    }

    if (formData.field && !fieldRegex.test(formData.field)) {
      Alert.alert("Error", "El área de estudio solo debe contener letras");
      return;
    }

    const newEducation: Education = {
      id: Date.now().toString(),
      ...formData,
    };

    addEducation(newEducation);

    setFormData({
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    });
    setSelectedDate(new Date());

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const today = new Date();
      if (date > today) {
        Alert.alert("Error", "La fecha no puede ser posterior a hoy");
        return;
      }
      const year = date.getFullYear().toString();
      setSelectedDate(date);
      setFormData({ ...formData, graduationYear: year });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <InputField
          label="Institución *"
          placeholder="Nombre de la universidad/institución"
          value={formData.institution}
          onChangeText={(text) =>
            setFormData({ ...formData, institution: text })
          }
        />

        <Text style={styles.label}>Título/Grado *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.degree}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, degree: itemValue })
            }
          >
            <Picker.Item label="Selecciona un título" value="" />
            {degrees.map((deg) => (
              <Picker.Item key={deg} label={deg} value={deg} />
            ))}
          </Picker>
        </View>

        <InputField
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          value={formData.field}
          onChangeText={(text) => setFormData({ ...formData, field: text })}
        />

        <Text style={styles.label}>Año de Graduación</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {formData.graduationYear || "Selecciona el año"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        <NavigationButton title="Agregar Educación" onPress={handleAdd} />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
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
  container: { flex: 1 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 4 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
  },
  datePickerText: { fontSize: 16, color: "#333" },
  listTitle: { fontSize: 18, fontWeight: "bold", marginTop: 24 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { fontSize: 14 },
  cardInstitution: { fontSize: 14, fontStyle: "italic" },
  cardDate: { fontSize: 12, color: "#666" },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  deleteButtonText: { fontSize: 18, color: "red" },
});