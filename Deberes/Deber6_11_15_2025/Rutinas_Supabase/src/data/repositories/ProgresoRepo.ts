import { supabase } from '../../shared/infra/supabase/client';

export async function logProgreso(planId: string, valor: number, notas?: string, mediaUrl?: string) {
  const { data, error } = await supabase
    .from('progreso')
    .insert({ plan_id: planId, valor, notas, media_url: mediaUrl })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listProgreso(planId: string) {
  const { data, error } = await supabase
    .from('progreso')
    .select('*')
    .eq('plan_id', planId)
    .order('fecha', { ascending: false });
  if (error) throw error;
  return data;
}
