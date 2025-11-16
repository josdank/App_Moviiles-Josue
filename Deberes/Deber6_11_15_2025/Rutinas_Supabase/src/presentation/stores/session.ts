import { create } from 'zustand';
import { supabase } from '../../shared/infra/supabase/client';

type Profile = { id: string; role: 'entrenador' | 'usuario'; full_name?: string; avatar_url?: string };

type SessionState = {
  loading: boolean;
  profile: Profile | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useSession = create<SessionState>((set) => ({
  loading: true,
  profile: null,
  refresh: async () => {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ profile: null, loading: false });
      return;
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) {
      set({ profile: null, loading: false });
      return;
    }
    set({ profile: data as Profile, loading: false });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ profile: null });
  }
}));
