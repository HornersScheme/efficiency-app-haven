import React from 'react';
import { Link } from 'react-router-dom';

interface SponsoredAppCardProps {
  app: {
    id: string;
    name: string;
    slogan: string;
    logo_url: string;
    app_link: string;
  };
  sponsor: {
    banner_url?: string;
  };
  isUpvoted?: boolean;
}

const SponsoredAppCard: React.FC<SponsoredAppCardProps> = ({ app, sponsor }) => {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Intense blue glow background */}
      <div className="absolute inset-0 rounded-2xl bg-blue-400/40 blur-3xl z-0 pointer-events-none" style={{ filter: 'blur(48px)' }} />
      {/* Sponsored badge */}
      <div className="absolute left-6 top-6 z-20">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-lg">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          Sponsored
        </span>
      </div>
      <Link
        to={`/app/${app.id}`}
        className="block group relative z-10"
        style={{ textDecoration: 'none' }}
      >
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-white transition-transform group-hover:scale-105 group-hover:shadow-blue-300/60 group-hover:shadow-2xl duration-200">
          {/* Banner */}
          {sponsor.banner_url && (
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={sponsor.banner_url}
                alt="Sponsored app banner"
                className="object-cover w-full h-full"
                style={{ minHeight: 180, maxHeight: 240 }}
              />
            </div>
          )}
          {/* App info */}
          <div className="flex flex-col items-center px-8 py-8">
            <img
              src={app.logo_url}
              alt={app.name + ' logo'}
              className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-xl border bg-white shadow mb-4"
              style={{ marginTop: '-3rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            />
            <h3 className="text-3xl font-bold mb-2 text-center text-gray-900">{app.name}</h3>
            <p className="text-lg text-gray-600 mb-1 text-center">{app.slogan}</p>
          </div>
        </div>
      </Link>
      <div className="mt-6 text-center relative z-20">
        <Link to="/sponsor">
          <button className="bg-gradient-to-r from-efficiency-500 to-efficiency-600 hover:from-efficiency-600 hover:to-efficiency-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg flex items-center justify-center mx-auto transition-all duration-200" style={{ boxShadow: '0 6px 32px 0 rgba(30, 64, 175, 0.15)' }}>
            <svg className="w-7 h-7 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" /></svg>
            Sponsor Your App
          </button>
        </Link>
        <p className="mt-2 text-gray-700 text-sm font-medium">
          Get featured in front of 5,000+ focused users every week.
        </p>
      </div>
    </div>
  );
};

export default SponsoredAppCard; 