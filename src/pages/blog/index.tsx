import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { blogPosts, categories, getFeaturedPosts } from '@/config/blogPosts';
import InlineAd from '@/components/ads/InlineAd';
import Banner468x60 from '@/components/ads/Banner468x60';

export default function BlogIndex() {
  return (
    <>
      <Helmet>
        <title>StartupBazzar Blog | Guides, Tips & Startup Marketplace Insights</title>
        <meta name="description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts." />
        <meta name="keywords" content="startup blog, buy startup, sell startup, guides, tips, StartupBazzar, SaaS, business acquisition, AI business, business ideas, startup marketplace, acquire startup" />
        <meta name="author" content="StartupBazzar Team" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="StartupBazzar Blog | Guides, Tips & Startup Marketplace Insights" />
        <meta property="og:description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blog.startupbazzar.com" />
        <meta property="og:image" content="https://www.startupbazzar.com/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="StartupBazzar Blog - Startup Marketplace Insights" />
        <meta property="og:site_name" content="StartupBazzar Blog" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StartupBazzar Blog | Guides, Tips & Startup Marketplace Insights" />
        <meta name="twitter:description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts." />
        <meta name="twitter:image" content="https://www.startupbazzar.com/images/twitter-card.jpg" />
        <meta name="twitter:image:alt" content="StartupBazzar Blog - Startup Marketplace Insights" />
        <meta name="twitter:site" content="@startupbazzar" />
        <meta name="twitter:creator" content="@startupbazzar" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StartupBazzar Blog" />
        
        {/* Canonical and Alternate URLs */}
        <link rel="canonical" href="https://blog.startupbazzar.com" />
        <link rel="alternate" href="https://www.startupbazzar.com/blog" />
        
        {/* Structured Data - Blog Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "StartupBazzar Blog",
            "description": "Expert guides, tips, and insights on buying, selling, and acquiring startups",
            "url": "https://blog.startupbazzar.com",
            "publisher": {
              "@type": "Organization",
              "name": "StartupBazzar",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.startupbazzar.com/images/logo.png"
              }
            },
            "blogPost": [
              {
                "@type": "BlogPosting",
                "headline": "Top Startup Marketplace Queries: Startup Bazzar, Buy Startup Websites & More",
                "url": "https://blog.startupbazzar.com/blog/TopStartupMarketplaceQueries",
                "datePublished": "2025-01-21T00:00:00+00:00",
                "author": {
                  "@type": "Organization",
                  "name": "StartupBazzar Team"
                }
              },
              {
                "@type": "BlogPosting",
                "headline": "AI in Business 2025: How Small Businesses Can Harness AI & AGI",
                "url": "https://blog.startupbazzar.com/blog/AIInBusiness2025",
                "datePublished": "2025-01-15T00:00:00+00:00",
                "author": {
                  "@type": "Organization",
                  "name": "StartupBazzar Team"
                }
              }
            ]
          })}
        </script>
        
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
              }
            ]
          })}
        </script>
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "StartupBazzar",
            "url": "https://www.startupbazzar.com",
            "logo": "https://www.startupbazzar.com/images/logo.png",
            "description": "The leading marketplace for buying and selling startups, SaaS, and online businesses",
            "sameAs": [
              "https://twitter.com/startupbazzar",
              "https://linkedin.com/company/startupbazzar",
              "https://facebook.com/startupbazzar"
            ]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              StartupBazzar Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert insights, guides, and tips on buying, selling, and acquiring startups. 
              Stay ahead with the latest trends in the startup marketplace.
            </p>
            <div className="flex justify-center mt-8">
              <div className="bg-white dark:bg-slate-800 rounded-full px-6 py-3 shadow-lg">
                <span className="text-sm text-muted-foreground">
                  📚 {blogPosts.length} Articles • 🎯 Expert Guides • 🚀 Latest Insights
                </span>
              </div>
            </div>
          </div>

          <div className="my-8 flex flex-col items-center gap-4">
            <InlineAd />
            <Banner468x60 />
          </div>

          {/* Featured Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFeaturedPosts().slice(0, 6).map((post, index) => (
                <article key={post.path} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <Link to={post.path} className="block group">
                      <h3 className="text-lg font-semibold text-primary hover:text-blue-700 transition-colors mb-3 line-clamp-2 group-hover:underline">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span className="group-hover:text-blue-600 transition-colors">Read More →</span>
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">All Articles</h2>
        <div className="grid gap-8">
          {blogPosts.map((post, index) => (
                <article key={post.path} className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    </div>
              </div>
              <Link to={post.path} className="block group">
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary hover:text-blue-700 transition-colors mb-3 group-hover:underline">
                  {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">Read Full Article</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
              </Link>
            </article>
          ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest insights on startup acquisitions, business ideas, and marketplace trends delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 