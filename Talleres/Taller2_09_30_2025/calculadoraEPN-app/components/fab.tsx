import React, { memo } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
 
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
 
export interface FABProps
  extends Omit<PressableProps, "onPress" | "children" | "style"> {
  digit: Digit; // dígito que emite
  onKey: (digit: Digit) => void; // callback
  label?: string; // por si quieres mostrar algo distinto
  size?: number; // diámetro (circular) o alto (extendido)
  extended?: boolean; // para el "0" ancho doble
  bg?: string; // color de fondo (default pensado para fondo negro)
  color?: string; // color de texto
  style?: ViewStyle;
}
 
const FAB = memo(function FAB({
  digit,
  onKey,
  label,
  size = 64,
  extended = false,
  bg = "#2f2f2f",
  color = "#ffffff",
  style,
  ...rest
}: FABProps) {
  const shape: ViewStyle = extended
    ? { height: size, borderRadius: size / 2, paddingHorizontal: 24 }
    : { width: size, height: size, borderRadius: size / 2 };
 
  return (
<Pressable
      onPress={() => onKey(digit)}
      android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: false }}
      style={[styles.base, shape, { backgroundColor: bg }, style]}
      {...rest}
>
<Text
        style={[styles.label, { color, fontSize: Math.min(22, size * 0.35) }]}
>
        {label ?? digit}
</Text>
</Pressable>
  );
});
 
const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: {
    fontWeight: "600",
  },
});
 
export default FAB;