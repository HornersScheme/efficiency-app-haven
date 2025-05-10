import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
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

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Browse by Category
            </h2>
            <p className="text-dark-200 max-w-2xl mx-auto">
              Find the perfect productivity tools for every aspect of your work and life
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            Browse by Category
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto">
            Find the perfect productivity tools for every aspect of your work and life
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="flex items-center bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-efficiency-50 rounded-md">
                {getIcon(category.icon)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-dark">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.apps[0].count} apps</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/categories" 
            className="text-efficiency-600 hover:text-efficiency-700 font-medium inline-flex items-center"
          >
            View all categories 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
