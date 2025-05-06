
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogIn, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-efficiency-600">Efficiency</span>
            <span className="text-xl font-bold text-dark">Hub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            Categories
          </Link>
          <Link to="/" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            Collections
          </Link>
          <Link to="/" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            New Apps
          </Link>
          <Link to="/" className="text-dark-200 hover:text-efficiency-600 transition-colors">
            Top Ranked
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="animate-pulse h-10 w-20 bg-gray-100 rounded"></div>
          ) : isAuthenticated ? (
            <>
              <Link to="/submit-app">
                <Button className="bg-efficiency-600 hover:bg-efficiency-700 hidden md:inline-flex">
                  Submit App
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-dark-200 hidden md:inline-flex"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="text-dark-200 hidden md:inline-flex">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </Link>
            </>
          )}
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
            <Link to="/" className="text-dark-200 hover:text-efficiency-600 py-2">
              Categories
            </Link>
            <Link to="/" className="text-dark-200 hover:text-efficiency-600 py-2">
              Collections
            </Link>
            <Link to="/" className="text-dark-200 hover:text-efficiency-600 py-2">
              New Apps
            </Link>
            <Link to="/" className="text-dark-200 hover:text-efficiency-600 py-2">
              Top Ranked
            </Link>
            <div className="flex flex-col space-y-3 pt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/submit-app">
                    <Button className="w-full bg-efficiency-600 hover:bg-efficiency-700">
                      Submit App
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
