import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';
import SponsoredAppCard from './SponsoredAppCard';

const SponsoredApp = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['current-sponsor'],
    queryFn: async () => {
      // Get the current sponsor (with banner_url)
      const { data: sponsor, error: sponsorError } = await supabase
        .from('current_sponsor')
        .select('*')
        .single();
      if (sponsorError) throw sponsorError;
      if (!sponsor) return null;

      // Get the app details
      const { data: app, error: appError } = await supabase
        .from('apps')
        .select('*, images:app_images(*)')
        .eq('id', sponsor.app_id)
        .single();
      if (appError) throw appError;
      return { sponsor, app };
    }
  });

  const { data: userUpvotes } = useUserUpvotes();

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || !data.sponsor || !data.app) return null;
  const { sponsor, app } = data;
  const is_upvoted = userUpvotes?.includes(app.id) ?? false;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">This Week's Sponsor</h2>
        <div className="relative max-w-3xl mx-auto">
          {/* Blue glow background */}
          <div className="absolute inset-0 rounded-2xl bg-blue-200/40 blur-2xl z-0" style={{ filter: 'blur(32px)' }} />
          <div className="relative z-10">
            <SponsoredAppCard app={app} sponsor={sponsor} isUpvoted={is_upvoted} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsoredApp; 