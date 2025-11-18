import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { listPlanesUsuario } from '../../data/repositories/PlanRepo';
import { useRouter } from 'expo-router';
import { Card } from '../../presentation/components/Card';
import { theme } from '../../shared/styles/theme';

export default function PlanesUsuarioScreen() {
  const [planes, setPlanes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => { (async () => setPlanes(await listPlanesUsuario()))(); }, []);

  return (
    <View style={{ flex:1, padding: theme.spacing(2) }}>
      <Text style={{ color: theme.colors.text, fontWeight:'700', fontSize: 20 }}>Mis planes</Text>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/plan/${item.id}`)}>
            <Card>
              <Text style={{ color: theme.colors.text, fontWeight:'600' }}>{item.rutina.titulo}</Text>
              <Text style={{ color: theme.colors.subtext }}>{item.objetivo ?? 'Sin objetivo'}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
