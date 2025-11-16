import 'dotenv/config';

export default {
  expo: {
    name: 'RN Supabase Routines',
    slug: 'rn-supabase-routines',
    scheme: 'rnsupabase',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: { image: './assets/splash-icon.png', resizeMode: 'contain', backgroundColor: '#0f172a' },
    android: {
      package: 'com.josue.rutinas',
      adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#0f172a' }
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    },
    plugins: ['expo-router']
  }
};
