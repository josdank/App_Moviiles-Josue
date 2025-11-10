import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { Colors } from '../src/presentation/styles/globalStyles';

export default function RootLayout() {
    return (
        <>
            <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.cardBackground, }, headerTintColor: Colors.text, }}>

                <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />

                <Stack.Screen name="characters/[id]" options={{ title: "Detalle del Personaje" }} />

            </Stack>

            <StatusBar style="light" />
        </>
    );
}