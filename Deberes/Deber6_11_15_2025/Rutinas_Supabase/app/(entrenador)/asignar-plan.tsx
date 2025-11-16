import { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Input } from '../../src/presentation/components/Input';
import { Button } from '../../src/presentation/components/Button';
import { theme } from '../../src/shared/styles/theme';
import { assignPlan } from '../../src/data/repositories/PlanRepo';

export default function AsignarPlan() {
  const [rutinaId, setRutinaId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [inicio, setInicio] = useState(new Date().toISOString().slice(0, 10));
  const [fin, setFin] = useState('');
  const [objetivo, setObjetivo] = useState('Progreso semanal');

  const onAssign = async () => {
    try {
      await assignPlan(rutinaId.trim(), usuarioId.trim(), inicio, fin || undefined, objetivo);
      Alert.alert('Asignado', 'Plan creado');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Asignar plan</Text>
      <Input label="Rutina ID" value={rutinaId} onChangeText={setRutinaId} />
      <Input label="Usuario ID" value={usuarioId} onChangeText={setUsuarioId} />
      <Input label="Inicio (YYYY-MM-DD)" value={inicio} onChangeText={setInicio} />
      <Input label="Fin (opcional)" value={fin} onChangeText={setFin} />
      <Input label="Objetivo" value={objetivo} onChangeText={setObjetivo} />
      <Button title="Asignar" onPress={onAssign} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.spacing(2), backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: theme.spacing(2) }
});
