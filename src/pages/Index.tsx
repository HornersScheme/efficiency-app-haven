import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SponsoredApp from '@/components/SponsoredApp';
import FeaturedApps from '@/components/FeaturedApps';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Category, App } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useFeaturedApps } from '@/contexts/FeaturedAppsContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { getFeaturedRank, featuredApps } = useFeaturedApps();

  // Fetch all upvotes for the current user
  const { data: userUpvotes } = useQuery({
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

  // Fetch all apps for featured section
  const { data: allApps, isLoading: isLoadingAllApps } = useQuery({
    queryKey: ['all-apps-featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*, images:app_images(*)');
      if (error) throw error;
      return (data || []).map((app: any) => ({
        ...app,
        category_id: app.category_id || app.category || '',
        upvotes_count: typeof app.upvotes_count === 'number' ? app.upvotes_count : 0,
      })) as App[];
    }
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories' as any)
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      // Cast the result to any and then filter/map to Category[]
      return ((data || []) as any[]).filter(row => row && row.id && row.name && row.slug).map(row => row) as Category[];
    }
  });

  // Fetch new apps
  const { data: newApps, isLoading: isLoadingNewApps } = useQuery({
    queryKey: ['new-apps-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*, images:app_images(*)')
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data || []).map((app: any) => ({
        ...app,
        category_id: app.category_id || app.category || '',
        upvotes_count: typeof app.upvotes_count === 'number' ? app.upvotes_count : 0,
      })) as App[];
    }
  });

  // Fetch apps by category (for all categories)
  const { data: appsByCategory, isLoading: isLoadingAppsByCategory } = useQuery({
    queryKey: ['apps-by-category-home'],
    queryFn: async () => {
      if (!categories) return {};
      const result: Record<string, App[]> = {};
      for (const category of categories) {
        const { data, error } = await supabase
          .from('apps' as any)
          .select('*, images:app_images(*)')
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(4);
        if (error) continue;
        result[category.id] = (data || []).map((app: any) => ({
          ...app,
          category_id: app.category_id || app.category || '',
          upvotes_count: typeof app.upvotes_count === 'number' ? app.upvotes_count : 0,
        })) as App[];
      }
      return result;
    },
    enabled: !!categories
  });

  // Helper to add is_upvoted to apps
  const addIsUpvoted = (apps?: App[]) => {
    if (!apps) return [];
    if (!userUpvotes) return apps.map(app => ({ ...app, is_upvoted: false }));
    return apps.map(app => ({ ...app, is_upvoted: userUpvotes.includes(app.id) }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <SponsoredApp />
      {/* Featured Apps Section: show all uploaded apps */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">Featured Apps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingAllApps || !categories ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>
              ))
            ) : (
              featuredApps.map((app, idx) => {
                let category = app.category;
                if (!category && categories) {
                  category = categories.find(c => c.id === app.category_id);
                }
                const is_upvoted = userUpvotes?.includes(app.id) ?? false;
                return (
                  <AppCard key={app.id} app={{ ...app, category, is_upvoted }} featuredRank={idx + 1} />
                );
              })
            )}
          </div>
        </div>
      </section>
      {/* New Apps Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">New & Noteworthy</h2>
            <a href="/new-apps" className="text-efficiency-600 hover:text-efficiency-700">
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingNewApps || !categories ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>
              ))
            ) : (
              addIsUpvoted(newApps)?.map((app) => {
                const category = categories?.find(c => c.id === app.category_id);
                const featuredRank = getFeaturedRank(app.id);
                return <AppCard key={app.id} app={{ ...app, category }} featuredRank={featuredRank} />;
              })
            )}
          </div>
        </div>
      </section>
      <Categories />
      {/* Apps by Category Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoadingCategories || isLoadingAppsByCategory ? (
            <div className="text-center text-gray-400">Loading categories...</div>
          ) : (
            [...(categories?.filter(c => c.name.toLowerCase() !== 'other') || []),
              ...(categories?.filter(c => c.name.toLowerCase() === 'other') || [])
            ].map(category => (
              (appsByCategory?.[category.id]?.length ?? 0) > 0 && (
                <div key={category.id} className="mb-12">
                  <h3 className="text-xl font-bold text-dark mb-4">{category.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {addIsUpvoted(appsByCategory?.[category.id])?.map((app) => {
                      const categoryApps = appsByCategory?.[category.id] || [];
                      const catObj = categories?.find(c => c.id === app.category_id);
                      const featuredRank = getFeaturedRank(app.id);
                      return <AppCard key={app.id} app={{ ...app, category: catObj }} featuredRank={featuredRank} />;
                    })}
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
