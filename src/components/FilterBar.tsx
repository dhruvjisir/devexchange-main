import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface FilterBarProps {
  onTabChange: (value: string) => void;
  onCategoryChange: (category: string | null) => void;
}

export const FilterBar = ({ onTabChange, onCategoryChange }: FilterBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // If clicking the same category again, deselect it
      setSelectedCategory(null);
      onCategoryChange(null);
    } else {
      setSelectedCategory(category);
      onCategoryChange(category);
    }
  };

  return (
    <div className="container py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <Tabs defaultValue="trending" className="w-full md:w-auto" onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('SaaS')}
          className={`transition-all duration-200 ${
            selectedCategory === 'SaaS'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          SaaS
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Shopify app')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Shopify app'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Shopify app
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Agency')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Agency'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Agency
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Digital')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Digital'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Digital
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Crypto')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Crypto'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Crypto
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Newsletter')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Newsletter'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Newsletter
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Ecommerce')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Ecommerce'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Ecommerce
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Mobile app')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Mobile app'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Mobile app
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Marketplace')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Marketplace'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Marketplace
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('AI')}
          className={`transition-all duration-200 ${
            selectedCategory === 'AI'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          AI
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Content')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Content'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Content
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleCategoryClick('Other')}
          className={`transition-all duration-200 ${
            selectedCategory === 'Other'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border-primary/20'
          }`}
        >
          Other
        </Button>
      </div>
    </div>
  );
};
