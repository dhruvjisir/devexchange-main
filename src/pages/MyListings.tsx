import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ExternalLink, BarChart2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format, subDays, subMonths, subYears } from "date-fns";
import { useProjects } from "@/store/projects";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useDeleteProject } from "@/store/projects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "@/store/projects";

export default function MyListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Filter projects for the current user
  const myProjects = projects.filter(project => project.maker?.id === user?.id);

  const fetchAnalytics = async (projectId: string) => {
    try {
      const { start, end, previousStart, previousEnd } = getDateRanges();
      
      // Fetch views data
      const { data: viewsData, error: viewsError } = await supabase
        .from("project_views")
        .select("created_at")
        .eq("project_id", projectId)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      if (viewsError) throw viewsError;

      // Fetch previous period views
      const { data: previousViewsData, error: previousViewsError } = await supabase
        .from("project_views")
        .select("created_at")
        .eq("project_id", projectId)
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      if (previousViewsError) throw previousViewsError;

      // Fetch impressions data
      const { data: impressionsData, error: impressionsError } = await supabase
        .from("project_impressions")
        .select("created_at, clicks")
        .eq("project_id", projectId)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      if (impressionsError) throw impressionsError;

      // Process views data
      const viewsByDate = viewsData.reduce((acc: Record<string, number>, view) => {
        const date = format(new Date(view.created_at), "MMM dd");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const viewsChartData = Object.entries(viewsByDate).map(([date, views]) => ({
        date,
        views,
      }));

      // Process impressions data
      const impressionsByDate = impressionsData.reduce((acc: Record<string, { impressions: number; clicks: number }>, impression) => {
        const date = format(new Date(impression.created_at), "MMM dd");
        if (!acc[date]) {
          acc[date] = { impressions: 0, clicks: 0 };
        }
        acc[date].impressions += 1;
        acc[date].clicks += impression.clicks || 0;
        return acc;
      }, {});

      const impressionsChartData = Object.entries(impressionsByDate).map(([date, data]) => ({
        date,
        impressions: data.impressions,
        clicks: data.clicks,
      }));

      // Calculate totals and percentage changes
      const currentViews = viewsData.length;
      const previousViews = previousViewsData.length;
      const viewsPercentageChange = previousViews === 0 
        ? 100 
        : ((currentViews - previousViews) / previousViews) * 100;

      const currentImpressions = impressionsData.length;
      const previousImpressions = previousViewsData.length; // Using previous views as a proxy
      const impressionsPercentageChange = previousImpressions === 0 
        ? 100 
        : ((currentImpressions - previousImpressions) / previousImpressions) * 100;

      setAnalyticsData({
        views: {
          data: viewsChartData,
          total: currentViews,
          percentageChange: viewsPercentageChange,
        },
        impressions: {
          data: impressionsChartData,
          total: currentImpressions,
          percentageChange: impressionsPercentageChange,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    }
  };

  const getDateRanges = () => {
    const end = new Date();
    let start: Date;
    let previousStart: Date;
    let previousEnd: Date;

    switch (timeRange) {
      case "7d":
        start = subDays(end, 7);
        previousStart = subDays(start, 7);
        previousEnd = start;
        break;
      case "30d":
        start = subDays(end, 30);
        previousStart = subDays(start, 30);
        previousEnd = start;
        break;
      case "90d":
        start = subDays(end, 90);
        previousStart = subDays(start, 90);
        previousEnd = start;
        break;
      case "1y":
        start = subYears(end, 1);
        previousStart = subYears(start, 1);
        previousEnd = start;
        break;
      default:
        start = subDays(end, 7);
        previousStart = subDays(start, 7);
        previousEnd = start;
    }

    return { start, end, previousStart, previousEnd };
  };

  const handleViewAnalytics = async (project: Project) => {
    setSelectedProject(project);
    await fetchAnalytics(project.id);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmation("");
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProject.mutateAsync(projectToDelete.id);
      toast.success('Project deleted successfully');
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      setDeleteConfirmation("");
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleView = (id: string) => {
    navigate(`/project/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (myProjects.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">No Listings Yet</h2>
        <p className="text-muted-foreground mb-6">Start by listing your first project for sale.</p>
        <Button onClick={() => navigate('/sell')}>List a Project</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Listings</h2>
        <Button onClick={() => navigate('/sell')}>List New Project</Button>
      </div>

      <div className="grid gap-6">
        {myProjects.map((project) => (
          <Card 
            key={project.id} 
            className={`p-6 transition-all duration-300 ${
              projectId === project.id ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.is_new && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      New
                    </Badge>
                  )}
                  {project.is_verified && (
                    <Badge variant="outline" className="bg-green-100/50 text-green-800 border-green-200">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <div className="text-right">
                  <p className="text-2xl font-bold">${project.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Listed {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleView(project.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(project)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Project Analytics - {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              View detailed analytics and performance metrics for your project.
            </DialogDescription>
          </DialogHeader>
          
          {analyticsData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {analyticsData.views.total.toLocaleString()}
                      </h3>
                      <div className="flex items-center mt-1">
                        {analyticsData.views.percentageChange >= 0 ? (
                          <span className="text-green-500">↑ {analyticsData.views.percentageChange.toFixed(1)}%</span>
                        ) : (
                          <span className="text-red-500">↓ {Math.abs(analyticsData.views.percentageChange).toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Impressions</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {analyticsData.impressions.total.toLocaleString()}
                      </h3>
                      <div className="flex items-center mt-1">
                        {analyticsData.impressions.percentageChange >= 0 ? (
                          <span className="text-green-500">↑ {analyticsData.impressions.percentageChange.toFixed(1)}%</span>
                        ) : (
                          <span className="text-red-500">↓ {Math.abs(analyticsData.impressions.percentageChange).toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="views">Views</TabsTrigger>
                  <TabsTrigger value="impressions">Impressions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsData.views.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Impressions & Clicks</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.impressions.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey="impressions" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="clicks" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="views" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed View Statistics</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.views.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="views" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="impressions" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed Impression Statistics</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.impressions.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" />
                          <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Type "delete" to confirm
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setProjectToDelete(null);
                  setDeleteConfirmation("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteConfirmation !== "delete"}
              >
                Delete Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 