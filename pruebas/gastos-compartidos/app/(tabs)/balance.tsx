import { View, Text, ScrollView } from "react-native";
import { useGastos } from "../../context/GastosContexto";
import { calcularBalances } from "../../librerias/balances";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native";
import GraficoBarras from "../../components/GraficoBarras";

export default function Balance() {
  const { gastos } = useGastos();
  const { totalPorPersona, promedio, deudas } = calcularBalances(gastos);

  const datosGrafico = Object.entries(totalPorPersona).map(([persona, total]) => ({
    x: persona,
    y: total,
  }));

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>Totales por persona</Text>
      {Object.entries(totalPorPersona).map(([p, v]) => (
        <Text key={p} style={{ fontSize: 16 }}>
          {p}: ${v.toFixed(2)}
        </Text>
      ))}

      <Text style={{ marginTop: 8, fontWeight: "700", fontSize: 16 }}>
        Promedio: ${promedio.toFixed(2)}
      </Text>

      <Text style={{ marginTop: 20, fontWeight: "700", fontSize: 18 }}>
        Gráfico de gastos por persona
      </Text>
      <GraficoBarras data={datosGrafico} />

      <Text style={{ marginTop: 24, fontWeight: "700", fontSize: 18 }}>
        Quién debe a quién
      </Text>
      {deudas.length === 0 ? (
        <Text>No hay deudas pendientes.</Text>
      ) : (
        deudas.map((d, i) => (
          <Text key={i} style={{ fontSize: 16 }}>
            {d.de} debe a {d.a} ${d.monto.toFixed(2)}
          </Text>
        ))
      )}
    </ScrollView>
  );
}
