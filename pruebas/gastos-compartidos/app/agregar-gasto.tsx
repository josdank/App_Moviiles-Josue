
import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";

import FormGDefault, * as FormGNS from "../components/FormularioGasto";
const FormularioGasto =
  (FormGDefault as any) ||
  ((FormGNS as any).default as any) ||
  (FormGNS as any);

export default function AgregarGasto() {
  const router = useRouter();
  console.log("typeof FormularioGasto:", typeof FormularioGasto);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {typeof FormularioGasto === "function" ? (
        <FormularioGasto alGuardar={() => router.back()} />
      ) : null}
    </ScrollView>
  );
}
