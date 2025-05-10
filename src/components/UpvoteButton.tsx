import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UpvoteButtonProps {
  appId: string;
  initialUpvotes: number;
  isUpvoted: boolean;
}

const UpvoteButton = ({ appId, initialUpvotes, isUpvoted: propIsUpvoted }: UpvoteButtonProps) => {
  const { isAuthenticated, user } = useAuth();
  const [upvotes, setUpvotes] = useState(typeof initialUpvotes === 'number' ? initialUpvotes : 0);
  const [isUpvoted, setIsUpvoted] = useState(!!propIsUpvoted);
  const queryClient = useQueryClient();

  // Sync prop to local state
  useEffect(() => {
    setIsUpvoted(!!propIsUpvoted);
  }, [propIsUpvoted]);

  // Subscribe to real-time upvote changes
  useEffect(() => {
    const channel = supabase
      .channel(`upvotes-${appId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'upvotes',
          filter: `app_id=eq.${appId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUpvotes(prev => prev + 1);
            if (payload.new.user_id === user?.id) {
              setIsUpvoted(true);
            }
          } else if (payload.eventType === 'DELETE') {
            setUpvotes(prev => Math.max(0, prev - 1));
            if (payload.old.user_id === user?.id) {
              setIsUpvoted(false);
            }
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appId, user?.id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to upvote apps');
      return;
    }
    try {
      if (isUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .match({ app_id: appId, user_id: user!.id });
        if (error) throw error;
        setIsUpvoted(false);
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({ app_id: appId, user_id: user!.id });
        if (error) {
          if (error.code === '23505') {
            // Remove upvote if duplicate
            const { error: delError } = await supabase
              .from('upvotes')
              .delete()
              .match({ app_id: appId, user_id: user!.id });
            if (delError) throw delError;
            setIsUpvoted(false);
            return;
          } else {
            throw error;
          }
        }
        setIsUpvoted(true);
      }
      // Invalidate all relevant queries to ensure upvotes_count is fresh
      queryClient.invalidateQueries({ queryKey: ['app-detail', appId] });
      queryClient.invalidateQueries({ queryKey: ['all-apps-featured'] });
      queryClient.invalidateQueries({ queryKey: ['top-ranked-page'] });
      queryClient.invalidateQueries({ queryKey: ['category-apps'] });
      queryClient.invalidateQueries({ queryKey: ['new-apps-page'] });
      queryClient.invalidateQueries({ queryKey: ['apps-by-category-home'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-2 ${isUpvoted ? 'text-efficiency-600' : 'text-gray-500'}`}
      onClick={handleUpvote}
    >
      <ThumbsUp
        size={16}
        className={isUpvoted ? 'fill-efficiency-600 text-efficiency-600' : 'text-gray-400'}
        fill={isUpvoted ? 'currentColor' : 'none'}
      />
      <span>{typeof upvotes === 'number' && !isNaN(upvotes) ? upvotes : 0}</span>
    </Button>
  );
};

export default UpvoteButton; 