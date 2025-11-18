import { Pressable, Text } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.primary,
        padding: theme.spacing(2),
        borderRadius: theme.radius,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}
