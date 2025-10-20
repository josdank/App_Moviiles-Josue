import { Modal, View, Image, Text, Pressable } from "react-native";
import { useGastos } from "../context/GastosContexto";

export default function ModalRecibo({
  idGasto,
  cerrar,
}: { idGasto: string | null; cerrar: () => void }) {
  const { gastos } = useGastos();
  const g = gastos.find((x) => x.id === idGasto);
  return (
    <Modal visible={!!idGasto} animationType="slide" onRequestClose={cerrar}>
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        {g && (
          <>
            <Image source={{ uri: g.fotoReciboUri }} style={{ flex: 1, borderRadius: 12 }} resizeMode="contain" />
            <Text style={{ fontWeight: "700", fontSize: 16 }}>{g.titulo}</Text>
            <Text>Monto: ${g.monto.toFixed(2)}</Text>
            <Text>Pagó: {g.pagoPor}</Text>
            <Text>Participantes: {g.participantes.join(", ")}</Text>
          </>
        )}
        <Pressable onPress={cerrar}
          style={{ backgroundColor: "#111827", padding: 12, borderRadius: 8, alignItems: "center" }}>
          <Text style={{ color: "white" }}>Cerrar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
