import { Gasto } from "../types/gasto";
import { View, Text, Image, Pressable } from "react-native";
import { useGastos } from "../context/GastosContexto";
import { Alert } from "react-native";

export default function ItemGasto({ gasto }: { gasto: Gasto }) {
  const { eliminarGasto } = useGastos();
  const fecha = new Date(gasto.creadoEn).toLocaleString();
  return (
    <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginBottom: 10, gap: 6 }}>
      <Text style={{ fontWeight: "700" }}>{gasto.titulo}</Text>
      <Text>Monto: ${gasto.monto.toFixed(2)}</Text>
      <Text>Pagó: {gasto.pagoPor}</Text>
      <Text style={{ color: "#6b7280" }}>{fecha}</Text>
      <Image source={{ uri: gasto.fotoReciboUri }} style={{ height: 120, borderRadius: 8, marginTop: 6 }} />
        <Pressable
        onPress={() =>
            Alert.alert(
            "Eliminar gasto",
            "¿Seguro que quieres eliminar este gasto?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => eliminarGasto(gasto.id) }
            ]
            )
        }
        style={{ marginTop: 6, backgroundColor: "#ef4444", padding: 8, borderRadius: 8, alignItems: "center" }}
        >
        <Text style={{ color: "white" }}>Eliminar</Text>
        </Pressable>
    </View>
  );
}
