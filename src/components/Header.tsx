import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogIn, User, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, signOut, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-gradient-to-b from-efficiency-50 via-white to-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="EfficiencyHub Logo"
                className="w-8 h-8 md:w-10 md:h-10 mr-1 align-middle"
                style={{ display: 'inline-block', verticalAlign: 'middle' }}
              />
              <span className="text-xl font-bold text-efficiency-600">Efficiency</span>
              <span className="text-xl font-bold text-dark">Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#categories" className="text-dark-200 hover:text-efficiency-600 transition-colors">
              Categories
            </Link>
            <Link to="/new-apps" className="text-dark-200 hover:text-efficiency-600 transition-colors">
              New Apps
            </Link>
            <Link to="/top-ranked" className="text-dark-200 hover:text-efficiency-600 transition-colors">
              Top Ranked
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <Input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button type="submit" variant="ghost" size="icon" className="ml-2">
                <Search size={20} />
              </Button>
            </form>

            {isLoading ? (
              <div className="animate-pulse h-10 w-20 bg-gray-100 rounded"></div>
            ) : isAuthenticated ? (
              <>
                <Link to="/submit-app">
                  <Button className="bg-efficiency-600 hover:bg-efficiency-700 hidden md:inline-flex">
                    Submit App
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:inline-flex focus:outline-none">
                      <Avatar>
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                        <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : '?'}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2">
              <Search size={20} />
            </Button>
          </div>
        </form>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white p-4 shadow-md mt-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/#categories" className="text-dark-200 hover:text-efficiency-600 py-2">
                Categories
              </Link>
              <Link to="/new-apps" className="text-dark-200 hover:text-efficiency-600 py-2">
                New Apps
              </Link>
              <Link to="/top-ranked" className="text-dark-200 hover:text-efficiency-600 py-2">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full justify-start focus:outline-none">
                          <Avatar>
                            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                            <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : '?'}</AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      </div>
    </header>
  );
};

export default Header;
