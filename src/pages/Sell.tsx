import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/store/projects";
import { Input } from "@/components/ui/input";
import { Search, Upload, Building2, User, FileText, MapPin, DollarSign, BarChart3, Calendar, Users, Code2, Target, Lightbulb, Key, MessageSquare, FileCheck } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { subscriptionService } from '@/services/subscription'
import { TermsAndConditions } from '@/components/TermsAndConditions'
import { countryCodes } from '@/lib/constants'
import { categories } from '@/lib/constants'
import { validateDocumentNumber, validateDocumentImage, documentMessages } from '@/lib/validations'
import { useAddProject } from '@/hooks/useAddProject'
import { verifyKYCDocument, updateKYCStatus } from '@/lib/kyc-verification'
import { Helmet } from 'react-helmet-async'

// Document validation patterns
const documentPatterns = {
  passport: /^[A-Z0-9]{6,9}$/, // Most passports are 6-9 alphanumeric characters
  drivers_license: /^[A-Z0-9]{5,15}$/, // Driver's license numbers vary by country
  national_id: /^[A-Z0-9]{8,12}$/, // National ID numbers vary by country
};

// Validate address
const validateAddress = (address: {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}): boolean => {
  return (
    address.street.length >= 5 &&
    address.city.length >= 2 &&
    address.state.length >= 2 &&
    address.country.length >= 2 &&
    address.postal_code.length >= 3
  );
};

interface FormData {
  title: string;
  description: string;
  price: string;
  yearly_revenue: string;
  category: string;
  image: string;
  tags: string[];
  ttm_revenue: string;
  ttm_profit: string;
  last_month_revenue: string;
  last_month_profit: string;
  customer_count: string;
  arr: number;
  growth_rate: string;
  churn_rate: string;
  date_founded: string;
  team_size: string;
  business_models: string[];
  tech_stack: string[];
  competitors: string[];
  growth_opportunities: string[];
  key_assets: string[];
  selling_reason: string;
  financing: string;
  makerName: string;
  makerEmail: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const Sell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addProject = useAddProject();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    yearly_revenue: "",
    category: "",
    image: "",
    tags: [],
    ttm_revenue: "",
    ttm_profit: "",
    last_month_revenue: "",
    last_month_profit: "",
    customer_count: "",
    arr: 0,
    growth_rate: "",
    churn_rate: "",
    date_founded: "",
    team_size: "",
    business_models: [],
    tech_stack: [],
    competitors: [],
    growth_opportunities: [],
    key_assets: [],
    selling_reason: "",
    financing: "",
    makerName: "",
    makerEmail: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        try {
          const details = await subscriptionService.getSubscriptionDetails(user.id);
          setSubscriptionDetails(details);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
      setIsCheckingSubscription(false);
    };
    fetchUserAndSubscription();
  }, []);

  // Handle document type change
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    setDocumentNumber('');
    setDocumentError('');
  };

  // Handle document number change
  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setDocumentNumber(value);
    
    if (documentType && !validateDocumentNumber(documentType, value)) {
      setDocumentError(documentMessages[documentType as keyof typeof documentMessages]);
    } else {
      setDocumentError('');
    }
  };

  // Handle document image change
  const handleDocumentImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setDocumentImage(null);
      setImageError('');
      return;
    }

    setDocumentImage(file);
    const isValid = await validateDocumentImage(file);
    
    if (!isValid) {
      setImageError('Please upload a clear image (min 800x600px) in JPG or PNG format (max 5MB)');
    } else {
      setImageError('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast({
        title: "Error",
        description: "Please drop an image file",
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "Please log in to list a project",
          variant: "destructive",
        });
        return;
      }

      const price = parseFloat(formData.price);
      
      // Check if user can list this project based on their subscription
        const subscription = await subscriptionService.getSubscriptionDetails(currentUser.id);
      
      if (!subscription || typeof subscription.maxListingAmount === "undefined") {
        toast({
          title: "Subscription Error",
          description: "Could not determine your subscription limits. Please contact support or try again later.",
          variant: "destructive",
        });
        return;
      }

        const limit = subscription.maxListingAmount === Infinity ? 'unlimited' : `$${subscription.maxListingAmount.toLocaleString()}`;
        
      const canList = await subscriptionService.canListProject(currentUser.id, price);
      
      if (!canList) {
        toast({
          title: "Subscription Limit Exceeded",
          description: `Your ${subscription.type} plan allows listings up to ${limit}. Please upgrade your plan to list higher value projects.`,
          variant: "destructive",
        });
        return;
      }

      if (!termsAccepted) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions to list a project.",
          variant: "destructive",
        });
        return;
      }

      if (!declarationAccepted) {
        toast({
          title: "Error",
          description: "You must accept the declaration policy to list a project.",
          variant: "destructive",
        });
        return;
      }

      // Validate KYC information
      if (!documentType || !documentNumber || !documentImage) {
        toast({
          title: "Error",
          description: "Please complete all KYC fields.",
          variant: "destructive",
        });
        return;
      }

      if (documentError) {
        toast({
          title: "Error",
          description: documentError,
          variant: "destructive",
        });
        return;
      }

      if (imageError) {
        toast({
          title: "Error",
          description: imageError,
          variant: "destructive",
        });
        return;
      }

      let imageUrl = null;
      
      if (formData.image) {
        const fileExt = formData.image.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, documentImage, {
            contentType: documentImage.type,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Create project data without updated_at
      const projectData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: imageUrl,
        tags: formData.tags,
        yearly_revenue: Number(formData.yearly_revenue),
        ttm_revenue: Number(formData.ttm_revenue),
        ttm_profit: Number(formData.ttm_profit),
        last_month_revenue: Number(formData.last_month_revenue),
        last_month_profit: Number(formData.last_month_profit),
        customer_count: formData.customer_count,
        arr: formData.arr,
        growth_rate: formData.growth_rate,
        churn_rate: formData.churn_rate,
        date_founded: formData.date_founded ? new Date(formData.date_founded).toISOString().split('T')[0] : null,
        team_size: formData.team_size,
        business_models: formData.business_models,
        tech_stack: formData.tech_stack,
        competitors: formData.competitors,
        growth_opportunities: formData.growth_opportunities,
        key_assets: formData.key_assets,
        selling_reason: formData.selling_reason,
        financing: formData.financing,
        maker: {
          id: currentUser.id,
          name: formData.makerName || currentUser.user_metadata.full_name || currentUser.email,
          email: formData.makerEmail || currentUser.email,
          phone: `${selectedCountryCode}${formData.phone || currentUser.user_metadata.phone || ''}`,
          kyc: {
            document_type: documentType as 'passport' | 'drivers_license' | 'national_id',
            document_number: documentNumber,
            document_image: documentImage ? URL.createObjectURL(documentImage) : null,
            address: {
              street: formData.street || currentUser.user_metadata.street || '',
              city: formData.city || currentUser.user_metadata.city || '',
              state: formData.state || currentUser.user_metadata.state || '',
              country: formData.country || currentUser.user_metadata.country || '',
              postal_code: formData.postalCode || currentUser.user_metadata.postal_code || '',
            },
            verification_status: 'pending' as const,
          }
        },
        is_new: true,
        is_verified: false
      };

      console.log('Submitting project data:', projectData);

      // Create the project first
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          price: projectData.price,
          category: projectData.category,
          image: projectData.image,
          tags: projectData.tags,
          yearly_revenue: projectData.yearly_revenue,
          ttm_revenue: projectData.ttm_revenue,
          ttm_profit: projectData.ttm_profit,
          last_month_revenue: projectData.last_month_revenue,
          last_month_profit: projectData.last_month_profit,
          customer_count: projectData.customer_count,
          arr: projectData.arr,
          growth_rate: projectData.growth_rate,
          churn_rate: projectData.churn_rate,
          date_founded: projectData.date_founded,
          team_size: projectData.team_size,
          business_models: projectData.business_models,
          tech_stack: projectData.tech_stack,
          competitors: projectData.competitors,
          growth_opportunities: projectData.growth_opportunities,
          key_assets: projectData.key_assets,
          selling_reason: projectData.selling_reason,
          financing: projectData.financing,
          maker: projectData.maker,
          is_new: projectData.is_new,
          is_verified: projectData.is_verified,
        })
        .select()
        .single();

      if (error) throw error;

      // Verify KYC document
      const verificationResult = await verifyKYCDocument(projectData.maker.kyc);
      console.log('KYC verification result:', verificationResult);

      // Update project with verification status
      if (newProject?.id) {
        await updateKYCStatus(newProject.id, verificationResult);
      }

      if (verificationResult.is_valid) {
        toast({
          title: "Project Listed Successfully!",
          description: "Your project has been listed and is now visible to potential buyers.",
        });
      } else {
        toast({
          title: "Project Listed - KYC Pending",
          description: "Your project has been listed, but KYC verification is pending. You may need to provide additional documentation.",
          variant: "destructive",
        });
      }
      
      navigate("/");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sell Your Startup or Business | StartupBazzar</title>
        <meta name="description" content="List your startup, SaaS, or online business for sale. Reach verified buyers and sell your business fast." />
        <link rel="canonical" href="https://www.startupbazzar.com/sell" />
      </Helmet>
    <div className="min-h-screen flex flex-col w-full px-4">
      <main className="flex-grow w-full container py-8 px-0">
        <div className="space-y-6 w-full">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">List Your Project</h1>
          <p className="text-muted-foreground">
            Fill out the form below to list your project for sale. All fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Details
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Verification
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <TabsContent value="basic" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Tell us about your project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                          id="title"
                            name="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter your project name"
                          required
                            className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your project in detail"
                          required
                            className="min-h-[150px] w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($) *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="price"
                              type="number"
                              min="0"
                              value={formData.price}
                              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="Enter price"
                              required
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select 
                            value={formData.category}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags *</Label>
                        <Input
                          id="tags"
                          value={formData.tags.join(', ')}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                          }))}
                          placeholder="e.g., AI, SaaS, Marketing (comma-separated)"
                          required
                            className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Project Image *</Label>
                        <div 
                            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors w-full"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          {previewUrl ? (
                            <div className="relative aspect-video w-full max-w-2xl mx-auto">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="rounded-lg object-cover w-full h-full"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage();
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                              <div className="text-sm text-muted-foreground">
                                Drag and drop an image here, or click to select
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Max file size: 5MB. Supported formats: JPG, PNG
                              </div>
                            </div>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Metrics</CardTitle>
                    <CardDescription>Key performance indicators and financial data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="yearly_revenue">Yearly Revenue ($) *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="yearly_revenue"
                              type="number"
                              min="0"
                              value={formData.yearly_revenue}
                              onChange={(e) => setFormData(prev => ({ ...prev, yearly_revenue: e.target.value }))}
                              placeholder="Enter yearly revenue"
                              required
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ttm_revenue">TTM Revenue ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="ttm_revenue"
                              type="number"
                              min="0"
                              value={formData.ttm_revenue}
                              onChange={(e) => setFormData(prev => ({ ...prev, ttm_revenue: e.target.value }))}
                              placeholder="Trailing twelve months revenue"
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="ttm_profit">TTM Profit ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="ttm_profit"
                              type="number"
                              min="0"
                              value={formData.ttm_profit}
                              onChange={(e) => setFormData(prev => ({ ...prev, ttm_profit: e.target.value }))}
                              placeholder="Trailing twelve months profit"
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="last_month_revenue">Last Month's Revenue ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="last_month_revenue"
                              type="number"
                              min="0"
                              value={formData.last_month_revenue}
                              onChange={(e) => setFormData(prev => ({ ...prev, last_month_revenue: e.target.value }))}
                              placeholder="Last month's revenue"
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="last_month_profit">Last Month's Profit ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="last_month_profit"
                              type="number"
                              min="0"
                              value={formData.last_month_profit}
                              onChange={(e) => setFormData(prev => ({ ...prev, last_month_profit: e.target.value }))}
                              placeholder="Last month's profit"
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="arr">Annual Recurring Revenue ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="arr"
                              type="number"
                              min="0"
                              value={formData.arr}
                              onChange={(e) => setFormData(prev => ({ ...prev, arr: parseFloat(e.target.value) }))}
                              placeholder="ARR"
                                className="pl-9 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="customer_count">Customer Count</Label>
                          <Input
                            id="customer_count"
                            type="text"
                            value={formData.customer_count}
                            onChange={(e) => setFormData(prev => ({ ...prev, customer_count: e.target.value }))}
                            placeholder="e.g. 1,000-5,000"
                              className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="growth_rate">Growth Rate (%)</Label>
                          <Input
                            id="growth_rate"
                            type="text"
                            value={formData.growth_rate}
                            onChange={(e) => setFormData(prev => ({ ...prev, growth_rate: e.target.value }))}
                            placeholder="e.g. 10%"
                              className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="churn_rate">Churn Rate (%)</Label>
                          <Input
                            id="churn_rate"
                            type="text"
                            value={formData.churn_rate}
                            onChange={(e) => setFormData(prev => ({ ...prev, churn_rate: e.target.value }))}
                            placeholder="e.g. 10%"
                              className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                    <CardDescription>Additional information about your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date_founded">Date Founded</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="date_founded"
                              type="date"
                              value={formData.date_founded}
                              onChange={(e) => setFormData(prev => ({ ...prev, date_founded: e.target.value }))}
                              placeholder="Select date"
                                className="w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="team_size">Team Size</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="team_size"
                              value={formData.team_size}
                              onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                              placeholder="e.g., 2-20"
                                className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business_models">Business Models</Label>
                        <Input
                          id="business_models"
                          value={formData.business_models.join(', ')}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            business_models: e.target.value.split(',').map(model => model.trim()).filter(Boolean)
                          }))}
                          placeholder="e.g., B2B, B2C, Subscription (comma-separated)"
                            className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tech_stack">Tech Stack</Label>
                        <div className="relative">
                          <Code2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="tech_stack"
                            value={formData.tech_stack.join(', ')}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              tech_stack: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                            }))}
                            placeholder="e.g., AWS, Azure, Google Cloud (comma-separated)"
                              className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="competitors">Competitors</Label>
                        <Input
                          id="competitors"
                          value={formData.competitors.join(', ')}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            competitors: e.target.value.split(',').map(comp => comp.trim()).filter(Boolean)
                          }))}
                          placeholder="e.g., Competitor 1, Competitor 2 (comma-separated)"
                            className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="growth_opportunities">Growth Opportunities</Label>
                        <div className="relative">
                          <Target className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="growth_opportunities"
                            value={formData.growth_opportunities.join(', ')}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              growth_opportunities: e.target.value.split(',').map(opp => opp.trim()).filter(Boolean)
                            }))}
                            placeholder="e.g., New markets, Digital marketing (comma-separated)"
                              className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="key_assets">Key Assets</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="key_assets"
                            value={formData.key_assets.join(', ')}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              key_assets: e.target.value.split(',').map(asset => asset.trim()).filter(Boolean)
                            }))}
                            placeholder="e.g., Codebase, Patents, Domain (comma-separated)"
                              className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="selling_reason">Selling Reason</Label>
                        <Textarea
                          id="selling_reason"
                          value={formData.selling_reason}
                          onChange={(e) => setFormData(prev => ({ ...prev, selling_reason: e.target.value }))}
                          placeholder="Explain why you're selling the business"
                            className="min-h-[100px] w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="financing">Financing</Label>
                        <Textarea
                          id="financing"
                          value={formData.financing}
                          onChange={(e) => setFormData(prev => ({ ...prev, financing: e.target.value }))}
                          placeholder="Describe the company's financing history and current status"
                            className="min-h-[100px] w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Verification & Contact</CardTitle>
                    <CardDescription>Your personal information and verification details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="makerName">Your Name *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="makerName"
                                value={formData.makerName}
                                onChange={(e) => setFormData(prev => ({ ...prev, makerName: e.target.value }))}
                                placeholder="Enter your name"
                                required
                                  className="w-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="makerEmail">Your Email *</Label>
                            <Input
                              id="makerEmail"
                              value={formData.makerEmail}
                              onChange={(e) => setFormData(prev => ({ ...prev, makerEmail: e.target.value }))}
                              type="email"
                              placeholder="Enter your email"
                              required
                                className="w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="makerPhone">Phone Number *</Label>
                          <div className="flex gap-2">
                            <Select
                              value={selectedCountryCode}
                              onValueChange={setSelectedCountryCode}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {countryCodes.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.code} ({country.country})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              id="makerPhone"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              type="tel"
                              placeholder="Enter your phone number"
                                className="w-full flex-1"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-medium">KYC Verification</h3>
                        <p className="text-sm text-muted-foreground">
                          Please provide your identification details for verification. This information will be kept secure and confidential.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="documentType">Document Type *</Label>
                            <Select 
                              value={documentType}
                              onValueChange={handleDocumentTypeChange}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="drivers_license">Driver's License</SelectItem>
                                <SelectItem value="national_id">National ID</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="documentNumber">Document Number *</Label>
                            <Input
                              id="documentNumber"
                              value={documentNumber}
                              onChange={handleDocumentNumberChange}
                              placeholder="Enter your document number"
                              required
                                className="w-full"
                            />
                            {documentError && (
                              <p className="text-sm text-red-500 mt-1">{documentError}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="documentImage">Document Image *</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="documentImage"
                              type="file"
                              accept="image/*"
                              onChange={handleDocumentImageChange}
                              required
                                className="pl-9 cursor-pointer w-full"
                            />
                          </div>
                          {imageError && (
                            <p className="text-sm text-red-500 mt-1">{imageError}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Upload a clear image of your document (min 800x600px, max 5MB)
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-medium">Address Information</h3>
                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="street">Street Address *</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="street"
                                value={formData.street}
                                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                                placeholder="Enter your street address"
                                required
                                  className="w-full"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="Enter your city"
                                required
                                  className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="state">State/Province *</Label>
                              <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                placeholder="Enter your state"
                                required
                                  className="w-full"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="country">Country *</Label>
                              <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                placeholder="Enter your country"
                                required
                                  className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="postalCode">Postal Code *</Label>
                              <Input
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                placeholder="Enter your postal code"
                                required
                                  className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>

            <div className="sticky bottom-0 bg-background border-t py-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Terms and Conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      I have read and agree to the <TermsAndConditions />
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="declaration"
                    checked={declarationAccepted}
                    onCheckedChange={(checked) => setDeclarationAccepted(checked as boolean)}
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="declaration"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Declaration Policy
                    </label>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>I hereby declare that all information provided by me is true, complete, and correct to the best of my knowledge and belief. I understand and accept that:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Providing false, misleading, or incomplete information may result in disqualification, termination of services, or legal action.</li>
                        <li>I am fully responsible for the accuracy of the information I submit.</li>
                        <li>I agree to notify the organization immediately if any information I have provided changes or is found to be incorrect.</li>
                      </ul>
                      <p>By submitting this information, I confirm my acceptance of this declaration policy.</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </div>
                  ) : (
                    "List Project"
                  )}
                </Button>
              </div>
            </div>
          </Tabs>
        </form>
      </div>
      </main>
    </div>
    </>
  );
};

export default Sell; 