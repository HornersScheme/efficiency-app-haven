
import { Star } from 'lucide-react';
import { App } from '@/types';
import { Badge } from '@/components/ui/badge';

interface AppCardProps {
  app: App;
}

const AppCard = ({ app }: AppCardProps) => {
  return (
    <div className="app-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md">
      <a href="#" className="block">
        <div className="p-4">
          <div className="flex items-start">
            <img 
              src={app.icon} 
              alt={`${app.name} icon`} 
              className="w-12 h-12 rounded-lg mr-3 object-cover"
            />
            <div>
              <h3 className="font-medium text-dark truncate">{app.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.round(app.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">
                  ({app.reviews.toLocaleString()})
                </span>
              </div>
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  {app.category}
                </Badge>
                {app.featured && (
                  <Badge variant="outline" className="ml-2 text-xs border-efficiency-300 text-efficiency-600 bg-efficiency-50">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {app.description}
          </p>
        </div>
      </a>
    </div>
  );
};

export default AppCard;
