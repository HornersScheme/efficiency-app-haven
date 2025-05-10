import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { App, Category } from '@/types';
import AppCard from '@/components/AppCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UpvoteButton from '@/components/UpvoteButton';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';
import { useFeaturedApps } from '@/contexts/FeaturedAppsContext';

const TopRanked = () => {
  const { data: apps, isLoading } = useQuery({
    queryKey: ['top-ranked-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*, category:categories(*), images:app_images(*)')
        .order('upvotes_count', { ascending: false });
      if (error) throw error;
      return data as unknown as App[];
    }
  });

  const { data: userUpvotes } = useUserUpvotes();

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories' as any)
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return ((data || []) as any[]).filter(row => row && row.id && row.name && row.slug) as Category[];
    }
  });

  const { getFeaturedRank } = useFeaturedApps();

  const addIsUpvoted = (apps?: App[]) => {
    if (!apps) return [];
    if (!userUpvotes) return apps.map(app => ({ ...app, is_upvoted: false }));
    return apps.map(app => ({ ...app, is_upvoted: userUpvotes.includes(app.id) }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Top Ranked Apps</h1>
          {/* Leaderboard */}
          {isLoading ? (
            <div className="mb-12">Loading leaderboard...</div>
          ) : (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
              <ol className="bg-white rounded-lg shadow divide-y divide-gray-100">
                {apps?.slice(0, 10).map((app, idx) => (
                  <li key={app.id} className="flex items-center px-4 py-3">
                    <span className="text-lg font-bold w-8 text-center">{idx + 1}</span>
                    <img src={app.logo_url} alt={app.name} className="w-10 h-10 rounded-lg object-cover mx-3" />
                    <span className="flex-1 font-medium text-dark truncate">{app.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {/* Grid of apps */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {addIsUpvoted(apps)?.map((app) => {
                const category = categories?.find(c => c.id === app.category_id);
                const featuredRank = getFeaturedRank(app.id);
                return <AppCard key={app.id} app={{ ...app, category }} featuredRank={featuredRank} />;
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopRanked; 