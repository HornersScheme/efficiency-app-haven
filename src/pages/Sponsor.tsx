import { useState, useRef } from 'react';
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, startOfWeek, endOfWeek } from 'date-fns';

// Define form schema
const formSchema = z.object({
  app_id: z.string().min(1, 'Please select an app'),
  start_date: z.string().min(1, 'Please select a start date'),
  message: z.string().optional(),
  banner: z
    .any()
    .refine((file) => file && file.length === 1, 'Banner image is required')
    .refine(
      (file) =>
        !file ||
        (file[0] &&
          ['image/png', 'image/jpeg', 'image/webp'].includes(file[0].type)),
      'Banner must be a PNG, JPG, or WEBP image'
    ),
});

type FormValues = z.infer<typeof formSchema>;

const SPONSOR_PRICE = 10; // $10 per week (60% off original $25)
const ORIGINAL_PRICE = 25;

// Helper function to generate upcoming weeks
const getUpcomingWeeks = (count = 6) => {
  const weeks = [];
  // Start from May 26th, 2024
  let date = new Date(2024, 4, 26); // Month is 0-based, so 4 = May

  for (let i = 0; i < count; i++) {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    weeks.push({ start, end });
    date.setDate(date.getDate() + 7);
  }
  // Filter out the week starting May 26, 2024
  return weeks.filter(week =>
    !(week.start.getFullYear() === 2024 && week.start.getMonth() === 4 && week.start.getDate() === 26)
  );
};

const Sponsor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's apps
  const { data: userApps } = useQuery({
    queryKey: ['user-apps', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch booked slots
  const { data: bookedSlots } = useQuery({
    queryKey: ['booked-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsored_apps')
        .select('start_date')
        .in('status', ['paid', 'approved']);
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      app_id: '',
      start_date: '',
      message: '',
      banner: undefined,
    }
  });

  // Check if a week is booked (only checking start date)
  const isWeekBooked = (start: Date) => {
    return bookedSlots?.some(slot => {
      const bookedDate = new Date(slot.start_date);
      return bookedDate.toDateString() === start.toDateString();
    }) ?? false;
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
      onChange(e.target.files);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('Please sign in to submit a sponsorship application');
      return;
    }

    setIsSubmitting(true);
    try {
      const startDate = new Date(values.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      // Check if the week is already booked
      if (isWeekBooked(startDate)) {
        toast.error('This week is already booked. Please select another week.');
        return;
      }

      // Upload banner image to Supabase Storage
      const bannerFile = values.banner[0];
      const fileExt = bannerFile.name.split('.').pop();
      const filePath = `sponsor-banners/${user.id}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, bannerFile, {
          cacheControl: '3600',
          upsert: false,
        });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);
      const banner_url = publicUrlData.publicUrl;

      // Insert sponsorship application
      const { error } = await supabase
        .from('sponsored_apps')
        .insert({
          app_id: values.app_id,
          user_id: user.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'pending',
          message: values.message,
          banner_url,
        });

      if (error) throw error;

      toast.success('Sponsorship application submitted successfully! We will review your application and send you a payment link if approved.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Sponsor Your App</h1>
              <p className="text-gray-600 mb-8">Please sign in to submit a sponsorship application.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </div>
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
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Promote Your App to 5,000+ Focused Users</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">Reach a high-intent audience by sponsoring the top spot on EfficiencyHub.</p>

          {/* Discount Banner */}
          <div className="mb-8 p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white text-center">
            <h2 className="text-2xl font-bold mb-2">🔥 LIMITED TIME OFFER 🔥</h2>
            <p className="text-lg">
              <span className="line-through text-red-200">${ORIGINAL_PRICE}</span>
              <span className="text-3xl font-bold mx-2">${SPONSOR_PRICE}</span>
              <span className="text-yellow-300 font-bold">per week</span>
            </p>
            <p className="text-sm mt-2 text-red-100">Save 60% on your sponsorship!</p>
          </div>

          {/* What You Get Section */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">What You Get:</h2>
            <ul className="space-y-2 text-base text-blue-900">
              <li className="flex items-center"><span className="mr-2">📣</span> Top placement on homepage for 7 days</li>
              <li className="flex items-center"><span className="mr-2">👀</span> Exposure to 5,000+ weekly viewers</li>
              <li className="flex items-center"><span className="mr-2">🔗</span> Direct traffic to your app</li>
              <li className="flex items-center"><span className="mr-2">✅</span> Sponsorship badge and visual branding</li>
              <li className="flex items-center"><span className="mr-2">📨</span> Potential email & featured promotion</li>
            </ul>
          </div>

          {/* Styled Note Box */}
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <ul className="list-disc list-inside text-yellow-900 text-base space-y-1">
              <li><strong>Sponsorship starts on a Monday</strong></li>
              <li><strong>Banner size:</strong> 1220×400 (PNG/JPG/WebP)</li>
              <li>You'll be notified by email after review</li>
            </ul>
          </div>

          {/* Why Sponsor Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Sponsor?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Be seen by productivity-focused users</li>
                <li>Homepage spotlight for 7 days</li>
                <li>Limited to 1 app per week (creates urgency)</li>
                <li>
                  <span className="line-through text-gray-500">${ORIGINAL_PRICE}</span>
                  <span className="text-red-600 font-bold ml-2">${SPONSOR_PRICE}</span>
                  <span className="text-red-600 font-bold"> per week</span>
                  <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm">60% OFF!</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* How It Works Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Submit your sponsorship request</li>
                <li>We'll review your app and confirm availability</li>
                <li>You'll receive a payment link (${SPONSOR_PRICE}/week)</li>
                <li>After payment, your app goes live in the sponsored section</li>
              </ol>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">What happens after submission?</h4>
                <p className="text-sm text-gray-600">
                  After you submit your application, we'll review it within 24 hours. If approved, you'll receive a payment link at the email address associated with your account. Once payment is confirmed, your app will be featured in the sponsored section for the selected week.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Availability Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Weeks</CardTitle>
              <CardDescription>Select a week to sponsor your app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Week</th>
                      <th className="text-right py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUpcomingWeeks(6).map((week, index) => {
                      const isBooked = isWeekBooked(week.start);
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-2">
                            {format(week.start, 'MMM d')} - {format(week.end, 'MMM d')}
                          </td>
                          <td className="text-right">
                            {isBooked ? (
                              <span className="text-red-500">❌ Booked</span>
                            ) : (
                              <span className="text-green-500">✅ Available</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Sponsorship weeks must start on a Monday. Applications with different start dates will not be accepted.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Sponsorship</CardTitle>
              <CardDescription>Fill out the form below to request a sponsorship slot</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="app_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Your App</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            {...field}
                          >
                            <option value="">Select an app...</option>
                            {userApps?.map(app => (
                              <option key={app.id} value={app.id}>
                                {app.name}
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
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            // Prevent May 26, 2024 from being selected
                            onChange={e => {
                              const selected = e.target.value;
                              if (selected === '2024-05-26') return; // Ignore selection
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Select a Monday to start your 7-day sponsorship. Applications must start on a Monday.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us why you want to sponsor your app..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us understand your goals and can improve your chances of approval
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="banner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <div>
                            <label htmlFor="banner-upload" className="block w-full cursor-pointer border-2 border-dashed border-blue-400 rounded-lg p-4 text-center hover:bg-blue-50 transition">
                              <span className="text-blue-600 font-semibold">Click to upload or drag and drop</span>
                              <br />
                              <span className="text-xs text-gray-500">Recommended size: 1200×400px (wide image, PNG/JPG/WEBP)</span>
                              <input
                                id="banner-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                ref={bannerInputRef}
                                onChange={e => handleBannerChange(e, field.onChange)}
                                required
                                className="hidden"
                              />
                            </label>
                            {bannerPreview && (
                              <div className="mt-4 flex justify-center">
                                <img
                                  src={bannerPreview}
                                  alt="Banner preview"
                                  className="rounded-lg max-h-40 object-cover border"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> You will receive all communications at the email address associated with your account ({user?.email}). Make sure it's up to date in your profile settings.
                    </p>
                  </div>

                  <Button type="submit" className="w-full py-4 text-lg bg-gradient-to-r from-efficiency-500 to-efficiency-600 hover:from-efficiency-600 hover:to-efficiency-700 text-white font-bold shadow-lg flex items-center justify-center transition-all duration-200" disabled={isSubmitting}>
                    ✅ Submit My Sponsorship Request
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsor; 