
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-xl font-bold text-efficiency-600">Efficiency</span>
            <span className="text-xl font-bold text-dark">Hub</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            Categories
          </a>
          <a href="#" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            Collections
          </a>
          <a href="#" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            New Apps
          </a>
          <a href="#" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            Top Ranked
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-dark-200 hidden md:inline-flex">
            Sign In
          </Button>
          <Button className="bg-efficiency-600 hover:bg-efficiency-700 hidden md:inline-flex">
            Submit App
          </Button>
          <button 
            className="md:hidden text-dark" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-dark-200 hover:text-efficiency-600 py-2">
              Categories
            </a>
            <a href="#" className="text-dark-200 hover:text-efficiency-600 py-2">
              Collections
            </a>
            <a href="#" className="text-dark-200 hover:text-efficiency-600 py-2">
              New Apps
            </a>
            <a href="#" className="text-dark-200 hover:text-efficiency-600 py-2">
              Top Ranked
            </a>
            <div className="flex flex-col space-y-3 pt-2">
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
              <Button className="w-full bg-efficiency-600 hover:bg-efficiency-700">
                Submit App
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
