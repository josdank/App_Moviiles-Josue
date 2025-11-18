import { supabase } from '../../shared/infra/supabase/client';

export async function registrarProgreso(planId: string, notas?: string, valor?: number, media_url?: string) {
  const { error } = await supabase
    .from('progreso')
    .insert({ plan_id: planId, notas, valor, media_url });
  if (error) throw error;
}

export async function listarProgreso(planId: string) {
  const { data, error } = await supabase
    .from('progreso')
    .select('*')
    .eq('plan_id', planId)
    .order('fecha', { ascending: false });
  if (error) throw error;
  return data;
}
