import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { theme } from '../../src/shared/styles/theme';
import { listMyRutinas, createRutina } from '../../src/data/repositories/RutinaRepo';
import { Card } from '../../src/presentation/components/Card';
import { Button } from '../../src/presentation/components/Button';
import { useRouter } from 'expo-router';

export default function Rutinas() {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const router = useRouter();

  const load = async () => {
    try { setRutinas(await listMyRutinas()); } catch (e: any) { Alert.alert('Error', e.message); }
  };
  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    try {
      const r = await createRutina({ titulo: `Rutina ${Date.now()}`, descripcion: 'Demo', dificultad: 'intermedio' });
      setRutinas((prev) => [r, ...prev]);
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Mis rutinas</Text>
      <Button title="Crear rutina" onPress={onCreate} />
      <FlatList
        data={rutinas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(entrenador)/rutina/${item.id}`)}>
            <Card>
              <Text style={styles.itemTitle}>{item.titulo}</Text>
              <Text style={styles.itemSub}>{item.descripcion}</Text>
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
