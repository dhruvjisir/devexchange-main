import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAddProject } from "@/store/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ListProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addProject = useAddProject();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    yearlyRevenue: '',
    image: '',
    category: '',
    tags: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title) errors.push('Title is required');
    if (!formData.description) errors.push('Description is required');
    if (!formData.price) errors.push('Price is required');
    if (!formData.yearlyRevenue) errors.push('Yearly Revenue is required');
    if (!formData.image) errors.push('Image URL is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.tags) errors.push('Tags are required');

    if (formData.price && Number(formData.price) < 0) {
      errors.push('Price must be a positive number');
    }

    if (formData.yearlyRevenue && Number(formData.yearlyRevenue) < 0) {
      errors.push('Yearly Revenue must be a positive number');
    }

    if (formData.image && !formData.image.startsWith('http')) {
      errors.push('Image URL must start with http:// or https://');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const errors = validateForm();
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      console.log('Submitting project data:', formData);

      const projectData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        yearly_revenue: Number(formData.yearlyRevenue),
        ttm_revenue: 0,
        ttm_profit: 0,
        last_month_revenue: 0,
        last_month_profit: 0,
        customer_count: '',
        arr: 0,
        growth_rate: '',
        churn_rate: '',
        date_founded: '',
        team_size: '',
        business_models: [],
        tech_stack: [],
        competitors: [],
        growth_opportunities: [],
        key_assets: [],
        selling_reason: '',
        financing: '',
        image: formData.image,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        maker: {
          name: "Current User",
        },
      };

      console.log('Formatted project data:', projectData);

      const result = await addProject.mutateAsync(projectData);
      console.log('Project added successfully:', result);
      
      toast({
        title: "Project Listed Successfully!",
        description: "Your project has been listed and is now visible to potential buyers.",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error listing project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <NavBar />
      
      <main className="flex-grow w-full container py-8">
        <div className="max-w-2xl mx-auto w-full">
          <div className="space-y-6 w-full">
            <div>
              <h1 className="text-3xl font-bold">List Your Project</h1>
              <p className="text-muted-foreground mt-2">
                Fill out the form below to list your project on our marketplace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your project name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project in detail"
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter your asking price"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="yearlyRevenue">Yearly Revenue (USD)</Label>
                  <Input
                    id="yearlyRevenue"
                    name="yearlyRevenue"
                    type="number"
                    value={formData.yearlyRevenue}
                    onChange={handleInputChange}
                    placeholder="Enter your yearly revenue"
                    required
                    min="0"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This helps potential buyers understand your project's current performance
                  </p>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image">Project Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Enter image URL"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., AI, SaaS, Developer Tools"
                    required
                  />
                </div>
              </div>

              {/* Robust, mobile-friendly Terms and Declaration Section */}
              <div className="border rounded p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
                <h2 className="text-lg font-semibold mb-2">Terms and Declaration</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3 mb-2 flex-1">
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="accent-primary mt-1"
                    />
                    <div className="w-full">
                      <label htmlFor="termsCheckbox" className="block text-sm font-medium select-none cursor-pointer mb-1">
                        Terms and Conditions
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        I have read and agree to the <a href="/terms" className="underline" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
                      </p>
                    </div>
                  </div>
                  {/* Declaration Policy */}
                  <div className="flex items-start gap-3 mb-2 flex-1">
                    <input
                      type="checkbox"
                      id="declarationCheckbox"
                      checked={declarationAccepted}
                      onChange={e => setDeclarationAccepted(e.target.checked)}
                      className="accent-primary mt-1"
                    />
                    <div className="w-full">
                      <label htmlFor="declarationCheckbox" className="block text-sm font-medium select-none cursor-pointer mb-1">
                        Declaration Policy
                      </label>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <p>I hereby declare that all information provided by me is true, complete, and correct to the best of my knowledge and belief. I understand and accept that:</p>
                        <ul className="list-disc pl-4">
                          <li>Providing false, misleading, or incomplete information may result in disqualification, termination of services, or legal action.</li>
                          <li>I am fully responsible for the accuracy of the information I submit.</li>
                          <li>I agree to notify the organization immediately if any information I have provided changes or is found to be incorrect.</li>
                        </ul>
                        <p>By submitting this information, I confirm my acceptance of this declaration policy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !termsAccepted || !declarationAccepted}>
                  {isSubmitting ? "Listing Project..." : "List Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListProject; 