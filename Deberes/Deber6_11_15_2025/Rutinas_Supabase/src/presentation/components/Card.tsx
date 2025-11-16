import { View, StyleSheet } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing(1.5)
  }
});
