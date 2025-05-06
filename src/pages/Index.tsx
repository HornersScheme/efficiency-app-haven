
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedApps from '@/components/FeaturedApps';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <FeaturedApps />
      <Categories />
      
      {/* New Apps Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">New & Noteworthy</h2>
            <a href="#" className="text-efficiency-600 hover:text-efficiency-700">
              View all
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* New apps would be rendered here, reusing the AppCard component */}
            <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium text-dark mb-3">Discover More Apps</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our full collection of productivity applications
              </p>
              <Button className="bg-efficiency-600 hover:bg-efficiency-700">
                Explore All Apps
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action section */}
      <section className="py-16 bg-gradient-to-r from-efficiency-600 to-efficiency-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Discover apps that will transform how you work, collaborate, and manage your time
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-efficiency-700 hover:bg-gray-100 text-lg py-6 px-8">
              Browse Categories
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-6 px-8">
              Submit Your App
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
