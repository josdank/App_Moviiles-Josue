import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Nested routes like (tabs), auth, recipe, etc. are handled by their own _layout.tsx files */}
    </Stack>
  );
}
