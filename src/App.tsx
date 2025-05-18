import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitApp from "./pages/SubmitApp";
import NotFound from "./pages/NotFound";
import NewApps from "./pages/NewApps";
import TopRanked from "./pages/TopRanked";
import AppDetail from "./pages/AppDetail";
import CategoryDetail from "./pages/CategoryDetail";
import Search from "./pages/Search";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";
import EditApp from "./pages/EditApp";
import { FeaturedAppsProvider } from './contexts/FeaturedAppsContext';
import UserProfile from "./pages/UserProfile";
import Sponsor from "./pages/Sponsor";

const queryClient = new QueryClient();

const App = () => (
  <FeaturedAppsProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/submit-app" element={<SubmitApp />} />
              <Route path="/new-apps" element={<NewApps />} />
              <Route path="/top-ranked" element={<TopRanked />} />
              <Route path="/app/:id" element={<AppDetail />} />
              <Route path="/category/:slug" element={<CategoryDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-app/:id" element={<EditApp />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/sponsor" element={<Sponsor />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </FeaturedAppsProvider>
);

export default App;
