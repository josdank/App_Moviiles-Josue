// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GastosProvider } from "../context/GastosContexto"; // <- CON LLAVES

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GastosProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="agregar-gasto"
            options={{ presentation: "modal", title: "Nuevo gasto" }}
          />
        </Stack>
      </GastosProvider>
    </SafeAreaProvider>
  );
}
