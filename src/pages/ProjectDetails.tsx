import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProject } from "@/store/projects";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { subscriptionService } from "@/lib/subscription-service";
import { debugProjectLoading } from "@/lib/debug-project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Users, Building2, Code2, Target, TrendingUp, Key, Info, Wallet, MessageCircle, DollarSign, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: project, isLoading, error, refetch } = useProject(id || "");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [canViewContact, setCanViewContact] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Project ID is missing",
        variant: "destructive",
      });
      navigate('/explore');
      return;
    }

    const fetchUser = async () => {
      if (user && project) {
        setCurrentUser(user);
        try {
          // Check if user can view contact details
          const canView = await subscriptionService.canViewContactDetails(user.id, project?.price || 0);
          setCanViewContact(canView);
        } catch (error) {
          console.error('Error checking contact access:', error);
          setCanViewContact(false);
        }
      }
    };
    fetchUser();
  }, [user, project, id, navigate, toast]);

  // Log errors for debugging
  useEffect(() => {
    if (error && id) {
      console.error('ProjectDetails error:', error);
      // Run debug function to help identify the issue
      debugProjectLoading(id);
    }
  }, [error, id]);

  const isOwner = user && project?.maker?.id === user.id;

  const handleContactClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!canViewContact) {
      toast({
        title: "Subscription Required",
        description: "Please upgrade to a buyer plan to view contact details.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    setShowContactInfo(true);
  };

  const forceRefresh = async () => {
    if (id) {
      // Invalidate the specific project query
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
      // Force refetch
      await refetch();
    }
  };

  if (!id) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    console.error('ProjectDetails render error:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Error loading project details.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/explore')}
              >
                Back to Explore
              </Button>
              <Button 
                variant="secondary" 
                onClick={forceRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {id && (
                <Button 
                  variant="secondary" 
                  onClick={() => debugProjectLoading(id)}
                >
                  Debug
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Project not found.</p>
            <div className="flex gap-2 justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/explore')}
              >
                Back to Explore
              </Button>
              <Button 
                variant="secondary" 
                onClick={forceRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if user is the maker
  const isUserMaker = currentUser && project.maker && currentUser.id === project.maker.id;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <main className="flex-grow container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section with Contact Button */}
          <div className="mb-8 bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-2xl backdrop-blur-sm border border-muted/50 shadow-lg shadow-primary/5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    {project.title}
                  </h1>
                  <div className="flex gap-2">
                    {project.is_new && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1">
                        New
                      </Badge>
                    )}
                    {project.is_verified && (
                      <Badge variant="outline" className="bg-green-100/50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 px-3 py-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Asking Price</p>
                    <p className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                      ${project.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border/50"></div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                    <p className="text-xl font-semibold">{project.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-auto">
                {isOwner ? (
                    <Button 
                      className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg font-semibold rounded-xl h-12 px-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                      size="lg"
                      variant="default"
                    onClick={() => navigate(`/my-listings?project=${id}`)}
                    >
                      <span className="flex items-center gap-2">
                      Manage Project
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Button>
                  ) : (
                    <Dialog open={showContactInfo} onOpenChange={setShowContactInfo}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg font-semibold rounded-xl h-12 px-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 dark:shadow-blue-500/20 group"
                          size="lg"
                          variant="default"
                          onClick={handleContactClick}
                        >
                          <span className="flex items-center gap-2">
                            {canViewContact ? 'Contact Seller' : 'Upgrade to View Contact'}
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                            Seller Contact Information
                          </DialogTitle>
                          <DialogDescription>
                            Contact details for the seller of this project.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <h3 className="text-lg font-semibold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                              Contact Details
                            </h3>
                            <div className="space-y-3">
                              <p className="text-base">
                                <span className="font-medium">Name:</span> {project.maker.name}
                              </p>
                              <p className="text-base">
                                <span className="font-medium">Email:</span>{" "}
                                <a 
                                  href={`mailto:${project.maker.email}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {project.maker.email}
                                </a>
                              </p>
                              <p className="text-base">
                                <span className="font-medium">Phone:</span>{" "}
                                <a 
                                  href={`tel:${project.maker.phone}`}
                                  className="text-primary hover:underline font-medium"
                                >
                              {project.maker.phone}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Image */}
              <div className="aspect-video rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={1200}
                    height={675}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/40">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-2xl backdrop-blur-sm border border-muted/50 shadow-lg shadow-primary/5">
                <h2 className="text-2xl font-semibold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-2xl backdrop-blur-sm border border-muted/50">
                <h2 className="text-2xl font-semibold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                  Key Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Monthly Revenue</p>
                    <p className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 break-words" 
                       title={`$${Math.round((project.yearly_revenue || 0) / 12).toLocaleString()}`}>
                      ${(Math.round((project.yearly_revenue || 0) / 12) / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Category</p>
                    <p className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 break-words">
                      {project.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Performance */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-2xl backdrop-blur-sm border border-muted/50">
                <h2 className="text-2xl font-semibold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                  Recent Performance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">TTM Revenue</p>
                    <p className="text-2xl font-bold tracking-tight break-words">${project.ttm_revenue?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">TTM Profit</p>
                    <p className="text-2xl font-bold tracking-tight break-words">${project.ttm_profit?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Last Month's Revenue</p>
                    <p className="text-2xl font-bold tracking-tight break-words">${project.last_month_revenue?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Last Month's Profit</p>
                    <p className="text-2xl font-bold tracking-tight break-words">${project.last_month_profit?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Customer Metrics */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-2xl backdrop-blur-sm border border-muted/50">
                <h2 className="text-2xl font-semibold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                  Customer Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Customers</p>
                    <p className="text-2xl font-bold tracking-tight break-words">{project.customer_count || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Annual Recurring Revenue</p>
                    <p className="text-2xl font-bold tracking-tight break-words">${project.arr?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Annual Growth Rate</p>
                    <p className="text-2xl font-bold tracking-tight break-words">{project.growth_rate || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Churn Rate (%)</p>
                    <p className="text-2xl font-bold tracking-tight break-words">{project.churn_rate ? `${project.churn_rate}%` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-2xl backdrop-blur-sm border border-muted/50 shadow-lg shadow-primary/5">
                <h2 className="text-2xl font-semibold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Company Details
                </h2>
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Date Founded</h3>
                    </div>
                    <p className="text-xl font-semibold pl-14 text-muted-foreground break-words">
                      {project.date_founded ? new Date(project.date_founded).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Team Size</h3>
                    </div>
                    <p className="text-xl font-semibold pl-14 text-muted-foreground break-words">
                      {project.team_size ? `${project.team_size} employees` : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Business Models</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-14">
                      {project.business_models && project.business_models.length > 0 ? (
                        project.business_models.map((model) => (
                          <Badge key={model} variant="secondary" className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 break-words">
                            {model}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">N/A</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Tech Stack</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-14">
                      {project.tech_stack && project.tech_stack.length > 0 ? (
                        project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 break-words">
                            {tech}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">N/A</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Competitors</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-14">
                      {project.competitors && project.competitors.length > 0 ? (
                        project.competitors.map((competitor) => (
                          <Badge key={competitor} variant="secondary" className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 break-words">
                            {competitor}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">N/A</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Growth Opportunities</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-14">
                      {project.growth_opportunities && project.growth_opportunities.length > 0 ? (
                        project.growth_opportunities.map((opportunity) => (
                          <Badge key={opportunity} variant="secondary" className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 break-words">
                            {opportunity}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">N/A</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Key Assets</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-14">
                      {project.key_assets && project.key_assets.length > 0 ? (
                        project.key_assets.map((asset) => (
                          <Badge key={asset} variant="secondary" className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 break-words">
                            {asset}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">N/A</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Selling Reason</h3>
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground pl-14 whitespace-pre-wrap break-words">
                      {project.selling_reason || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Financing</h3>
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground pl-14 whitespace-pre-wrap break-words">
                      {project.financing || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Seller Info */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-6 rounded-2xl backdrop-blur-sm border border-muted/50 shadow-lg shadow-primary/5">
                <h2 className="text-xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Seller
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center text-lg font-semibold text-primary">
                      {project.maker.name.charAt(0)}
                    </div>
                  </div>
                  <span className="text-lg font-medium">{project.maker.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetails; 