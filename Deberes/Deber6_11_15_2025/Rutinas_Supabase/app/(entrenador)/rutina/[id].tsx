import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '../../../src/shared/styles/theme';
import { getRutina } from '../../../src/data/repositories/RutinaRepo';
import { Button } from '../../../src/presentation/components/Button';
import { pickAndUploadRoutineVideo } from '../../../src/shared/utils/uploadVideo';
import { assignPlan, getPlansByRutina } from '../../../src/data/repositories/PlanRepo';

export default function RutinaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rutina, setRutina] = useState<any>(null);
  const [planes, setPlanes] = useState<any[]>([]);

  const load = async () => {
    try {
      setRutina(await getRutina(id!));
      setPlanes(await getPlansByRutina(id!));
    } catch (e: any) { Alert.alert('Error', e.message); }
  };
  useEffect(() => { load(); }, [id]);

  const onUploadVideo = async () => {
    try {
      const url = await pickAndUploadRoutineVideo(id!, 'sentadillas');
      Alert.alert('Video subido', url || 'Sin URL');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const onAssignPlanDemo = async () => {
    try {
      // Reemplaza por un usuario real (id de profiles con rol 'usuario')
      const usuarioId = rutina.entrenador_id; // DEMO: cambia por un usuario válido
      const plan = await assignPlan(id!, usuarioId, new Date().toISOString().slice(0, 10), undefined, 'Progreso semanal');
      setPlanes((prev) => [plan, ...prev]);
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.wrap}>
      {rutina && <>
        <Text style={styles.title}>{rutina.titulo}</Text>
        <Text style={styles.sub}>{rutina.descripcion}</Text>
        <Button title="Subir video demostrativo" onPress={onUploadVideo} />
        <Button title="Asignar plan (demo)" onPress={onAssignPlanDemo} />
        <Text style={styles.section}>Planes asociados</Text>
        {planes.map(p => (
          <Text key={p.id} style={{ color: theme.colors.text }}>{p.id} - {p.objetivo || 'sin objetivo'}</Text>
        ))}
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.spacing(2), backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: theme.spacing(1) },
  sub: { color: theme.colors.subtext, marginBottom: theme.spacing(2) },
  section: { color: theme.colors.text, marginTop: theme.spacing(2), fontWeight: '600' }
});
