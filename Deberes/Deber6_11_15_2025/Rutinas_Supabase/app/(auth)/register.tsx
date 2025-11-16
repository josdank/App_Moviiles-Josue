import { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { signUp } from '../../src/data/repositories/AuthRepo';
import { useSession } from '../../src/presentation/stores/session';
import { Input } from '../../src/presentation/components/Input';
import { Button } from '../../src/presentation/components/Button';
import { theme } from '../../src/shared/styles/theme';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState<'entrenador'|'usuario'>('usuario');
  const { refresh } = useSession();
  const router = useRouter();

  const onRegister = async () => {
    try {
      await signUp(email.trim(), pass, name.trim(), role);
      await refresh();
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Input label="Nombre completo" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label="Contraseña" value={pass} onChangeText={setPass} secure />

      <Text style={styles.label}>Rol</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: theme.spacing(2) }}>
        <TouchableOpacity onPress={() => setRole('usuario')}>
          <Text style={{ color: role === 'usuario' ? theme.colors.primary : theme.colors.text }}>Usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('entrenador')}>
          <Text style={{ color: role === 'entrenador' ? theme.colors.primary : theme.colors.text }}>Entrenador</Text>
        </TouchableOpacity>
      </View>

      <Button title="Registrarme" onPress={onRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.spacing(2), backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: theme.spacing(2) },
  label: { color: theme.colors.subtext, marginBottom: theme.spacing(1) }
});
