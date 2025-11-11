import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { Buffer } from "buffer";

// Asegurar Buffer global (algunas librerías esperan global.Buffer)
if (typeof (globalThis as any).Buffer === "undefined") {
  (globalThis as any).Buffer = Buffer;
}

// Obtenemos las credenciales desde las variables de entorno
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validamos que las variables de entorno estén configuradas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Faltan las variables de entorno EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
      "Asegúrate de tener un archivo .env con estas variables configuradas."
  );
}

// Creamos el cliente de Supabase usando AsyncStorage para persistir sesión
// Adapter para que Supabase use Expo SecureStore (funciona en Expo Go y evita SQLite nativo)
const secureStoreAdapter = {
  async getItem(key: string) {
    const value = await SecureStore.getItemAsync(key);
    return value;
  },
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
