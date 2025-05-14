import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, 'App name is required and must be at least 2 characters'),
  slogan: z.string().min(5, 'Slogan is required and must be at least 5 characters'),
  platform: z.enum(['PC', 'Mobile'], { required_error: 'Platform is required' }),
  description: z.string().min(20, 'Description is required and must be at least 20 characters'),
  app_link: z.string().url('App URL is required and must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
});

type FormValues = z.infer<typeof formSchema>;

const SubmitApp = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showcaseFiles, setShowcaseFiles] = useState<File[]>([]);
  const [showcasePreviews, setShowcasePreviews] = useState<string[]>([]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slogan: '',
      platform: undefined,
      description: '',
      app_link: '',
      category: 'productivity', // Default category
    },
  });

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
      
      // Limit to 4 images max
      if (showcaseFiles.length + files.length > 4) {
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

  const removeShowcaseImage = (index: number) => {
    setShowcaseFiles(prev => prev.filter((_, i) => i !== index));
    setShowcasePreviews(prev => prev.filter((_, i) => i !== index));
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
    if (!logoFile) {
      toast.error('Please upload an app logo');
      return;
    }
    
    if (showcaseFiles.length === 0) {
      toast.error('Please upload at least one showcase image');
      return;
    }

    setIsLoading(true);
    
    try {
      // First, get the category ID from the slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', values.category)
        .single();
        
      if (categoryError || !categoryData) {
        throw new Error('Invalid category selected');
      }

      // Upload logo
      const logoUrl = await uploadFile(logoFile, 'logos');
      
      // Create app entry
      const { data: appData, error: appError } = await supabase
        .from('apps')
        .insert({
          name: values.name,
          slogan: values.slogan,
          platform: values.platform,
          description: values.description,
          logo_url: logoUrl,
          app_link: values.app_link,
          category_id: categoryData.id,
          user_id: user!.id,
          user_email: user!.email,
        })
        .select('id')
        .single();
        
      if (appError) throw new Error(appError.message);
      
      // Upload showcase images
      for (let i = 0; i < showcaseFiles.length; i++) {
        const imageUrl = await uploadFile(showcaseFiles[i], 'screenshots');
        
        const { error: imageError } = await supabase
          .from('app_images')
          .insert({
            app_id: appData.id,
            image_url: imageUrl,
            display_order: i,
          });
          
        if (imageError) throw new Error(imageError.message);
      }
      
      toast.success('App submitted successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(`Error submitting app: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Submit Your App</CardTitle>
          <CardDescription>
            Share your productivity app with the EfficiencyHub community
          </CardDescription>
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
                          <option value="productivity">Productivity</option>
                          <option value="communication">Communication</option>
                          <option value="project-management">Project Management</option>
                          <option value="time-tracking">Time Tracking</option>
                          <option value="note-taking">Note Taking</option>
                          <option value="task-management">Task Management</option>
                          <option value="other">Other</option>
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
                    {showcasePreviews.map((preview, index) => (
                      <div key={index} className="relative rounded overflow-hidden border h-36">
                        <img src={preview} alt={`Showcase ${index + 1}`} className="h-full w-full object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 bg-white/80 rounded-full p-1 m-1"
                          onClick={() => removeShowcaseImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {showcaseFiles.length < 4 && (
                      <label
                        htmlFor="showcase-upload"
                        className="flex h-36 w-full items-center justify-center rounded border border-dashed cursor-pointer text-center text-sm text-muted-foreground transition hover:bg-gray-50"
                        style={{ minWidth: '100px' }}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleShowcaseChange}
                          className="hidden"
                          id="showcase-upload"
                        />
                        <div>
                          Add Image
                          <div className="text-xs text-gray-400 mt-1">Recommended: 800x600px</div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-efficiency-600"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit App'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitApp;
