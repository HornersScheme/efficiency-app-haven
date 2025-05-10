import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useUserUpvotes() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ['user-upvotes', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('upvotes')
        .select('app_id');
      if (error) throw error;
      return data?.map((u: { app_id: string }) => u.app_id) || [];
    },
    enabled: !!userId
  });
} 