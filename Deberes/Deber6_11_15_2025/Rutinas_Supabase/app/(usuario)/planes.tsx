import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/shared/styles/theme';
import { getMyPlans } from '../../src/data/repositories/PlanRepo';
import { Card } from '../../src/presentation/components/Card';

export default function MisPlanes() {
  const [planes, setPlanes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => { (async () => {
    try { setPlanes(await getMyPlans()); } catch (e: any) { Alert.alert('Error', e.message); }
  })(); }, []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Mis planes</Text>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(usuario)/plan/${item.id}`)}>
            <Card>
              <Text style={styles.itemTitle}>{item.rutinas?.titulo || 'Rutina'}</Text>
              <Text style={styles.itemSub}>{item.objetivo || 'Sin objetivo'}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.spacing(2), backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: theme.spacing(2) },
  itemTitle: { color: theme.colors.text, fontWeight: '600' },
  itemSub: { color: theme.colors.subtext, marginTop: 4 }
});
