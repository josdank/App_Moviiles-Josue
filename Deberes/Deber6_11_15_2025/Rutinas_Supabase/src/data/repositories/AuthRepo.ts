import { supabase } from '../../shared/infra/supabase/client';
import { Alert } from 'react-native';

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: 'entrenador' | 'usuario'
) {
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role }
    }
  });
  if (error) throw error;

  // Si confirmación de correo está activada, no habrá sesión inmediata
  if (!authData.session) {
    Alert.alert(
      'Registro exitoso',
      'Cuenta creada. Revisa tu correo y confirma tu cuenta para poder ingresar.'
    );
  } else {
    Alert.alert(
      'Registro exitoso',
      'Cuenta creada y confirmada. Ya puedes ingresar.'
    );
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
