import { View, Text, Pressable } from "react-native";
import { useGastos } from "../../context/GastosContexto";
import { generarYCompartirPDF } from "../../librerias/informePdf";

export default function Reporte() {
  const { gastos } = useGastos();
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text>Genera un PDF con el resumen de gastos y balances.</Text>
      <Pressable
        onPress={() => generarYCompartirPDF(gastos)}
        style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 8, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Generar PDF</Text>
      </Pressable>
    </View>
  );
}
