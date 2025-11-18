import { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import {  listMyRutinas, createRutina } from '../../data/repositories/RutinaRepo';
import { Input } from '../../presentation/components/Input';
import { Button } from '../../presentation/components/Button';
import { Card } from '../../presentation/components/Card';
import { theme } from '../../shared/styles/theme';

export default function RutinasScreen() {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dificultad, setDificultad] = useState<'principiante'|'intermedio'|'avanzado'>('principiante');

  const load = async () => setRutinas(await  listMyRutinas());
  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    try {
      await createRutina({ titulo, descripcion, dificultad });
      setTitulo(''); setDescripcion('');
      Alert.alert('Éxito', 'Rutina creada');
      load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ flex:1, padding: theme.spacing(2) }}>
      <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 20 }}>Mis rutinas</Text>
      <Card>
        <Input placeholder="Título" value={titulo} onChangeText={setTitulo} />
        <Input placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
        <View style={{ flexDirection:'row', gap: theme.spacing(1) }}>
          <Button title="Principiante" onPress={() => setDificultad('principiante')} />
          <Button title="Intermedio" onPress={() => setDificultad('intermedio')} />
          <Button title="Avanzado" onPress={() => setDificultad('avanzado')} />
        </View>
        <Button title="Crear rutina" onPress={onCreate} />
      </Card>

      <FlatList
        data={rutinas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: theme.colors.text, fontWeight:'600' }}>{item.titulo}</Text>
            <Text style={{ color: theme.colors.subtext }}>{item.descripcion}</Text>
            <Text style={{ color: theme.colors.subtext }}>Dificultad: {item.dificultad}</Text>
          </Card>
        )}
      />
    </View>
  );
}
