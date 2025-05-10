import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AppCard from '@/components/AppCard';
import { App, Category } from '@/types';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUserUpvotes } from '@/hooks/useUserUpvotes';

const Profile = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { data: userUpvotes } = useUserUpvotes();
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  // Fetch profile data
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
    setBio(profile?.bio || '');
  }, [profile]);

  const { mutate: saveProfile, isLoading: saving } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          bio,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Profile updated!');
      setEditOpen(false);
      refetchProfile();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories' as any)
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return ((data || []) as any[]).filter(row => row && row.id && row.name && row.slug) as Category[];
    }
  });

  useEffect(() => {
    const fetchApps = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('apps')
        .select('*, category:categories(*), images:app_images(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to fetch your apps');
      } else {
        setApps(data || []);
      }
      setLoading(false);
    };
    fetchApps();
  }, [user]);

  const handleDelete = async (appId: string) => {
    if (!window.confirm('Are you sure you want to delete this app?')) return;
    setDeleting(appId);
    const { error } = await supabase.from('apps').delete().eq('id', appId);
    if (error) {
      toast.error('Failed to delete app');
    } else {
      setApps(apps.filter(app => app.id !== appId));
      toast.success('App deleted');
    }
    setDeleting(null);
  };

  const totalLikes = apps.reduce((sum, app) => sum + (app.upvotes_count || 0), 0);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">You must be signed in to view your profile.</h2>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-10 mb-6">
            <Avatar className="h-20 w-20 text-3xl">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
              <AvatarFallback>{user.email ? user.email[0].toUpperCase() : '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0]}</h1>
              {profile?.bio && <div className="text-gray-500 mb-2">{profile.bio}</div>}
              <div className="text-gray-500">{user.email}</div>
              <div className="flex gap-6 mt-4">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{apps.length}</span> apps shared
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{totalLikes}</span> likes gathered
                </div>
              </div>
            </div>
            <Button variant="outline" className="h-10" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
            {editOpen && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                  <label className="block mb-2">Display Name</label>
                  <input
                    className="border rounded w-full mb-4 p-2"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                  />
                  <label className="block mb-2">Bio</label>
                  <textarea
                    className="border rounded w-full mb-4 p-2"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => saveProfile()} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr className="mb-8" />

          <h2 className="text-xl font-semibold mb-8">Your Apps</h2>
          {loading ? (
            <div>Loading your apps...</div>
          ) : apps.length === 0 ? (
            <div className="text-gray-500">You haven't submitted any apps yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {apps.map(app => {
                const category = categories?.find(c => c.id === app.category_id);
                const is_upvoted = userUpvotes?.includes(app.id) ?? false;
                return (
                  <div key={app.id} className="relative group">
                    <AppCard app={{ ...app, category, is_upvoted }} />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition"
                      onClick={() => handleDelete(app.id)}
                      disabled={deleting === app.id}
                    >
                      {deleting === app.id ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-20 opacity-80 group-hover:opacity-100 transition"
                      asChild
                    >
                      <Link to={`/edit-app/${app.id}`}>Edit</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 