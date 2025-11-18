import { Stack } from 'expo-router';
import { View } from 'react-native';
import { theme } from '../shared/styles/theme';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
