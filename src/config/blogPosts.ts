export interface BlogPost {
  title: string;
  path: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
  tags?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    title: "How to Sell a Bootstrapped SaaS in 7 Days With No Earn-Out (Using StartupBazaar)",
    path: "/blog/how-to-sell-bootstrapped-saas-7-days",
    description: "Learn how to sell your bootstrapped SaaS in just 7 days with full payment upfront and no earn-out agreements using StartupBazaar's streamlined marketplace.",
    date: "2025-12-08",
    readTime: "8 min read",
    category: "Business Exit",
    featured: true,
    tags: ["SaaS", "Business Exit", "Startup Sale", "No Earn-Out", "Quick Exit", "StartupBazaar"]
  },
  {
    title: "Top Startup Marketplace Queries: What Buyers Are Actually Searching For",
    path: "/blog/top-startup-marketplace-queries",
    description: "Discover the most searched startup marketplace queries and learn how to optimize your listing for maximum visibility and buyer engagement.",
    date: "2025-12-07",
    readTime: "6 min read",
    category: "Market Research",
    featured: true,
    tags: ["Startup Marketplace", "SEO", "Buyer Behavior", "Market Research", "Listing Optimization"]
  },
  {
    title: "StartupBazzar Blog Guide: Your Complete Resource for Startup Success",
    path: "/blog/startupbazzar-blog-guide",
    description: "Explore StartupBazzar's comprehensive blog covering expert guides, business ideas, platform comparisons, and industry insights for entrepreneurs.",
    date: "2025-12-06",
    readTime: "5 min read",
    category: "Platform Guide",
    featured: false,
    tags: ["StartupBazzar", "Blog Guide", "Entrepreneurship", "Resources", "Platform Features"]
  },
  {
    title: "How to Buy a Business: A Beginner's Guide to Business Acquisition",
    path: "/blog/how-to-buy-business-beginners-guide",
    description: "Complete beginner's guide to buying a business, from finding opportunities to closing the deal successfully.",
    date: "2025-12-05",
    readTime: "12 min read",
    category: "Business Acquisition",
    featured: true,
    tags: ["Business Buying", "Acquisition", "Due Diligence", "Beginner Guide", "Business Purchase"]
  },
  {
    title: "How to Sell Your Business Online in 2025: Complete Guide",
    path: "/blog/how-to-sell-your-business-online-2025",
    description: "Master the art of selling your business online in 2025 with proven strategies and modern digital tools.",
    date: "2025-12-04",
    readTime: "10 min read",
    category: "Business Exit",
    featured: true,
    tags: ["Business Sale", "Online Selling", "Digital Marketing", "Exit Strategy", "2025 Trends"]
  },
  {
    title: "AI in Business 2025: How Artificial Intelligence is Transforming Entrepreneurship",
    path: "/blog/ai-in-business-2025",
    description: "Explore how AI is revolutionizing business operations, decision-making, and growth strategies in 2025.",
    date: "2025-12-03",
    readTime: "9 min read",
    category: "Technology",
    featured: false,
    tags: ["Artificial Intelligence", "Business Technology", "AI Trends", "Digital Transformation", "2025"]
  },
  {
    title: "The Ultimate Guide to Startup Funding: From Bootstrap to Series A",
    path: "/blog/startup-funding-guide-bootstrap-to-series-a",
    description: "Navigate the complex world of startup funding with this comprehensive guide covering all stages from bootstrap to Series A.",
    date: "2025-12-02",
    readTime: "15 min read",
    category: "Funding",
    featured: true,
    tags: ["Startup Funding", "Venture Capital", "Bootstrap", "Series A", "Investment"]
  },
  {
    title: "10 Profitable Business Ideas for 2025: Low-Cost, High-Potential Ventures",
    path: "/blog/profitable-business-ideas-2025",
    description: "Discover 10 low-cost, high-potential business ideas that are trending in 2025 and can be started with minimal capital.",
    date: "2025-12-01",
    readTime: "11 min read",
    category: "Business Ideas",
    featured: false,
    tags: ["Business Ideas", "Entrepreneurship", "Low-Cost Business", "2025 Trends", "Profitability"]
  }
];

export const categories = [
  'All',
  'Market Research',
  'Blog Guide',
  'Business Ideas',
  'Selling Guide',
  'Buying Guide',
  'Acquisition Guide',
  'Platform Comparison',
  'Platform Guide',
  'Platform Features',
  'Technology'
];

export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);

export const getPostsByCategory = (category: string) => {
  if (category === 'All') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const getPostsByTag = (tag: string) => {
  return blogPosts.filter(post => post.tags?.includes(tag));
};

export const getRecentPosts = (limit: number = 5) => {
  return blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}; 