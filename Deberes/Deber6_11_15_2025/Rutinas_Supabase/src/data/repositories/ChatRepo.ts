import { supabase } from '../../shared/infra/supabase/client';

export type ChatMessage = {
  id: number;
  plan_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export async function sendMessage(planId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ plan_id: planId, sender_id: user.id, content })
    .select()
    .single();
  if (error) throw error;
  return data as ChatMessage;
}

export function subscribeToPlanChat(planId: string, onMessage: (msg: ChatMessage) => void) {
  const channel = supabase
    .channel(`chat:${planId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `plan_id=eq.${planId}`
    }, (payload) => onMessage(payload.new as ChatMessage))
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function listChat(planId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as ChatMessage[];
}
