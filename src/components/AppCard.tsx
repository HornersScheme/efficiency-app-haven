import { App } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface AppCardProps {
  app: App;
  featuredRank?: number;
}

const AppCard = ({ app, featuredRank }: AppCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`app-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md relative w-full ${app.is_sponsored ? 'h-80' : 'h-64'} flex flex-col isolate`}>
      {featuredRank && featuredRank >= 1 && featuredRank <= 4 && (
        <div className={`absolute top-2 left-2 z-10 flex items-center gap-1`}> 
          <span className={`inline-block rounded-full bg-yellow-400 text-xs font-bold text-white px-2 py-0.5 shadow`}>#{featuredRank}</span>
        </div>
      )}
      {app.is_sponsored && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-block rounded-full bg-blue-500 text-xs font-bold text-white px-2 py-0.5 shadow">Sponsored</span>
        </div>
      )}
      <Link to={`/app/${app.id}`} className="block flex-1">
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start">
              <img 
                src={imgError ? '/fallback-logo.png' : app.logo_url} 
                alt={`${app.name} logo`} 
                className={`${app.is_sponsored ? 'w-16 h-16' : 'w-12 h-12'} rounded-lg mr-3 object-cover`}
                onError={() => setImgError(true)}
                loading="lazy"
                width={app.is_sponsored ? 64 : 48}
                height={app.is_sponsored ? 64 : 48}
              />
              <div>
                <h3 className={`font-medium text-dark break-words ${app.is_sponsored ? 'text-xl' : ''}`}>{app.name}</h3>
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
                <p className={`text-sm text-gray-500 mt-1 break-words ${app.is_sponsored ? 'text-base' : ''}`}>{app.slogan}</p>
              </div>
            </div>
            <p className={`text-sm text-gray-600 mt-2 ${app.is_sponsored ? 'text-base line-clamp-3' : 'line-clamp-2'}`}>
              {app.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
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
