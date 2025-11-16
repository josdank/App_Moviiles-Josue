import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '../src/presentation/stores/session';

export default function Index() {
  const router = useRouter();
  const { loading, profile, refresh } = useSession();

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    if (!loading) {
      if (!profile) router.replace('/(auth)/login');
      else if (profile.role === 'entrenador') router.replace('/(entrenador)/rutinas');
      else router.replace('/(usuario)/planes');
    }
  }, [loading, profile]);

  return null;
}
