import { View } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        padding: theme.spacing(2),
        borderRadius: theme.radius,
        marginVertical: theme.spacing(1),
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      {children}
    </View>
  );
}
