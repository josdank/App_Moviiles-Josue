import React, { useState } from "react";
import { Text, View } from "react-native";
import FAB from "../components/fab";
 
export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
 
  const onKey = (d: string) => {
    setDisplay((prev) => (prev === "0" ? d : prev + d));
    // aquí integrarán operadores, clear, punto, igual, etc.
  };
 
  const Row = ({ children }: { children: React.ReactNode }) => (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
      {children}
    </View>
  );
 
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          minHeight: 120,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 64, fontWeight: "300" }}>
          {display}
        </Text>
      </View>
      <Row>
        <FAB digit="1" onKey={onKey} />
        <FAB digit="2" onKey={onKey} />
        <FAB digit="3" onKey={onKey} />
        <FAB digit="4" onKey={onKey} />
      </Row>
    </View>
  );
}
 
 