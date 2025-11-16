import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function Button({ title, onPress, variant = 'primary', style }: {
  title: string; onPress: () => void; variant?: 'primary'|'ghost'; style?: ViewStyle;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, variant === 'primary' ? styles.primary : styles.ghost, style]}>
      <Text style={variant === 'primary' ? styles.primaryText : styles.ghostText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: theme.spacing(1.5), borderRadius: theme.radius, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  ghost: { backgroundColor: 'transparent' },
  primaryText: { color: '#052e17', fontWeight: '600' },
  ghostText: { color: theme.colors.text, fontWeight: '600' }
});
