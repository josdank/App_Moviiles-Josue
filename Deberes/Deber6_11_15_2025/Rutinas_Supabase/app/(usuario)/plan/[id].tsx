import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '../../../src/shared/styles/theme';
import { getPlan } from '../../../src/data/repositories/PlanRepo';
import { listProgreso, logProgreso } from '../../../src/data/repositories/ProgresoRepo';
import { listChat, subscribeToPlanChat, sendMessage, ChatMessage } from '../../../src/data/repositories/ChatRepo';
import { Button } from '../../../src/presentation/components/Button';
import { MessageBubble } from '../../../src/presentation/components/MessageBubble';
import { pickAndUploadProgressPhoto } from '../../../src/shared/utils/upload';
import { supabase } from '../../../src/shared/infra/supabase/client';

export default function PlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plan, setPlan] = useState<any>(null);
  const [prog, setProg] = useState<any[]>([]);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [valor, setValor] = useState('0');
  const [notas, setNotas] = useState('');
  const [text, setText] = useState('');
  const [myId, setMyId] = useState<string>('');

  useEffect(() => { (async () => {
    const planData = await getPlan(id!);
    setPlan(planData);
    setProg(await listProgreso(id!));
    setMsgs(await listChat(id!));
    const { data: { user } } = await supabase.auth.getUser();
    setMyId(user?.id || '');
  })(); }, [id]);

    useEffect(() => {
    if (!id) return;

    const unsub = subscribeToPlanChat(id, (m) => {
        setMsgs((prev) => [...prev, m]);
    });

    return () => {
        unsub();
    };
    }, [id]);


  const onLog = async () => {
    try {
      const num = Number(valor);
      const entry = await logProgreso(id!, num, notas || undefined);
      setProg((p) => [entry, ...p]);
      setNotas('');
      setValor('0');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const onLogWithPhoto = async () => {
    try {
      const url = await pickAndUploadProgressPhoto(id!);
      const num = Number(valor);
      const entry = await logProgreso(id!, num, notas || undefined, url || undefined);
      setProg((p) => [entry, ...p]);
      setNotas(''); setValor('0');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const onSend = async () => {
    try {
      if (!text.trim()) return;
      const m = await sendMessage(id!, text.trim());
      setText('');
      setMsgs((prev) => [...prev, m]);
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.wrap}>
      {plan && <>
        <Text style={styles.title}>{plan.rutinas?.titulo || 'Plan'}</Text>

        <Text style={styles.section}>Registrar progreso</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput style={styles.input} value={valor} onChangeText={setValor} keyboardType="numeric" placeholder="Valor" placeholderTextColor={theme.colors.subtext} />
          <TextInput style={styles.input} value={notas} onChangeText={setNotas} placeholder="Notas" placeholderTextColor={theme.colors.subtext} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: theme.spacing(1) }}>
          <Button title="Guardar" onPress={onLog} />
          <Button title="Guardar + foto" onPress={onLogWithPhoto} />
        </View>

        <Text style={styles.section}>Progreso</Text>
        <FlatList
          data={prog}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: theme.colors.text }}>{item.fecha} - {item.valor}</Text>
              {item.media_url && <Text style={{ color: theme.colors.subtext }}>{item.media_url}</Text>}
            </View>
          )}
        />

        <Text style={styles.section}>Chat</Text>
        <FlatList
          data={msgs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MessageBubble content={item.content} isMine={item.sender_id === myId} />
          )}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Mensaje..." placeholderTextColor={theme.colors.subtext} />
          <Button title="Enviar" onPress={onSend} />
        </View>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.spacing(2), backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: theme.spacing(2) },
  section: { color: theme.colors.text, marginTop: theme.spacing(2), marginBottom: theme.spacing(1), fontWeight: '600' },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card, color: theme.colors.text,
    borderRadius: theme.radius, paddingHorizontal: theme.spacing(1.5), paddingVertical: theme.spacing(1),
    borderWidth: 1, borderColor: theme.colors.border
  }
});
