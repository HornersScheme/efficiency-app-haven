import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { App } from '@/types';

interface FeaturedAppsContextValue {
  featuredApps: App[];
  getFeaturedRank: (appId: string) => number | undefined;
}

const FeaturedAppsContext = createContext<FeaturedAppsContextValue>({
  featuredApps: [],
  getFeaturedRank: () => undefined,
});

export const useFeaturedApps = () => useContext(FeaturedAppsContext);

export const FeaturedAppsProvider = ({ children }: { children: ReactNode }) => {
  const [featuredApps, setFeaturedApps] = useState<App[]>([]);

  useEffect(() => {
    const fetchFeaturedApps = async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('upvotes_count', { ascending: false })
        .limit(4);
      if (!error && data) {
        // Map data to App type, filling missing fields with defaults if needed
        setFeaturedApps(
          (data as any[]).map((app: any) => ({
            ...app,
            category_id: app.category_id || '',
            upvotes_count: typeof app.upvotes_count === 'number' ? app.upvotes_count : 0,
            platform: app.platform || 'PC',
          }))
        );
      }
    };
    fetchFeaturedApps();
  }, []);

  const getFeaturedRank = (appId: string) => {
    const idx = featuredApps.findIndex(app => app.id === appId);
    return idx !== -1 ? idx + 1 : undefined;
  };

  return (
    <FeaturedAppsContext.Provider value={{ featuredApps, getFeaturedRank }}>
      {children}
    </FeaturedAppsContext.Provider>
  );
}; 