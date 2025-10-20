import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { PERSONAS, Persona, Gasto } from "../types/gasto";
import { useGastos } from "../context/GastosContexto";
import { View, Text, TextInput, Pressable, Image, Alert } from "react-native";
import { useState } from "react";

// Esquema de validación
const esquema = z.object({
  titulo: z.string().min(3, "Ingresa una descripción (mín. 3)."),
  monto: z.coerce.number().positive("El monto debe ser mayor a 0."),
  pagoPor: z.custom<Persona>((v) => PERSONAS.includes(String(v) as Persona)),
  participantes: z
    .array(z.custom<Persona>((v) => PERSONAS.includes(String(v) as Persona)))
    .min(1, "Selecciona al menos 1 participante."),
});

export default function FormularioGasto({ alGuardar }: { alGuardar: () => void }) {
  const { agregarGasto } = useGastos();
  const [fotoUri, setFotoUri] = useState<string>("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: {
      titulo: "",
      monto: 0,
      pagoPor: "Juan" as Persona,
      participantes: ["Juan"] as Persona[],
    },
  });

  // Tomar foto del recibo (obligatoria)
  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Autoriza la cámara para capturar el recibo.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setFotoUri(res.assets[0].uri);
  };

  // Crear ID seguro con expo-crypto
  const generarId = () => {
    if (typeof Crypto.randomUUID === "function") return Crypto.randomUUID();
    return `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
  };

  const enviar = handleSubmit(async (data) => {
    if (!fotoUri) {
      Alert.alert("Recibo obligatorio", "Adjunta una foto del recibo antes de guardar.");
      return;
    }

    const gasto: Gasto = {
      id: generarId(),
      titulo: data.titulo.trim(),
      monto: Number(data.monto),
      pagoPor: data.pagoPor as Persona,
      participantes: Array.from(new Set(data.participantes as Persona[])),
      fotoReciboUri: fotoUri,
      creadoEn: new Date().toISOString(),
    };

    await agregarGasto(gasto);
    alGuardar();
  });

  const participantes = watch("participantes") as Persona[];

  const alternarParticipante = (p: Persona) => {
    const set = new Set(participantes);
    set.has(p) ? set.delete(p) : set.add(p);
    setValue("participantes", Array.from(set) as any);
  };

  return (
    <View style={{ gap: 12 }}>
      <Text>Descripción</Text>
      <Controller
        control={control}
        name="titulo"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value as string}
            onChangeText={onChange}
            placeholder="Ej. Cena del equipo"
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          />
        )}
      />
      {errors.titulo && <Text style={{ color: "red" }}>{String(errors.titulo.message)}</Text>}

      <Text>Monto</Text>
      <Controller
        control={control}
        name="monto"
        render={({ field: { onChange, value } }) => (
          <TextInput
            keyboardType="numeric"
            value={String(value ?? "")}
            onChangeText={onChange}
            placeholder="0.00"
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          />
        )}
      />
      {errors.monto && <Text style={{ color: "red" }}>{String(errors.monto.message)}</Text>}

      <Text>Pagó</Text>
      <Controller
        control={control}
        name="pagoPor"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {PERSONAS.map((p) => (
              <Pressable
                key={p}
                onPress={() => onChange(p)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  borderWidth: value === p ? 2 : 1,
                  borderColor: value === p ? "#2563eb" : "#ccc",
                }}
              >
                <Text>{p}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      <Text>Participantes</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {PERSONAS.map((p) => {
          const activo = participantes?.includes(p);
          return (
            <Pressable
              key={p}
              onPress={() => alternarParticipante(p)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: activo ? "#2563eb" : "#ccc",
                backgroundColor: activo ? "#e0e7ff" : "white",
              }}
            >
              <Text>{p}</Text>
            </Pressable>
          );
        })}
      </View>
      {errors.participantes && <Text style={{ color: "red" }}>{String(errors.participantes.message)}</Text>}

      <Text>Recibo (foto)</Text>
      <Pressable
        onPress={tomarFoto}
        style={{ padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, alignItems: "center" }}
      >
        <Text>Tomar foto del recibo</Text>
      </Pressable>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={{ width: "100%", height: 200, borderRadius: 8 }} />
      ) : (
        <Text style={{ color: "red" }}>El recibo es obligatorio.</Text>
      )}

      <Pressable
        onPress={enviar}
        style={{ backgroundColor: "#16a34a", padding: 12, borderRadius: 8, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Guardar gasto</Text>
      </Pressable>
    </View>
  );
}
