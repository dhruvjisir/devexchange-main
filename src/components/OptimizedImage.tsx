import { useState, useEffect } from 'react';

// Simple image optimization utility
const optimizeImage = (url: string, width: number = 800) => {
  if (!url) return '';
  
  // If it's already an optimized URL, return as is
  if (url.includes('width=')) return url;
  
  // Add width parameter for optimization
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}&quality=80`;
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallback?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  fallback = '/placeholder.png'
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const optimizedSrc = optimizeImage(src, width);
    const img = new Image();
    
    img.onload = () => {
      setImgSrc(optimizedSrc);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
    
    img.src = optimizedSrc;
  }, [src, width]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${error ? 'object-contain' : 'object-cover'}`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
}; 