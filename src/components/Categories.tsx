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
  MoreHorizontal,
  Lightbulb
} from 'lucide-react';
import DOMPurify from 'dompurify';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'check-square':
      return <CheckSquare className="h-8 w-8 text-gray-600" />;
    case 'file-text':
      return <FileText className="h-8 w-8 text-gray-600" />;
    case 'clock':
      return <Clock className="h-8 w-8 text-gray-600" />;
    case 'folder':
      return <Folder className="h-8 w-8 text-gray-600" />;
    case 'users':
      return <Users className="h-8 w-8 text-gray-600" />;
    case 'message-square':
      return <MessageSquare className="h-8 w-8 text-gray-600" />;
    case 'productivity':
      return <Lightbulb className="h-8 w-8 text-gray-600" />;
    default:
      return <MoreHorizontal className="h-8 w-8 text-gray-600" />;
  }
};

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-sorted'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*, apps(count)');
      return data || [];
    },
    select: (data) => {
      if (!data) return [];
      const customSort = (a: any, b: any) => {
        const order: { [key: string]: number } = { 'Productivity': 1, 'Other': 2 };
        const aIsSpecial = order[a.name] !== undefined;
        const bIsSpecial = order[b.name] !== undefined;

        if (aIsSpecial && bIsSpecial) {
          return order[a.name] - order[b.name];
        } else if (aIsSpecial) {
          return 1;
        } else if (bIsSpecial) {
          return -1;
        } else {
          return a.name.localeCompare(b.name);
        }
      };
      return [...data].sort(customSort);
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories?.slice(0, 10).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-card flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-200"
            >
              <div className="text-3xl mb-2">
                {getIcon(category.icon || (category.name === 'Productivity' ? 'productivity' : ''))}
              </div>
              <span className="text-center font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
