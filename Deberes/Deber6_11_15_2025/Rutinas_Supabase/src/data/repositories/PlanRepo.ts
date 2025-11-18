import { supabase } from '../../shared/infra/supabase/client';

export async function asignarPlan(rutinaId: string, usuarioId: string, fechaInicio: string, objetivo?: string) {
  const { data, error } = await supabase
    .from('planes_entrenamiento')
    .insert({ rutina_id: rutinaId, usuario_id: usuarioId, fecha_inicio: fechaInicio, objetivo })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function listPlanesUsuario() {
  const { data, error } = await supabase
    .from('planes_entrenamiento')
    .select(`
      id, fecha_inicio, fecha_fin, objetivo,
      rutina:rutina_id (titulo, descripcion, dificultad)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
