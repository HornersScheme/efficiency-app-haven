
import AppCard from './AppCard';
import { App } from '@/types';

const featuredApps: App[] = [
  {
    id: '1',
    name: 'Todoist',
    description: 'The best to-do list app that helps you organize tasks and get more done.',
    icon: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviews: 24563,
    category: 'Task Management',
    featured: true
  },
  {
    id: '2',
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases. Organize everything in one place.',
    icon: 'https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviews: 35621,
    category: 'Note Taking',
    featured: true
  },
  {
    id: '3',
    name: 'Toggl Track',
    description: 'Simple time tracking software that helps you understand where your time goes.',
    icon: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.7,
    reviews: 12478,
    category: 'Time Tracking',
    featured: true
  },
  {
    id: '4',
    name: 'Asana',
    description: 'Work management platform helping teams organize and manage all of their work.',
    icon: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.6,
    reviews: 19854,
    category: 'Project Management',
    featured: true
  }
];

const FeaturedApps = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark">Featured Apps</h2>
          <a href="#" className="text-efficiency-600 hover:text-efficiency-700">
            View all
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedApps;
