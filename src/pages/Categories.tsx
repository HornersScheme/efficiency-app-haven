import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
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

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          apps:apps(count)
        `);

      if (error) throw error;
      return data as (Category & { apps: { count: number }[] })[];
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            Browse by Category
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="flex items-center bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-3 bg-efficiency-50 rounded-md">
                    {getIcon(category.icon)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-dark text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    <p className="text-sm text-efficiency-600 mt-2">
                      {category.apps[0].count} apps
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories; 