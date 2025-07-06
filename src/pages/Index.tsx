import { useState } from "react";
import { Link } from "react-router-dom";
import { FilterBar } from "@/components/FilterBar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/store/projects";

const Index = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: products = [], isLoading, error } = useProjects();

  console.log('Index page - Products:', products);
  console.log('Index page - Loading:', isLoading);
  console.log('Index page - Error:', error);

  // Validate products data
  const validProducts = products.filter(product => {
    const isValid = product && 
      typeof product.id === 'string' &&
      typeof product.title === 'string' &&
      typeof product.description === 'string' &&
      typeof product.price === 'number' &&
      typeof product.image === 'string' &&
      typeof product.category === 'string';
    
    if (!isValid) {
      console.warn('Invalid product in Index:', product);
    }
    return isValid;
  });

  console.log('Index page - Valid products:', validProducts);

  // Get projects listed within the last 24 hours
  const recentProducts = validProducts.filter(product => {
    try {
      const createdAt = new Date(product.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    } catch (error) {
      console.warn('Error processing product date:', product, error);
      return false;
    }
  });

  // Format time since listing
  const getTimeSinceListing = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    } else {
      return `${diffInYears}y ago`;
    }
  };

  // Filter products based on active tab and selected category
  const filteredProducts = validProducts.filter(product => {
    try {
      // First apply category filter if one is selected
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Then apply tab filter
      switch (activeTab) {
        case "new":
          return recentProducts.some(p => p.id === product.id);
        case "featured":
          return product.is_verified;
        default:
          return true;
      }
    } catch (error) {
      console.warn('Error filtering product:', product, error);
      return false;
    }
  });

  console.log('Index page - Filtered products:', filteredProducts);

  return (
    <>
      <Hero />
      
      <main className="flex-grow">
        <FilterBar 
          onTabChange={setActiveTab} 
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Main Projects Section */}
        <section className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold animate-fade-in">
              {activeTab === "trending" ? "Trending Projects" :
               activeTab === "new" ? "Recently Listed (Last 24 Hours)" :
               "Featured Projects"}
              {selectedCategory && ` - ${selectedCategory}`}
            </h2>
            <Link to="/explore" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Error loading projects: {error.message}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {activeTab === "new" ? "No new projects in the last 24 hours." : "No projects found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Link 
                  key={product.id} 
                  to={`/project/${product.id}`}
                  className="animate-fade-in transform transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className="bg-card rounded-lg overflow-hidden border">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{product.title}</h3>
                        {activeTab === "new" && (
                          <Badge variant="secondary">New</Badge>
                        )}
                        {product.is_verified && (
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Price:</span>
                            <span className="font-semibold text-primary">
                              ${product.price.toLocaleString()}
                            </span>
                          </div>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Yearly Revenue:</span>
                            <span className="font-semibold text-primary">
                              ${product.yearly_revenue?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {getTimeSinceListing(product.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        <section className="container py-8">
          <div className="bg-gradient-to-r from-accent/30 to-accent/10 dark:from-accent/10 dark:to-accent/5 rounded-2xl p-8 text-center relative overflow-hidden">
            {/* Animated background element */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-color-3/10 blur-3xl animate-pulse" 
                  style={{ animationDuration: '8s' }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 animate-fade-in">Ready to showcase your project?</h2>
              <p className="mb-6 text-muted-foreground max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                List your startup, SaaS, or AI tool for a flat fee of $9.99 and connect with buyers directly.
                No commission fees, just a simple one-time payment.
              </p>
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <RainbowButton onClick={() => window.location.href="/sell"}>
                  List Your Project
                </RainbowButton>
              </div>
            </div>
          </div>
        </section>
        
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "For Founders",
                description: "Sell your SaaS products, indie startups, or AI tools directly to interested buyers.",
                icon: "🚀"
              },
              {
                title: "For Developers",
                description: "Discover tools and projects that can help you build faster and smarter.",
                icon: "💻"
              },
              {
                title: "For Investors",
                description: "Find promising indie projects with validated products and real users.",
                icon: "📈"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="border rounded-xl p-6 animate-fade-in hover:border-primary/50 transition-colors"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
