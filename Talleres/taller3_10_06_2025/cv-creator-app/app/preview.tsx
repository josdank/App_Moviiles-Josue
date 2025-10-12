// app/preview.tsx
import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "@/components/CVPreview";
import { exportCVToPDF } from './export-pdf';

export default function PreviewScreen() {
  const { cvData } = useCVContext();

  return (
    <View style={styles.container}>
      <CVPreview cvData={cvData} />
      <Button title="Exportar a PDF" onPress={() => exportCVToPDF(cvData)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20, // opcional para que no se pegue a los bordes
  },
});
