import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { App, Category } from '@/types';
import AppCard from '@/components/AppCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CheckSquare, 
  FileText, 
  Clock, 
  Folder, 
  Users, 
  MessageSquare, 
  MoreHorizontal 
} from 'lucide-react';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';
import { useFeaturedApps } from '@/contexts/FeaturedAppsContext';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'check-square':
      return <CheckSquare size={24} className="text-efficiency-600" />;
    case 'file-text':
      return <FileText size={24} className="text-efficiency-600" />;
    case 'clock':
      return <Clock size={24} className="text-efficiency-600" />;
    case 'folder':
      return <Folder size={24} className="text-efficiency-600" />;
    case 'users':
      return <Users size={24} className="text-efficiency-600" />;
    case 'message-square':
      return <MessageSquare size={24} className="text-efficiency-600" />;
    default:
      return <MoreHorizontal size={24} className="text-efficiency-600" />;
  }
};

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: userUpvotes } = useUserUpvotes();
  const { getFeaturedRank } = useFeaturedApps();

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories' as any)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as unknown as Category;
    },
    enabled: !!slug
  });

  const { data: apps, isLoading: isLoadingApps } = useQuery({
    queryKey: ['category-apps', slug, category?.id],
    queryFn: async () => {
      if (!category?.id) return [];
      const { data, error } = await supabase
        .from('apps' as any)
        .select('*, images:app_images(*)')
        .eq('category_id', category.id)
        .order('upvotes_count', { ascending: false });

      if (error) throw error;
      return (data || []).map((app: any) => ({
        ...app,
        category_id: app.category_id || app.category || '',
        upvotes_count: typeof app.upvotes_count === 'number' ? app.upvotes_count : 0,
      })) as App[];
    },
    enabled: !!category?.id
  });

  const addIsUpvoted = (apps?: App[]) => {
    if (!apps) return [];
    if (!userUpvotes) return apps.map(app => ({ ...app, is_upvoted: false }));
    return apps.map(app => ({ ...app, is_upvoted: userUpvotes.includes(app.id) }));
  };

  if (isLoadingCategory || isLoadingApps) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Category not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-efficiency-50 rounded-md">
              {getIcon(category.icon)}
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-gray-500 mt-1">{category.description}</p>
            </div>
          </div>

          {(!apps || apps.length === 0) ? (
            <div className="text-center text-gray-400 text-lg mb-8">No apps yet</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {addIsUpvoted(apps)?.map((app) => {
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

export default CategoryDetail; 