import { supabase } from '../../shared/infra/supabase/client';

export async function enviarMensaje(planId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { error } = await supabase
    .from('chat_messages')
    .insert({ plan_id: planId, sender_id: user.id, content });
  if (error) throw error;
}

export function suscribirChat(planId: string, onMessage: (msg: any) => void) {
  return supabase
    .channel(`chat:${planId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chat_messages', filter: `plan_id=eq.${planId}` },
      (payload) => onMessage(payload.new)
    )
    .subscribe();
}

export async function listarMensajes(planId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}
