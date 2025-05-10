import { useQuery } from '@tanstack/react-query';
import AppCard from './AppCard';
import { supabase } from '@/integrations/supabase/client';
import { App } from '@/types';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';

const FeaturedApps = () => {
  const { data: apps, isLoading } = useQuery({
    queryKey: ['featured-apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select(`*, images:app_images(*)`)
        .order('upvotes_count', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data as unknown as App[];
    }
  });

  const { data: userUpvotes } = useUserUpvotes();

  const addIsUpvoted = (apps?: App[]) => {
    if (!apps) return [];
    if (!userUpvotes) return apps.map(app => ({ ...app, is_upvoted: false }));
    return apps.map(app => ({ ...app, is_upvoted: userUpvotes.includes(app.id) }));
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">Featured Apps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark">Featured Apps</h2>
          <a href="/top-ranked" className="text-efficiency-600 hover:text-efficiency-700">
            View all
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {addIsUpvoted(apps)?.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedApps;
