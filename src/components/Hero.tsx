import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="hero-gradient py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-4">
            Discover the Best Productivity Apps
          </h1>
          <p className="text-lg md:text-xl text-dark-200 mb-8">
            Find tools that boost your efficiency, streamline your workflow, and help you achieve more
          </p>
          
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <Input 
              type="text" 
              placeholder="Search for productivity apps..." 
              className="flex-grow border-0 focus:ring-0 text-base px-4"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button type="submit" className="rounded-none h-full bg-efficiency-600 hover:bg-efficiency-700 px-6">
              <Search size={20} />
              <span className="ml-2 hidden md:inline">Search</span>
            </Button>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-dark-200">Popular:</span>
            <a href="/category/task-management" className="text-efficiency-600 hover:underline">Task Management</a>
            <a href="/category/note-taking" className="text-efficiency-600 hover:underline">Note Taking</a>
            <a href="/category/time-tracking" className="text-efficiency-600 hover:underline">Time Tracking</a>
            <a href="/category/project-management" className="text-efficiency-600 hover:underline">Project Management</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
