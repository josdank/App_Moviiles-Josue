import { useState } from "react";
import { View, Image, FlatList, Pressable, Dimensions } from "react-native";
import { useGastos } from "../../context/GastosContexto";
import ModalRecibo from "../../components/ModalRecibo";

export default function Recibos() {
  const { gastos } = useGastos();
  const [idAbierto, setIdAbierto] = useState<string | null>(null);
  const size = Math.floor((Dimensions.get("window").width - 16*2 - 8*2) / 3);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        numColumns={3}
        columnWrapperStyle={{ gap: 8 }}
        data={gastos}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => setIdAbierto(item.id)} style={{ marginBottom: 8 }}>
            <Image source={{ uri: item.fotoReciboUri }} style={{ width: size, height: size, borderRadius: 8 }} />
          </Pressable>
        )}
      />
      <ModalRecibo idGasto={idAbierto} cerrar={() => setIdAbierto(null)} />
    </View>
  );
}
