 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CaptchaProvider } from "@/contexts/CaptchaContext";
import { memo } from "react";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";

// Direct imports for maximum speed
import Home from "@/pages/Home";
import ProjectDetails from "@/pages/ProjectDetails";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import Explore from "@/pages/Explore";
import ProjectMessages from "@/pages/ProjectMessages";
import Purchases from "@/pages/Purchases";
import Sell from "@/pages/Sell";
import AuthCallback from "@/pages/AuthCallback";
import Signup from "@/pages/Signup";
import Terms from "@/pages/Terms";
import About from "@/pages/About";
import Tools from "@/pages/Tools";
import Analytics from "@/pages/Analytics";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import Debug from "@/pages/Debug";
import MyListings from "@/pages/MyListings";
import BlogIndex from '@/pages/blog/index';
import HowToAcquireStartup2025 from '@/pages/blog/HowToAcquireStartup2025';
import Top10PlatformsToBuySellStartups from '@/pages/blog/Top10PlatformsToBuySellStartups';
import WhyStartupBazzarBest from '@/pages/blog/WhyStartupBazzarBest';
import HowToSellYourStartup2025 from '@/pages/blog/HowToSellYourStartup2025';
import HowToSellBusinessOnAcquire from '@/pages/blog/HowToSellBusinessOnAcquire';
import HowToSellYourStartup from '@/pages/blog/HowToSellYourStartup';
import SitesLikeAcquire from '@/pages/blog/SitesLikeAcquire';
import SellBusinessOnline from '@/pages/blog/SellBusinessOnline';
import AcquireComAlternatives from '@/pages/blog/AcquireComAlternatives';
import HowToBuyBusinessBeginnersGuide from '@/pages/blog/HowToBuyBusinessBeginnersGuide';
import HowToSellYourBusinessOnline2025 from '@/pages/blog/HowToSellYourBusinessOnline2025';
import StartupBazzarBlogGuide from '@/pages/blog/StartupBazzarBlogGuide';
import TopStartupMarketplaceQueries from '@/pages/blog/TopStartupMarketplaceQueries';
import PaymentSuccess from "@/pages/PaymentSuccess";
import Dhruv from "@/pages/Dhruv";
import { getSubdomain } from "@/lib/getSubdomain";
import AIInBusiness2025 from '@/pages/blog/AIInBusiness2025';
import ProfitableBusinessIdeas2025 from '@/pages/blog/ProfitableBusinessIdeas2025';
import SmallBusinessIdeas2025 from '@/pages/blog/SmallBusinessIdeas2025';
import LittleBusinessIdeas2025 from '@/pages/blog/LittleBusinessIdeas2025';

// Memoized Background Elements
const BackgroundElements = memo(() => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x" />
    
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
    <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
    
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.5 + Math.random() * 1.5})`
          }}
        />
      ))}
    </div>

    <div className="absolute inset-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            top: `${20 + i * 20}%`,
            left: '0',
            right: '0',
            animation: `slide ${10 + i * 2}s linear infinite`,
            animationDelay: `${i * 2}s`,
            transform: `translateX(-100%)`
          }}
        />
      ))}
    </div>

    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
  </div>
));

// Create a client with optimized settings for maximum performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // 15 minutes - longer cache
      gcTime: 1000 * 60 * 60 * 2, // 2 hours - longer garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      notifyOnChangeProps: ['data', 'error'],
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  },
});

function App() {
  const subdomain = getSubdomain(window.location.hostname);

  if (subdomain === "dhruv") {
    // Only render the portfolio page, skip the rest of the app
    return <Dhruv />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <CaptchaProvider>
              <Router>
                <ScrollToTop />
                <div className="relative min-h-screen bg-background">
                  <BackgroundElements />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/HowToAcquireStartup2025" element={<HowToAcquireStartup2025 />} />
                    <Route path="/blog/Top10PlatformsToBuySellStartups" element={<Top10PlatformsToBuySellStartups />} />
                    <Route path="/blog/WhyStartupBazzarBest" element={<WhyStartupBazzarBest />} />
                    <Route path="/blog/HowToSellYourStartup2025" element={<HowToSellYourStartup2025 />} />
                    <Route path="/blog/HowToSellBusinessOnAcquire" element={<HowToSellBusinessOnAcquire />} />
                    <Route path="/blog/HowToSellYourStartup" element={<HowToSellYourStartup />} />
                    <Route path="/blog/SitesLikeAcquire" element={<SitesLikeAcquire />} />
                    <Route path="/blog/SellBusinessOnline" element={<SellBusinessOnline />} />
                    <Route path="/blog/AcquireComAlternatives" element={<AcquireComAlternatives />} />
                    <Route path="/blog/HowToBuyBusinessBeginnersGuide" element={<HowToBuyBusinessBeginnersGuide />} />
                    <Route path="/blog/HowToSellYourBusinessOnline2025" element={<HowToSellYourBusinessOnline2025 />} />
                    <Route path="/blog/StartupBazzarBlogGuide" element={<StartupBazzarBlogGuide />} />
                    <Route path="/blog/TopStartupMarketplaceQueries" element={<TopStartupMarketplaceQueries />} />
                    <Route path="/blog/AIInBusiness2025" element={<AIInBusiness2025 />} />
                    <Route path="/blog/ProfitableBusinessIdeas2025" element={<ProfitableBusinessIdeas2025 />} />
                    <Route path="/blog/SmallBusinessIdeas2025" element={<SmallBusinessIdeas2025 />} />
                    <Route path="/blog/LittleBusinessIdeas2025" element={<LittleBusinessIdeas2025 />} />
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                      <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                      <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
                      <Route path="/project/:id" element={<ProjectDetails />} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                      <Route path="/project-messages/:id" element={<ProtectedRoute><ProjectMessages /></ProtectedRoute>} />
                      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/dhruv" element={<Dhruv />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/debug" element={<Debug />} />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                    </Route>
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </CaptchaProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default memo(App);
