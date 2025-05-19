import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-efficiency-400">Efficiency</span>
              <span className="text-xl font-bold text-white">Hub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover the best productivity apps to streamline your workflow and boost efficiency.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/3lsh916" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">X</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.53 2.47a.75.75 0 0 1 1.06 1.06L13.06 9l6.47 6.47a.75.75 0 1 1-1.06 1.06L12 10.06l-6.47 6.47a.75.75 0 1 1-1.06-1.06L10.94 9 4.47 2.53A.75.75 0 1 1 5.53 1.47L12 7.94l6.47-6.47a.75.75 0 0 1 1.06 1.06L13.06 9l6.47 6.47a.75.75 0 1 1-1.06 1.06L12 10.06l-6.47 6.47a.75.75 0 1 1-1.06-1.06L10.94 9 4.47 2.53A.75.75 0 1 1 5.53 1.47L12 7.94l6.47-6.47z" />
                </svg>
              </a>
              <a href="https://github.com/HornersScheme" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/sandor-adam-66784b350/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white">About Me</a></li>
              <li><button onClick={() => window.location.href = '/submit-app'} className="text-gray-400 hover:text-white w-full text-left">Submit App</button></li>
              <li><button onClick={() => window.location.href = '/sponsor'} className="text-gray-400 hover:text-white w-full text-left">Sponsor Your App</button></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/category/task-management" className="text-gray-400 hover:text-white">Task Management</a></li>
              <li><a href="/category/note-taking" className="text-gray-400 hover:text-white">Note Taking</a></li>
              <li><a href="/category/time-tracking" className="text-gray-400 hover:text-white">Time Tracking</a></li>
              <li><a href="/category/project-management" className="text-gray-400 hover:text-white">Project Management</a></li>
              <li><a href="/category/team-collaboration" className="text-gray-400 hover:text-white">Team Collaboration</a></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Give Feedback</h3>
            <p className="text-gray-400 mb-4">We'd love to hear your thoughts or suggestions!</p>
            <button id="reveal-email" className="bg-efficiency-600 hover:bg-efficiency-700 text-white px-4 py-2 rounded" onClick={() => {
              const el = document.getElementById('feedback-email');
              if (el) el.style.display = 'block';
            }}>Show Email</button>
            <div id="feedback-email" style={{display: 'none'}} className="mt-2 text-efficiency-400 select-all">3lsh916@gmail.com</div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} EfficiencyHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="/terms" className="text-gray-400 hover:text-white mx-3 md:ml-6">Terms</a>
            <a href="/privacy" className="text-gray-400 hover:text-white mx-3">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
