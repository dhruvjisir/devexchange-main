import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
  image?: string;
  type?: 'article' | 'website';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  wordCount?: number;
  isBlogPost?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords,
  url,
  image = 'https://www.startupbazzar.com/images/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'StartupBazzar Team',
  section,
  tags = [],
  wordCount,
  isBlogPost = false
}: SEOHeadProps) {
  const fullTitle = `${title} | StartupBazzar`;
  const twitterImage = image || 'https://www.startupbazzar.com/images/twitter-card.jpg';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="StartupBazzar" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article-specific Open Graph tags */}
      {isBlogPost && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime} />
          <meta property="article:author" content="https://www.startupbazzar.com" />
          {section && <meta property="article:section" content={section} />}
          {tags.length > 0 && <meta property="article:tag" content={tags.join(', ')} />}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@startupbazzar" />
      <meta name="twitter:creator" content="@startupbazzar" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="StartupBazzar" />
      
      {/* Canonical and Alternate URLs */}
      <link rel="canonical" href={url} />
      <link rel="alternate" href={url.replace('blog.startupbazzar.com', 'www.startupbazzar.com')} />
      
      {/* Structured Data - Article Schema for Blog Posts */}
      {isBlogPost && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
              "@type": "Organization",
              "name": author,
              "url": "https://www.startupbazzar.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "StartupBazzar",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.startupbazzar.com/images/logo.png"
              }
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            },
            "keywords": keywords,
            "articleSection": section,
            "wordCount": wordCount
          })}
        </script>
      )}
      
      {/* Structured Data - BreadcrumbList */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://blog.startupbazzar.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://blog.startupbazzar.com/blog"
            },
            ...(section ? [{
              "@type": "ListItem",
              "position": 3,
              "name": section,
              "item": `https://blog.startupbazzar.com/blog/category/${section.toLowerCase().replace(/\s+/g, '-')}`
            }] : []),
            {
              "@type": "ListItem",
              "position": isBlogPost ? 4 : 3,
              "name": title,
              "item": url
            }
          ]
        })}
      </script>
    </Helmet>
  );
} 