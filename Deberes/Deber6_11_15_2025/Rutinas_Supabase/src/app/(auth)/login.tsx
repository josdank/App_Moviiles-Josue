import { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSession } from '../../presentation/stores/session';
import { signIn } from '../../data/repositories/AuthRepo';
import { Input } from '../../presentation/components/Input';
import { Button } from '../../presentation/components/Button';
import { theme } from '../../shared/styles/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { refresh } = useSession();
  const router = useRouter();

  const onLogin = async () => {
    try {
      await signIn(email.trim(), pass);
      await refresh();
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Ingresar</Text>
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label="Contraseña" value={pass} onChangeText={setPass} secure />
      <Button title="Entrar" onPress={onLogin} />
      <Text style={styles.link}><Link href="/(auth)/register">Crear cuenta</Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.spacing(2), backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: theme.spacing(2) },
  link: { color: theme.colors.subtext, marginTop: theme.spacing(1.5) }
});
