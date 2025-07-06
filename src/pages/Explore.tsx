import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/store/projects";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp, Clock, Star, DollarSign, Users } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserRound, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Helmet } from 'react-helmet-async';

// Simple debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const ITEMS_PER_PAGE = 9;

const categories = [
  "All",
  "SaaS",
  "Shopify app",
  "Agency",
  "Digital",
  "Crypto",
  "Newsletter",
  "Ecommerce",
  "Mobile app",
  "Marketplace",
  "AI",
  "Content",
  "Other"
];

const sortOptions = [
  { value: "price-low", label: "Price: Low to High", icon: DollarSign },
  { value: "price-high", label: "Price: High to Low", icon: DollarSign }
];

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-low");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading } = useProjects();

  // Filter and sort products by price
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(query);
        const descriptionMatch = product.description.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
      });
    }

    // 2. Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // 3. Apply price sorting
    result.sort((a, b) => {
      if (sortBy === "price-high") {
        return b.price - a.price;
      } else {
        return a.price - b.price; // Default to low to high
      }
    });

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Initialize displayed products when products data changes
  useEffect(() => {
    if (products.length > 0) {
      const initialProducts = products.slice(0, ITEMS_PER_PAGE);
      setDisplayedProducts(initialProducts);
      setHasMore(products.length > ITEMS_PER_PAGE);
      setCurrentPage(1);
    }
  }, [products]);

  // Update displayed products when page changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = filteredProducts.slice(startIndex, endIndex);
      setDisplayedProducts(newProducts);
      setHasMore(endIndex < filteredProducts.length);
    }
  }, [currentPage, filteredProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Debounced search handler
  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  // Load more products when scrolling
  const loadMoreProducts = useCallback(() => {
    if (!hasMore || isLoading) return;

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProducts = filteredProducts.slice(startIndex, endIndex);

    if (newProducts.length === 0) {
      setHasMore(false);
      return;
    }

    setDisplayedProducts(prev => [...prev, ...newProducts]);
    setCurrentPage(nextPage);
  }, [currentPage, filteredProducts, hasMore, isLoading]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        loadMoreProducts();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreProducts, hasMore]);

  return (
    <>
      <Helmet>
        <title>Explore Startups for Sale | capaitalexchange</title>
        <meta name="description" content="Browse the best startups, SaaS, and online businesses for sale. Find your next acquisition." />
        <link rel="canonical" href="https://www.capaitalexchange.com/explore" />
        <meta name="keywords" content="explore startups, buy a startup, startup marketplace, SaaS for sale, business acquisition, capaitalexchange" />
        <meta property="og:title" content="Explore Startups for Sale | Startup Marketplace | capaitalexchange" />
        <meta property="og:description" content="Browse and discover the best startups, SaaS, and online businesses for sale. Find your next acquisition on capaitalexchange." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.capaitalexchange.com/explore" />
        <meta property="og:image" content="https://www.capaitalexchange.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Startups for Sale | Startup Marketplace | capaitalexchange" />
        <meta name="twitter:description" content="Browse and discover the best startups, SaaS, and online businesses for sale. Find your next acquisition on capaitalexchange." />
        <meta name="twitter:image" content="https://www.capaitalexchange.com/images/twitter-card.jpg" />
      </Helmet>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-96">
            <Input
              type="search"
              placeholder="Search projects..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Sort by price" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProducts.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="group"
          >
            <div className="bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <div className="aspect-video overflow-hidden bg-muted">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-card-foreground">{project.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      by {project.maker?.name || 'Anonymous'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs sm:text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    ${project.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <DollarSign className="h-6 w-6 sm:h-5 sm:w-5" />
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto w-full md:w-auto">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-full md:w-auto flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0 w-full md:w-auto"
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 p-0 w-full md:w-auto"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-full md:w-auto flex items-center justify-center"
          >
            Next
            <ChevronRight className="h-6 w-6 ml-1" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {displayedProducts.length} of {filteredProducts.length} projects
        </div>
      </div>
    </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Explore Startups, SaaS & Online Businesses for Sale</h1>
    </>
  );
};

export default Explore; 