import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { View, FlatList, Text, Pressable, TextInput } from "react-native";
import { useGastos } from "../../context/GastosContexto";
import ItemGasto from "../../components/ItemGasto";
import { PERSONAS, Persona } from "../../types/gasto";

type FiltroPagador = Persona | "Todos";

export default function Inicio() {
  const { gastos } = useGastos();

  // Estado de filtros
  const [q, setQ] = useState<string>("");
  const [pagador, setPagador] = useState<FiltroPagador>("Todos");

  // Aplicar filtros en memoria
  const gastosFiltrados = useMemo(() => {
    const query = q.trim().toLowerCase();
    return gastos.filter((g) => {
      const coincidePagador = pagador === "Todos" ? true : g.pagoPor === pagador;
      const coincideTexto =
        query.length === 0 ? true : g.titulo.toLowerCase().includes(query);
      return coincidePagador && coincideTexto;
    });
  }, [gastos, q, pagador]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Búsqueda + Filtro */}
      <View style={{ gap: 8, marginBottom: 12 }}>
        <TextInput
          placeholder="Buscar por descripción…"
          value={q}
          onChangeText={setQ}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
          }}
        />
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {(["Todos", ...PERSONAS] as const).map((p) => {
            const activo = pagador === p;
            return (
              <Pressable
                key={String(p)}
                onPress={() => setPagador(p)}
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
        <Text style={{ color: "#6b7280" }}>
          Mostrando {gastosFiltrados.length} de {gastos.length}
        </Text>
      </View>

      <FlatList
        data={gastosFiltrados}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => <ItemGasto gasto={item} />}
        ListEmptyComponent={<Text>No hay gastos que coincidan.</Text>}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      {/* Botón flotante para abrir modal */}
      <Link href="/agregar-gasto" asChild>
        <Pressable
          style={{
            position: "absolute",
            right: 20,
            bottom: 30,
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 24,
            backgroundColor: "#2563eb",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            + Agregar Gasto
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
