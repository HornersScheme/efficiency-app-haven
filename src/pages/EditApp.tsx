import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  name: z.string().min(2, 'App name is required and must be at least 2 characters'),
  slogan: z.string().min(5, 'Slogan is required and must be at least 5 characters'),
  platform: z.enum(['PC', 'Mobile'], { required_error: 'Platform is required' }),
  description: z.string().min(20, 'Description is required and must be at least 20 characters'),
  app_link: z.string().url('App URL is required and must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
});

type FormValues = z.infer<typeof formSchema>;

type AppImage = {
  id: string;
  app_id: string;
  image_url: string;
  display_order: number;
};

const EditApp = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showcaseFiles, setShowcaseFiles] = useState<File[]>([]);
  const [showcasePreviews, setShowcasePreviews] = useState<string[]>([]);
  const [existingShowcase, setExistingShowcase] = useState<AppImage[]>([]);
  const [appData, setAppData] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slogan: '',
      platform: undefined,
      description: '',
      app_link: '',
      category: '',
    },
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const fetchApp = async () => {
      if (!id || !user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('apps')
        .select('*, images:app_images(*)')
        .eq('id', id)
        .single();
      if (error || !data) {
        toast.error('App not found');
        navigate('/profile');
        return;
      }
      if (data.user_id !== user.id) {
        toast.error('You are not allowed to edit this app');
        navigate('/profile');
        return;
      }
      setAppData(data);
      form.reset({
        name: data.name,
        slogan: data.slogan,
        platform: data.platform,
        description: data.description,
        app_link: data.app_link,
        category: data.category_id,
      });
      setLogoPreview(data.logo_url);
      setExistingShowcase((data.images || []).sort((a: AppImage, b: AppImage) => a.display_order - b.display_order));
      setIsLoading(false);
    };
    fetchApp();
    // eslint-disable-next-line
  }, [id, user]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file is too large. Max size is 5MB.');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleShowcaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (existingShowcase.length + showcaseFiles.length + files.length > 4) {
        toast.error('You can upload a maximum of 4 showcase images');
        return;
      }
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB.`);
          return false;
        }
        return true;
      });
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setShowcaseFiles(prev => [...prev, ...validFiles]);
      setShowcasePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeShowcaseImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingShowcase(prev => prev.filter((_, i) => i !== index));
    } else {
      setShowcaseFiles(prev => prev.filter((_, i) => i !== index));
      setShowcasePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('app_assets')
      .upload(filePath, file);
    if (uploadError) {
      throw new Error(uploadError.message);
    }
    const { data } = supabase.storage.from('app_assets').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (values: FormValues) => {
    if (!logoPreview && !logoFile) {
      toast.error('Please upload an app logo');
      return;
    }
    if (existingShowcase.length + showcaseFiles.length === 0) {
      toast.error('Please upload at least one showcase image');
      return;
    }
    setIsLoading(true);
    try {
      let logoUrl = logoPreview;
      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'logos');
      }
      // Update app entry
      const { error: appError } = await supabase
        .from('apps')
        .update({
          name: values.name,
          slogan: values.slogan,
          platform: values.platform,
          description: values.description,
          logo_url: logoUrl,
          app_link: values.app_link,
          category_id: values.category,
        })
        .eq('id', id);
      if (appError) throw new Error(appError.message);
      // Remove deleted images
      if (appData && appData.images) {
        for (let i = 0; i < appData.images.length; i++) {
          if (!existingShowcase.find(img => img.id === appData.images[i].id)) {
            await supabase.from('app_images').delete().eq('id', appData.images[i].id);
          }
        }
      }
      // Upload new showcase images
      for (let i = 0; i < showcaseFiles.length; i++) {
        const imageUrl = await uploadFile(showcaseFiles[i], 'screenshots');
        await supabase.from('app_images').insert({
          app_id: id,
          image_url: imageUrl,
          display_order: existingShowcase.length + i,
        });
      }
      toast.success('App updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(`Error updating app: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Your App</CardTitle>
          <CardDescription>Edit your app details and images below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">App Logo</h3>
                  <div className="mt-2 flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative h-24 w-24 rounded overflow-hidden border">
                        <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 bg-white/80 rounded-full p-1 m-1"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded border border-dashed">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer text-center text-sm text-muted-foreground"
                        >
                          Upload Logo
                        </label>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Upload a square logo image for your app.
                        <br />
                        Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Productivity App" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slogan</FormLabel>
                      <FormControl>
                        <Input placeholder="A short catchy slogan for your app" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Platform selection */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="PC"
                              checked={field.value === 'PC'}
                              onChange={() => field.onChange('PC')}
                              required
                            />
                            <span>PC</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="Mobile"
                              checked={field.value === 'Mobile'}
                              onChange={() => field.onChange('Mobile')}
                              required
                            />
                            <span>Mobile</span>
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>Select the platform your app is for.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          {...field}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="app_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://myapp.com" {...field} required />
                      </FormControl>
                      <FormDescription>Link to your app's website or download page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what your app does and its key features"
                          className="h-32"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <h3 className="text-lg font-medium mb-2">Showcase Images</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload up to 4 screenshots or promotional images (max 5MB each)
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {existingShowcase.map((img, index) => (
                      <div key={img.id} className="relative rounded overflow-hidden border h-36">
                        <img src={img.image_url} alt={`Showcase ${index + 1}`} className="h-full w-full object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 bg-white/80 rounded-full p-1 m-1"
                          onClick={() => removeShowcaseImage(index, true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {showcasePreviews.map((preview, index) => (
                      <div key={index} className="relative rounded overflow-hidden border h-36">
                        <img src={preview} alt={`Showcase ${index + 1}`} className="h-full w-full object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 bg-white/80 rounded-full p-1 m-1"
                          onClick={() => removeShowcaseImage(index, false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {existingShowcase.length + showcaseFiles.length < 4 && (
                      <div className="flex h-36 items-center justify-center rounded border border-dashed">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleShowcaseChange}
                          className="hidden"
                          id="showcase-upload"
                        />
                        <label
                          htmlFor="showcase-upload"
                          className="cursor-pointer text-center text-sm text-muted-foreground"
                        >
                          Add Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-efficiency-600"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditApp; 