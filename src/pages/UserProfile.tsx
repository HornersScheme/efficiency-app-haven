import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { App, Category } from '@/types';
import { useState } from 'react';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: userUpvotes } = useUserUpvotes();

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: ['public-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });

  // Fetch all apps by this user
  const { data: apps, isLoading } = useQuery({
    queryKey: ['user-apps', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('apps')
        .select('*, category:categories(*), images:app_images(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!userId,
  });

  // Helper to add is_upvoted
  const addIsUpvoted = (apps?: any[]) => {
    if (!apps) return [];
    if (!userUpvotes) return apps.map(app => ({ ...app, is_upvoted: false }));
    return apps.map(app => ({ ...app, is_upvoted: userUpvotes.includes(app.id) }));
  };

  // Fallback username
  const fallbackUsername = apps && apps.length > 0 && apps[0].user_email
    ? apps[0].user_email.split('@')[0]
    : 'Developer';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">
            {profile?.display_name || `${fallbackUsername}'s Apps`}
          </h1>
          <div className="text-gray-500 mb-8">
            {profile?.bio || (fallbackUsername !== 'Developer' ? `@${fallbackUsername}` : '')}
          </div>
          {isLoading ? (
            <div>Loading apps...</div>
          ) : apps && apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {addIsUpvoted(apps).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">This developer hasn't submitted any apps yet.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile; 