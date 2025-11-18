import { View, Text } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function MessageBubble({ content, sender, mine }: { content: string; sender: string; mine: boolean }) {
  return (
    <View
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        backgroundColor: mine ? theme.colors.primary : theme.colors.card,
        padding: theme.spacing(2),
        borderRadius: theme.radius,
        marginVertical: theme.spacing(1),
        maxWidth: '80%',
      }}
    >
      <Text style={{ color: theme.colors.text }}>{content}</Text>
      <Text style={{ fontSize: 10, color: theme.colors.subtext }}>{sender}</Text>
    </View>
  );
}
