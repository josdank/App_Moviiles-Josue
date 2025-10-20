import AsyncStorage from "@react-native-async-storage/async-storage";
const CLAVE = "gastos_v1";

export async function guardarGastos(data: any) {
  await AsyncStorage.setItem(CLAVE, JSON.stringify(data));
}
export async function cargarGastos() {
  const raw = await AsyncStorage.getItem(CLAVE);
  return raw ? JSON.parse(raw) : [];
}
