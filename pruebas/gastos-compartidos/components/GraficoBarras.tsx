import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

type Punto = { x: string; y: number };

export default function GraficoBarras({ data }: { data: Punto[] }) {
  if (!data || data.length === 0) {
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <Text style={{ color: "#6b7280" }}>
          No hay datos suficientes para mostrar el gráfico.
        </Text>
      </View>
    );
  }

  const labels = data.map((d) => d.x);
  const valores = data.map((d) => d.y);

  const width = Math.min(Dimensions.get("window").width - 32, 600);
  const height = 220;

  return (
    <View style={{ alignItems: "center", paddingVertical: 10 }}>
      <BarChart
        data={{
          labels,
          datasets: [{ data: valores }],
        }}
        width={width}
        height={height}
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // azul
          labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
          barPercentage: 0.6,
          propsForBackgroundLines: { stroke: "#e5e7eb" },
        }}
        style={{ borderRadius: 12 }}
        verticalLabelRotation={0}
      />
    </View>
  );
}
