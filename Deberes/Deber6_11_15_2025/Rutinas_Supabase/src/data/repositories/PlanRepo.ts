import { supabase } from '../../shared/infra/supabase/client';

export async function assignPlan(rutinaId: string, usuarioId: string, inicio: string, fin?: string, objetivo?: string) {
  const { data, error } = await supabase
    .from('planes_entrenamiento')
    .insert({ rutina_id: rutinaId, usuario_id: usuarioId, fecha_inicio: inicio, fecha_fin: fin, objetivo })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getPlansByRutina(rutinaId: string) {
  const { data, error } = await supabase
    .from('planes_entrenamiento')
    .select('*')
    .eq('rutina_id', rutinaId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getMyPlans() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');
  const { data, error } = await supabase
    .from('planes_entrenamiento')
    .select('*, rutinas(*)')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPlan(id: string) {
  const { data, error } = await supabase
    .from('planes_entrenamiento')
    .select('*, rutinas(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
