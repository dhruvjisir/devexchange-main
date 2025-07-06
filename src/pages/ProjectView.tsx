import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, MessageSquare, Share2, Heart, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  yearly_revenue: number | null;
  ttm_revenue: number | null;
  ttm_profit: number | null;
  last_month_revenue: number | null;
  last_month_profit: number | null;
  customer_count: number | null;
  arr: number | null;
  growth_rate: number | null;
  churn_rate: number | null;
  maker: {
    id: string;
    name: string;
    email: string;
    phone: string;
    kyc: {
      document_type: string;
      document_number: string;
      document_image: string | null;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
      };
      verification_status: 'pending' | 'verified' | 'rejected';
    };
  };
  is_new: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProject(data);
      setIsOwner(data.maker.id === user?.id);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (!id || !user?.id) return;
    
    try {
      console.log('Attempting to track view for project:', id);
      const { error } = await supabase
        .from('project_views')
        .insert([
          {
            project_id: id,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error tracking view:', error);
        throw error;
      }
      console.log('View tracked successfully');
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const trackImpression = async () => {
    if (!id || !user?.id) return;
    
    try {
      console.log('Attempting to track impression for project:', id);
      const { error } = await supabase
        .from('project_impressions')
        .insert([
          {
            project_id: id,
            user_id: user.id,
            created_at: new Date().toISOString(),
            clicks: 0
          }
        ]);

      if (error) {
        console.error('Error tracking impression:', error);
        throw error;
      }
      console.log('Impression tracked successfully');
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async () => {
    if (!id || !user?.id) return;
    
    try {
      console.log('Attempting to track click for project:', id);
      const { error } = await supabase
        .from('project_impressions')
        .update({ clicks: 1 })
        .eq('project_id', id)
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      if (error) {
        console.error('Error tracking click:', error);
        throw error;
      }
      console.log('Click tracked successfully');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  useEffect(() => {
    if (id && user?.id) {
      console.log('Project ID:', id);
      console.log('User ID:', user.id);
      fetchProject();
      trackView();
      trackImpression();
    }
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {project.image && (
            <div className="mb-6 aspect-video overflow-hidden rounded-lg">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                {project.yearly_revenue && (
                  <div>
                    <h3 className="font-semibold">Yearly Revenue</h3>
                    <p className="text-muted-foreground">${project.yearly_revenue.toLocaleString()}</p>
                  </div>
                )}
                {project.ttm_revenue && (
                  <div>
                    <h3 className="font-semibold">TTM Revenue</h3>
                    <p className="text-muted-foreground">${project.ttm_revenue.toLocaleString()}</p>
                  </div>
                )}
                {project.ttm_profit && (
                  <div>
                    <h3 className="font-semibold">TTM Profit</h3>
                    <p className="text-muted-foreground">${project.ttm_profit.toLocaleString()}</p>
                  </div>
                )}
                {project.customer_count && (
                  <div>
                    <h3 className="font-semibold">Customer Count</h3>
                    <p className="text-muted-foreground">{project.customer_count}</p>
                  </div>
                )}
                {project.arr && (
                  <div>
                    <h3 className="font-semibold">ARR</h3>
                    <p className="text-muted-foreground">${project.arr.toLocaleString()}</p>
                  </div>
                )}
                {project.growth_rate && (
                  <div>
                    <h3 className="font-semibold">Growth Rate</h3>
                    <p className="text-muted-foreground">{project.growth_rate}%</p>
                  </div>
                )}
                {project.churn_rate && (
                  <div>
                    <h3 className="font-semibold">Churn Rate</h3>
                    <p className="text-muted-foreground">{project.churn_rate}%</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">${project.price.toLocaleString()}</h2>
                <p className="text-sm text-muted-foreground">Asking Price</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-semibold">Seller Information</h3>
                <p className="text-muted-foreground">{project.maker.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.maker.kyc.verification_status === 'verified' ? 'Verified Seller' : 'Unverified Seller'}
                </p>
              </div>
              
              <Button 
                className="w-full md:w-auto" 
                size="lg"
                onClick={() => {
                  if (isOwner) {
                    toast.error("You can't contact yourself");
                    return;
                  }
                  trackClick();
                  // Add your contact logic here
                  toast.success("Contact request sent!");
                }}
                disabled={isOwner}
              >
                {isOwner ? "You are the seller" : "Contact Seller"}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 