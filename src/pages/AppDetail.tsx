import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { App } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UpvoteButton from '@/components/UpvoteButton';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';

const AppDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const userId = user?.id;
  const { data: userUpvote } = useQuery({
    queryKey: ['user-upvote', userId, id],
    queryFn: async () => {
      if (!userId || !id) return false;
      const { data, error } = await supabase
        .from('upvotes')
        .select('id')
        .eq('app_id', id)
        .eq('user_id', userId)
        .single();
      if (error) return false;
      return !!data;
    },
    enabled: !!userId && !!id
  });

  const { data: app, isLoading } = useQuery({
    queryKey: ['app-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          images:app_images(*),
          category:categories(*)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as unknown as App;
    },
    enabled: !!id
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    if (app?.images && app.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % app.images!.length);
    }
  };

  const prevImage = () => {
    if (app?.images && app.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + app.images!.length) % app.images!.length);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">App not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center mb-8">
            <img src={app.logo_url} alt={app.name} className="w-16 h-16 rounded-lg object-cover mr-6" />
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {app.name}
                {app.platform && (
                  <span className="inline-block rounded bg-blue-600 text-white text-xs px-2 py-0.5 font-semibold ml-2">
                    {app.platform}
                  </span>
                )}
                {app.category?.name && (
                  <span className="inline-block rounded bg-efficiency-600 text-white text-xs px-2 py-0.5 font-semibold ml-2">
                    {app.category.name}
                  </span>
                )}
              </h1>
              <p className="text-gray-500 mt-1">{app.slogan}</p>
            </div>
            <div className="ml-auto flex flex-col items-end">
              <a 
                href={app.app_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-efficiency-600 hover:text-efficiency-700 font-medium text-lg mb-2"
              >
                Visit App ↗
              </a>
              <UpvoteButton appId={app.id} initialUpvotes={app.upvotes_count} isUpvoted={!!userUpvote} />
            </div>
          </div>

          {app.user_email && (
            <div className="mt-2 text-sm text-gray-500">
              <span>Developer: </span>
              <a
                href={`/user/${app.user_id}`}
                className="text-efficiency-600 hover:underline font-medium"
              >
                {app.user_email.split('@')[0]}
              </a>
            </div>
          )}

          {app.images && app.images.length > 0 && (
            <div className="mb-8">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(currentImageIndex)}>
                <img 
                  src={app.images[currentImageIndex].image_url} 
                  alt={`${app.name} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {app.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {app.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-lg text-gray-700 whitespace-pre-line">{app.description}</p>
          </div>
        </div>
      </main>
      <Footer />

      {/* Lightbox Modal */}
      {lightboxOpen && app.images && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={closeLightbox}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow">
              <X className="w-6 h-6" />
            </button>
            <img
              src={app.images[currentImageIndex].image_url}
              alt={`${app.name} screenshot ${currentImageIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg bg-white"
            />
            {app.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + app.images.length) % app.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % app.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDetail; 