import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function Input({ label, value, onChangeText, secure, keyboardType = 'default', placeholder }: {
  label: string; value: string; onChangeText: (t: string) => void; secure?: boolean; keyboardType?: any; placeholder?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!!secure}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subtext}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.spacing(1.5) },
  label: { color: theme.colors.subtext, marginBottom: theme.spacing(0.5) },
  input: {
    backgroundColor: theme.colors.card, color: theme.colors.text,
    borderRadius: theme.radius, paddingHorizontal: theme.spacing(1.5), paddingVertical: theme.spacing(1),
    borderWidth: 1, borderColor: theme.colors.border
  }
});
