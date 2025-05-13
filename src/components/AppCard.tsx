import { App } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

interface AppCardProps {
  app: App;
  featuredRank?: number;
}

const AppCard = ({ app, featuredRank }: AppCardProps) => {
  return (
    <div className="app-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md relative w-full h-64 flex flex-col">
      {featuredRank && featuredRank >= 1 && featuredRank <= 4 && (
        <div className={`absolute top-2 left-2 z-10 flex items-center gap-1`}> 
          <span className={`inline-block rounded-full bg-yellow-400 text-xs font-bold text-white px-2 py-0.5 shadow`}>#{featuredRank}</span>
        </div>
      )}
      <Link to={`/app/${app.id}`} className="block flex-1">
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start">
              <img 
                src={app.logo_url} 
                alt={`${app.name} logo`} 
                className="w-12 h-12 rounded-lg mr-3 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-dark break-words">{app.name}</h3>
                {(app.platform || app.category?.name) && (
                  <div className="mt-1 flex items-center gap-2">
                    {app.platform && (
                      <span className="inline-block rounded bg-blue-600 text-white text-xs px-2 py-0.5 font-semibold">
                        {app.platform}
                      </span>
                    )}
                    {app.category?.name && (
                      <span className="inline-block rounded bg-efficiency-600 text-white text-xs px-2 py-0.5 font-semibold">
                        {app.category.name}
                      </span>
                    )}
                    {featuredRank && featuredRank >= 1 && featuredRank <= 4 && (
                      <span className="inline-block rounded bg-yellow-400 text-white text-xs px-2 py-0.5 font-semibold ml-1">Featured</span>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1 break-words">{app.slogan}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {app.description}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm ${app.is_upvoted ? 'text-efficiency-600' : 'text-gray-500'}`}> 
                <ThumbsUp
                  size={16}
                  className={app.is_upvoted ? 'fill-efficiency-600 text-efficiency-600' : 'text-gray-400'}
                  fill={app.is_upvoted ? 'currentColor' : 'none'}
                />
                <span>{typeof app.upvotes_count === 'number' && !isNaN(app.upvotes_count) ? app.upvotes_count : 0}</span>
              </span>
            </div>
            <a 
              href={app.app_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-efficiency-600 hover:text-efficiency-700"
              onClick={(e) => e.stopPropagation()}
            >
              Visit App
            </a>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
