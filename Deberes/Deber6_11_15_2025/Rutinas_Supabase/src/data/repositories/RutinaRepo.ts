import { supabase } from '../../shared/infra/supabase/client';

export async function listMyRutinas() {
  const { data, error } = await supabase
    .from('rutinas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRutina(id: string) {
  const { data, error } = await supabase
    .from('rutinas')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createRutina(payload: { titulo: string; descripcion?: string; dificultad?: 'principiante'|'intermedio'|'avanzado' }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');
  const { data, error } = await supabase
    .from('rutinas')
    .insert({ entrenador_id: user.id, ...payload })
    .select()
    .single();
  if (error) throw error;
  return data;
}
