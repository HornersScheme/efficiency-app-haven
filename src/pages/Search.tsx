import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { App, Category } from '@/types';
import AppCard from '@/components/AppCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';
import { useFeaturedApps } from '@/contexts/FeaturedAppsContext';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: userUpvotes } = useUserUpvotes();
  const { getFeaturedRank } = useFeaturedApps();

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

  const { data: apps, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return [];

      const { data, error } = await supabase
        .from('apps')
        .select(`*, images:app_images(*)`)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,slogan.ilike.%${query}%`)
        .order('upvotes_count', { ascending: false });

      if (error) throw error;
      return data as unknown as App[];
    },
    enabled: !!query
  });

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
          <h1 className="text-3xl font-bold mb-8">
            Search Results for "{query}"
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : apps?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No apps found matching your search.</p>
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

export default Search; 