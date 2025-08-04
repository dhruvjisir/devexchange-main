import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: 'AI in Business 2025: How Small Businesses Can Harness AI & AGI',
    path: '/blog/AIInBusiness2025',
    description: 'Discover how AI and AGI are transforming small businesses in 2025. Learn practical strategies, real startup ideas, and how to leverage artificial intelligence for business growth.',
    date: 'January 15, 2025',
    readTime: '8 min read'
  },
  {
    title: '21 Profitable Business Ideas to Start in 2025 (Low Investment, High Returns)',
    path: '/blog/ProfitableBusinessIdeas2025',
    description: 'Looking for profitable business ideas in 2025? Discover 21 trending startup ideas across AI, e-commerce, services, and more. Start a business with low investment and big potential.',
    date: 'January 16, 2025',
    readTime: '10 min read'
  },
  {
    title: '17 Small Business Ideas You Can Start Today (Work From Home Friendly)',
    path: '/blog/SmallBusinessIdeas2025',
    description: 'Start your entrepreneurial journey with these 17 small business ideas. Work from home, scale fast, and earn a steady income—even if you\'re just starting out.',
    date: 'January 17, 2025',
    readTime: '8 min read'
  },
  {
    title: '15 Little Business Ideas You Can Start With ₹5,000 (No Office Needed)',
    path: '/blog/LittleBusinessIdeas2025',
    description: 'Discover 15 little business ideas with low investment. Perfect for students, homemakers, and beginners. Start earning from home with zero experience.',
    date: 'January 18, 2025',
    readTime: '6 min read'
  },
  {
    title: 'How to Acquire a Startup in 2025: A Step-by-Step Guide',
    path: '/blog/HowToAcquireStartup2025',
    description: 'Learn the step-by-step process to acquire a startup in 2025. From sourcing deals to due diligence and closing, this guide covers everything you need to know.',
    date: 'January 10, 2025',
    readTime: '12 min read'
  },
  {
    title: 'Top 10 Platforms to Buy and Sell Startups (Why StartupBazzar Leads)',
    path: '/blog/Top10PlatformsToBuySellStartups',
    description: 'Discover the top 10 platforms to buy and sell startups in 2025. See why StartupBazzar is the best choice for founders and buyers.',
    date: 'January 8, 2025',
    readTime: '10 min read'
  },
  {
    title: 'Why StartupBazzar is the Best Place to Buy or Sell Your Business',
    path: '/blog/WhyStartupBazzarBest',
    description: 'Discover why StartupBazzar is the top marketplace for buying and selling startups, SaaS, and online businesses. Learn about our unique features and benefits.',
    date: 'January 5, 2025',
    readTime: '7 min read'
  },
  {
    title: 'How to Sell Your Startup Online (Step-by-Step Guide for 2025)',
    path: '/blog/HowToSellYourStartup2025',
    description: 'A 2025 step-by-step guide to selling your startup online. Compare Acquire.com, StartupBazzar, and more. Includes tips, FAQs, and platform comparison.',
    date: 'January 3, 2025',
    readTime: '11 min read'
  }
];

export default function BlogIndex() {
  return (
    <>
      <Helmet>
        <title>StartupBazzar Blog | Guides, Tips & Startup Marketplace Insights</title>
        <meta name="description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts." />
        <meta name="keywords" content="startup blog, buy startup, sell startup, guides, tips, StartupBazzar, SaaS, business acquisition, AI business, business ideas" />
        <meta property="og:title" content="StartupBazzar Blog | Guides, Tips & Startup Marketplace Insights" />
        <meta property="og:description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.startupbazzar.com/blog" />
        <meta property="og:image" content="https://www.startupbazzar.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StartupBazzar Blog | Guides, Tips & Startup Marketplace Insights" />
        <meta name="twitter:description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts." />
        <meta name="twitter:image" content="https://www.startupbazzar.com/images/twitter-card.jpg" />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">StartupBazzar Blog</h1>
        <p className="text-muted-foreground mb-12 text-center text-lg">Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with StartupBazzar's latest blog posts.</p>
        
        <div className="grid gap-8">
          {blogPosts.map((post, index) => (
            <article key={post.path} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <Link to={post.path} className="block group">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary hover:text-blue-700 transition-colors group-hover:underline mb-3">
                  {post.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
} 