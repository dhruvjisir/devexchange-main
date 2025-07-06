import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { memo } from "react";
import { Code, Database, Globe, LineChart, Smartphone, Terminal } from "lucide-react";

export interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string | null;
  maker: {
    name: string;
    avatar?: string;
  };
  isVerified?: boolean;
  isNew?: boolean;
  category?: string;
}

const getDefaultImage = (category?: string) => {
  const defaultImages = {
    'web': <Globe className="h-16 w-16 text-muted-foreground" />,
    'mobile': <Smartphone className="h-16 w-16 text-muted-foreground" />,
    'database': <Database className="h-16 w-16 text-muted-foreground" />,
    'analytics': <LineChart className="h-16 w-16 text-muted-foreground" />,
    'cli': <Terminal className="h-16 w-16 text-muted-foreground" />,
    'default': <Code className="h-16 w-16 text-muted-foreground" />
  };

  return defaultImages[category?.toLowerCase() as keyof typeof defaultImages] || defaultImages.default;
};

const MakerAvatar = memo(({ maker }: { maker: ProductCardProps['maker'] }) => (
  <div className="flex items-center gap-2">
    <div className="h-6 w-6 rounded-full bg-muted overflow-hidden">
      {maker.avatar ? (
        <img 
          src={maker.avatar} 
          alt={maker.name} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground text-xs">
          {maker.name.charAt(0)}
        </div>
      )}
    </div>
    <span className="text-xs text-muted-foreground">by {maker.name}</span>
  </div>
));

const ProductImage = memo(({ image, title, category }: { image?: string | null, title: string, category?: string }) => {
  if (!image || image.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center h-full">
        {getDefaultImage(category)}
        <span className="text-sm text-muted-foreground mt-2">{category || 'Project'}</span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={title}
      className="h-full w-full object-cover transition-all hover:scale-105"
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
        const fallback = document.createElement('div');
        fallback.className = 'flex flex-col items-center justify-center p-4 text-center h-full';
        fallback.innerHTML = `
          ${getDefaultImage(category).props.children}
          <span class="text-sm text-muted-foreground mt-2">${category || 'Project'}</span>
        `;
        target.parentElement?.appendChild(fallback);
      }}
    />
  );
});

export const ProductCard = memo(({
  id,
  title,
  description,
  price,
  image,
  maker,
  isVerified,
  isNew,
  category,
}: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden card-hover">
        <div className="aspect-video overflow-hidden bg-muted">
          <ProductImage image={image} title={title} category={category} />
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold truncate">{title}</h3>
            <div className="flex flex-shrink-0">
              {price === 0 ? (
                <Badge variant="outline" className="ml-2 bg-accent/50">Free</Badge>
              ) : (
                <Badge className="ml-2">${price.toLocaleString()}</Badge>
              )}
              {isNew && <Badge variant="secondary" className="ml-2">New</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <MakerAvatar maker={maker} />
          {isVerified && (
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
              Verified
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
});
