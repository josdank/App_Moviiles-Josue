import { TextInput } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function Input(props: any) {
  return (
    <TextInput
      {...props}
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        padding: theme.spacing(2),
        borderRadius: theme.radius,
        marginVertical: theme.spacing(1),
      }}
      placeholderTextColor={theme.colors.subtext}
    />
  );
}
