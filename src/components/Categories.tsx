
import { Category } from '@/types';
import { Calendar, CheckSquare, Clock, FileText, List, Users } from 'lucide-react';

const categories: Category[] = [
  {
    id: '1',
    name: 'Task Management',
    icon: 'CheckSquare',
    count: 145
  },
  {
    id: '2',
    name: 'Note Taking',
    icon: 'FileText',
    count: 98
  },
  {
    id: '3',
    name: 'Time Tracking',
    icon: 'Clock',
    count: 67
  },
  {
    id: '4',
    name: 'Project Management',
    icon: 'List',
    count: 112
  },
  {
    id: '5',
    name: 'Calendar & Scheduling',
    icon: 'Calendar',
    count: 86
  },
  {
    id: '6',
    name: 'Team Collaboration',
    icon: 'Users',
    count: 78
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'CheckSquare':
      return <CheckSquare size={24} className="text-efficiency-600" />;
    case 'FileText':
      return <FileText size={24} className="text-efficiency-600" />;
    case 'Clock':
      return <Clock size={24} className="text-efficiency-600" />;
    case 'List':
      return <List size={24} className="text-efficiency-600" />;
    case 'Calendar':
      return <Calendar size={24} className="text-efficiency-600" />;
    case 'Users':
      return <Users size={24} className="text-efficiency-600" />;
    default:
      return <CheckSquare size={24} className="text-efficiency-600" />;
  }
};

const Categories = () => {
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
          {categories.map((category) => (
            <a
              key={category.id}
              href="#"
              className="flex items-center bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-efficiency-50 rounded-md">
                {getIcon(category.icon)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-dark">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} apps</p>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="#" 
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default Categories;
