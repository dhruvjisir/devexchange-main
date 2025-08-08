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
    title: 'Top Startup Marketplace Queries: Startup Bazzar, Buy Startup Websites & More',
    path: '/blog/TopStartupMarketplaceQueries',
    description: 'Discover the most searched startup marketplace queries in 2025. From "startup bazzar" to "buy startup websites" and "microacquire alternative" - we analyze what entrepreneurs are really searching for.',
    date: 'January 21, 2025',
    readTime: '8 min read',
    category: 'Market Research',
    featured: true,
    tags: ['startup bazzar', 'startup websites for sale', 'buy startup websites', 'microacquire alternative', 'buy startup', 'market research']
  },
  {
    title: 'StartupBazzar Blog: Your Complete Guide to Startup Marketplace Insights',
    path: '/blog/StartupBazzarBlogGuide',
    description: 'Welcome to the StartupBazzar blog – your ultimate resource for everything related to buying, selling, and acquiring startups. Discover expert insights and practical guides.',
    date: 'January 20, 2025',
    readTime: '5 min read',
    category: 'Blog Guide',
    featured: true,
    tags: ['blog', 'guide', 'startup marketplace']
  },
  {
    title: 'AI in Business 2025: How Small Businesses Can Harness AI & AGI',
    path: '/blog/AIInBusiness2025',
    description: 'Discover how AI and AGI are transforming small businesses in 2025. Learn practical strategies, real startup ideas, and how to leverage artificial intelligence for business growth.',
    date: 'January 15, 2025',
    readTime: '8 min read',
    category: 'Technology',
    featured: true,
    tags: ['AI', 'business', 'technology', '2025']
  },
  {
    title: '21 Profitable Business Ideas to Start in 2025 (Low Investment, High Returns)',
    path: '/blog/ProfitableBusinessIdeas2025',
    description: 'Looking for profitable business ideas in 2025? Discover 21 trending startup ideas across AI, e-commerce, services, and more. Start a business with low investment and big potential.',
    date: 'January 16, 2025',
    readTime: '10 min read',
    category: 'Business Ideas',
    featured: true,
    tags: ['business ideas', 'startup', '2025', 'profitable']
  },
  {
    title: '17 Small Business Ideas You Can Start Today (Work From Home Friendly)',
    path: '/blog/SmallBusinessIdeas2025',
    description: 'Start your entrepreneurial journey with these 17 small business ideas. Work from home, scale fast, and earn a steady income—even if you\'re just starting out.',
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Business Ideas',
    featured: true,
    tags: ['small business', 'work from home', 'entrepreneurship']
  },
  {
    title: '15 Little Business Ideas You Can Start With ₹5,000 (No Office Needed)',
    path: '/blog/LittleBusinessIdeas2025',
    description: 'Discover 15 little business ideas with low investment. Perfect for students, homemakers, and beginners. Start earning from home with zero experience.',
    date: 'January 18, 2025',
    readTime: '6 min read',
    category: 'Business Ideas',
    featured: true,
    tags: ['low investment', 'beginners', 'home business']
  },
  {
    title: 'How to Buy a Business: A Beginner\'s Guide',
    path: '/blog/HowToBuyBusinessBeginnersGuide',
    description: 'Learn how to buy a business with our comprehensive beginner\'s guide. Discover the essential steps, from finding the right biz buy opportunity to closing the deal successfully.',
    date: 'January 12, 2025',
    readTime: '7 min read',
    category: 'Buying Guide',
    tags: ['buy business', 'beginners', 'acquisition']
  },
  {
    title: 'How to Sell Your Business Online in 2025',
    path: '/blog/HowToSellYourBusinessOnline2025',
    description: 'Learn how to sell your business online in 2025 with this step-by-step guide. Discover the best strategies, platforms, and tips for a successful biz sell experience.',
    date: 'January 11, 2025',
    readTime: '5 min read',
    category: 'Selling Guide',
    tags: ['sell business', 'online', '2025']
  },
  {
    title: 'How to Acquire a Startup in 2025: A Step-by-Step Guide',
    path: '/blog/HowToAcquireStartup2025',
    description: 'Learn the step-by-step process to acquire a startup in 2025. From sourcing deals to due diligence and closing, this guide covers everything you need to know.',
    date: 'January 10, 2025',
    readTime: '12 min read',
    category: 'Acquisition Guide',
    tags: ['acquire startup', 'due diligence', 'M&A']
  },
  {
    title: 'Top 10 Platforms to Buy and Sell Startups (Why StartupBazzar Leads)',
    path: '/blog/Top10PlatformsToBuySellStartups',
    description: 'Discover the top 10 platforms to buy and sell startups in 2025. See why StartupBazzar is the best choice for founders and buyers.',
    date: 'January 8, 2025',
    readTime: '10 min read',
    category: 'Platform Comparison',
    tags: ['platforms', 'comparison', 'marketplace']
  },
  {
    title: 'Why StartupBazzar is the Best Place to Buy or Sell Your Business',
    path: '/blog/WhyStartupBazzarBest',
    description: 'Discover why StartupBazzar is the top marketplace for buying and selling startups, SaaS, and online businesses. Learn about our unique features and benefits.',
    date: 'January 5, 2025',
    readTime: '7 min read',
    category: 'Platform Features',
    tags: ['StartupBazzar', 'features', 'benefits']
  },
  {
    title: 'How to Sell Your Startup Online (Step-by-Step Guide for 2025)',
    path: '/blog/HowToSellYourStartup2025',
    description: 'A 2025 step-by-step guide to selling your startup online. Compare Acquire.com, StartupBazzar, and more. Includes tips, FAQs, and platform comparison.',
    date: 'January 3, 2025',
    readTime: '11 min read',
    category: 'Selling Guide',
    tags: ['sell startup', 'online', 'guide', '2025']
  },
  {
    title: 'How to Sell Business on Acquire.com: Complete Guide',
    path: '/blog/HowToSellBusinessOnAcquire',
    description: 'Learn how to sell your business on Acquire.com with our comprehensive guide. Discover best practices, tips, and strategies for maximizing your business value.',
    date: 'January 2, 2025',
    readTime: '9 min read',
    category: 'Platform Guide',
    tags: ['Acquire.com', 'sell business', 'platform guide']
  },
  {
    title: 'How to Sell Your Startup: Essential Tips and Strategies',
    path: '/blog/HowToSellYourStartup',
    description: 'Master the art of selling your startup with proven strategies and tips. Learn how to prepare, market, and close the deal for maximum value.',
    date: 'December 30, 2024',
    readTime: '6 min read',
    category: 'Selling Guide',
    tags: ['sell startup', 'strategies', 'tips']
  },
  {
    title: 'Sites Like Acquire.com: Top Alternatives for Business Sales',
    path: '/blog/SitesLikeAcquire',
    description: 'Explore the best alternatives to Acquire.com for selling your business. Compare features, fees, and success rates across different platforms.',
    date: 'December 28, 2024',
    readTime: '5 min read',
    category: 'Platform Comparison',
    tags: ['alternatives', 'Acquire.com', 'platforms']
  },
  {
    title: 'Sell Business Online: Complete Guide to Digital Business Sales',
    path: '/blog/SellBusinessOnline',
    description: 'Everything you need to know about selling your business online. From preparation to closing, this guide covers the entire digital sales process.',
    date: 'December 25, 2024',
    readTime: '8 min read',
    category: 'Selling Guide',
    tags: ['sell business', 'online', 'digital sales']
  },
  {
    title: 'Acquire.com Alternatives: Best Platforms to Sell Your Business',
    path: '/blog/AcquireComAlternatives',
    description: 'Discover the best alternatives to Acquire.com for selling your business. Compare features, pricing, and success rates to find the perfect platform.',
    date: 'December 20, 2024',
    readTime: '6 min read',
    category: 'Platform Comparison',
    tags: ['alternatives', 'Acquire.com', 'platforms']
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