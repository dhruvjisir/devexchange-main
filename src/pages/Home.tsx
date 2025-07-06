import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/store/projects";
import { UserRound, Shield, Globe, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Badge } from "@/components/ui/badge";
import { memo } from 'react';

// Memoize the ProjectCard component to prevent unnecessary re-renders
const ProjectCard = memo(({ project }: { project: any }) => (
  <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <div className="aspect-video w-full overflow-hidden">
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
          <UserRound className="h-8 w-8 sm:h-10 sm:w-10 text-primary/50" />
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-card-foreground">{project.title}</h3>
        <Badge>${project.price}</Badge>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {project.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">by {project.maker.name}</span>
        </div>
        {project.is_verified && (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            Verified
          </Badge>
        )}
      </div>
    </div>
  </div>
));

const Home = () => {
  const { data: products = [], isLoading } = useProjects();
  const { user } = useAuth()
  const navigate = useNavigate()

  // Get featured projects (first 6 projects)
  const featuredProjects = products.slice(0, 6);

  const handleAction = (path: string) => {
    if (!user) {
      sessionStorage.setItem('intendedDestination', path)
      navigate('/signup')
      return
    }
    navigate(path)
  }

  return (
    <div className="relative min-h-screen">
      {/* Simplified Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

      {/* Main Content */}
      <div className="relative space-y-8 p-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Buy and Sell Businesses | Acquire Startups with Ease
          </h1>
          
          <div className="max-w-2xl mx-auto mb-8">
            <blockquote className="text-xl italic text-muted-foreground">
              "capaitalexchange is the best marketplace I've found for buying and selling startups. The platform's transparency and quality of listings are unmatched in the industry."
            </blockquote>
            <p className="mt-4 text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">- Virat</p>
          </div>

          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            The marketplace for developers to buy and sell projects, tools, and services.
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleAction('/explore')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full md:w-auto"
            >
              Browse Projects
            </Button>
            {user && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleAction('/sell')}
                className="w-full md:w-auto"
              >
                Sell Your Project
              </Button>
            )}
          </div>
        </section>

        {/* Call to Action */}
        {!user && (
          <section className="text-center space-y-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground">
              Sign up now to access all features and start your journey with capaitalexchange.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full md:w-auto"
            >
              Sign Up Now
            </Button>
          </section>
        )}

        {/* Key Benefits */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
              Why Choose Our Platform?
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to buy or sell development projects
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: CreditCard, title: "No Commission", description: "Keep 100% of your earnings" },
              { icon: Shield, title: "Secure Payments", description: "Protected transactions" },
              { icon: Globe, title: "Global Reach", description: "Connect with developers worldwide" }
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-card-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <div className="py-8 sm:py-12">
          <div className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
                Featured Projects
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Discover the latest projects available for purchase
              </p>
            </div>
            {isLoading ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : featuredProjects.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Section */}
        <section className="py-8 sm:py-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
              Sell or Acquire Online Businesses with Ease
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Welcome to capaitalexchange — the modern marketplace for buying and selling online businesses, including eCommerce stores, SaaS startups, and digital companies. Whether you're ready to sell your business fast or looking to buy an online business, capaitalexchange offers a seamless and secure platform to make it happen.
            </p>
          </div>

          {/* Why Use capaitalexchange */}
          <div className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
                Why Use capaitalexchange?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Everything you need to buy or sell online businesses
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: CreditCard, title: "Sell Your Business Online", description: "with zero commission" },
                { icon: Shield, title: "Buy Vetted Online Businesses", description: "directly from founders" },
                { icon: Globe, title: "MicroAcquire-level features", description: "without hidden fees" },
                { icon: UserRound, title: "Fast Startup Exits", description: "for sellers" },
                { icon: Shield, title: "Tools for Due Diligence", description: "and AI-based valuation" }
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-card-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sell Your Business Fast */}
          <div className="text-center space-y-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-card-foreground">Sell Your Business Fast</h2>
            <p className="text-muted-foreground mb-6">
              Have an online business and wondering "How to sell my business online?" With capaitalexchange, you can:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">List your SaaS, eCommerce, or service-based business in minutes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Reach verified buyers globally</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Control your listing, pricing, and communication</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Avoid intermediaries and get direct offers</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We help founders sell their companies fast with full transparency.
            </p>
          </div>

          {/* Buy an Online Business */}
          <div className="text-center space-y-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-card-foreground">Buy an Online Business with Confidence</h2>
            <p className="text-muted-foreground mb-6">
              Looking to acquire an online business or make your first microacquisition?
            </p>
            <p className="text-muted-foreground mb-4">
              Explore a curated selection of:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">eCommerce businesses for sale</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">SaaS tools with MRR</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Mobile apps</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Service agencies</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Side hustles with proven revenue</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              capaitalexchange makes online acquisitions simple, direct, and secure.
            </p>
          </div>

          {/* Better Alternative */}
          <div className="text-center space-y-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-card-foreground">A Better Alternative to Acquire.com and MicroAcquire</h2>
            <p className="text-muted-foreground mb-6">
              Why choose capaitalexchange over Acquire.com or MicroAcquire?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">No commissions or broker fees</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">100% seller-controlled listings</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Smart business valuation tools</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">In-built messaging and deal tracking</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Startup-friendly pricing model</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Whether you're looking to sell your startup or buy a digital business, we provide the tools to help you succeed.
            </p>
          </div>

          {/* Categories */}
          <div className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
                Categories You Can Explore
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Different types of businesses available on our platform
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "eCommerce Businesses for Sale",
                "SaaS Startups",
                "Mobile Applications",
                "Agencies & Freelance Businesses",
                "Online Services & Marketplaces"
              ].map((category) => (
                <div
                  key={category}
                  className="bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
                >
                  <h3 className="text-base font-semibold text-card-foreground">{category}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* New Image Section */}
          <section className="py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-4">
                Join a Thriving Marketplace for Entrepreneurs
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Whether you're buying your next venture or selling your successful business, you're in good company.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Removed images: startup_bazzar.jpg, investor.jpg, payment.jpg */}
            </div>
          </section>

          {/* FAQ */}
          <div className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Common questions about our platform
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I sell my business online on capaitalexchange?",
                  answer: "Just sign up, list your business, and begin receiving offers. capaitalexchange enables direct contact with buyers for a smooth and fast sale."
                },
                {
                  question: "Can I sell my SaaS, eCommerce, or content business here?",
                  answer: "Yes! We support all online-first businesses including SaaS, eCommerce, affiliate websites, mobile apps, and service startups."
                },
                {
                  question: "How long does it take to sell a business?",
                  answer: "Businesses with clear metrics and honest pricing typically attract interest within 1–2 weeks."
                },
                {
                  question: "Is capaitalexchange similar to MicroAcquire or Acquire.com?",
                  answer: "Yes, but better for smaller founders. We offer 0% commission and full control, unlike platforms that require paid listings or broker assistance."
                },
                {
                  question: "Can I get help valuing my business?",
                  answer: "Yes, our free valuation tool helps you price your business based on revenue, traffic, and market trends."
                },
                {
                  question: "Are transactions secure?",
                  answer: "We support legal template agreements and partner with trusted escrow providers for safe payments."
                },
                {
                  question: "How much does it cost to use capaitalexchange?",
                  answer: "Basic listings are free. Premium options are available to boost visibility, but there are no commissions."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-base font-semibold text-card-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default memo(Home); 