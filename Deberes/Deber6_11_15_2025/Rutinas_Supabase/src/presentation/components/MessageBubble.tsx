import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../shared/styles/theme';

export function MessageBubble({ content, isMine }: { content: string; isMine: boolean }) {
  return (
    <View style={[styles.row, isMine ? styles.right : styles.left]}>
      <View style={[styles.bubble, isMine ? styles.mine : styles.other]}>
        <Text style={{ color: isMine ? '#052e17' : theme.colors.text }}>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', padding: theme.spacing(1.5), borderRadius: theme.radius },
  mine: { backgroundColor: theme.colors.primary },
  other: { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }
});
