import { supabase } from '../../shared/infra/supabase/client';

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: 'entrenador' | 'usuario'
) {
  // Paso 1: crear cuenta en Auth
  const { data: authData, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = authData.user?.id;
  if (!userId) throw new Error('No se pudo obtener el ID del usuario');

  // Paso 2: crear perfil asociado en la tabla profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: userId, full_name: fullName, role });

  if (profileError) throw profileError;

  return {
    ...authData,
    message: 'Cuenta creada. Revisa tu correo electrónico para confirmar tu cuenta antes de ingresar.'
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
