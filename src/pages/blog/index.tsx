import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: 'How to Acquire a Startup in 2025: A Step-by-Step Guide',
    path: '/blog/HowToAcquireStartup2025',
    description: 'Learn the step-by-step process to acquire a startup in 2025. From sourcing deals to due diligence and closing, this guide covers everything you need to know.'
  },
  {
    title: 'Top 10 Platforms to Buy and Sell Startups (Why capaitalexchange Leads)',
    path: '/blog/Top10PlatformsToBuySellStartups',
    description: 'Discover the top 10 platforms to buy and sell startups in 2025. See why capaitalexchange is the best choice for founders and buyers.'
  },
  {
    title: 'Why capaitalexchange is the Best Place to Buy or Sell Your Business',
    path: '/blog/WhyCapaitalexchangeBest',
    description: 'Discover why capaitalexchange is the top marketplace for buying and selling startups, SaaS, and online businesses. Learn about our unique features and benefits.'
  },
  {
    title: 'How to Sell Your Startup Online (Step-by-Step Guide for 2025)',
    path: '/blog/HowToSellYourStartup2025',
    description: 'A 2025 step-by-step guide to selling your startup online. Compare Acquire.com, capaitalexchange, and more. Includes tips, FAQs, and platform comparison.'
  }
];

export default function BlogIndex() {
  return (
    <>
      <Helmet>
        <title>capaitalexchange Blog | Guides, Tips & Startup Marketplace Insights</title>
        <meta name="description" content="Read expert guides, tips, and insights on buying and acquiring startups. Stay updated with capaitalexchange's latest blog posts." />
        <meta name="keywords" content="startup blog, buy startup, sell startup, guides, tips, capaitalexchange, SaaS, business acquisition" />
        <meta property="og:title" content="capaitalexchange Blog | Guides, Tips & Startup Marketplace Insights" />
        <meta property="og:description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with capaitalexchange's latest blog posts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.startupbazzar.com/blog" />
        <meta property="og:image" content="https://www.startupbazzar.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="capaitalexchange Blog | Guides, Tips & Startup Marketplace Insights" />
        <meta name="twitter:description" content="Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with capaitalexchange's latest blog posts." />
        <meta name="twitter:image" content="https://www.startupbazzar.com/images/twitter-card.jpg" />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">capaitalexchange Blog</h1>
        <p className="text-muted-foreground mb-8 text-center">Read expert guides, tips, and insights on buying, selling, and acquiring startups. Stay updated with capaitalexchange's latest blog posts.</p>
        <ul className="space-y-8">
          {blogPosts.map((post) => (
            <li key={post.path} className="border-b pb-6">
              <Link to={post.path} className="text-2xl font-semibold text-primary hover:underline">
                {post.title}
              </Link>
              <p className="text-muted-foreground mt-2">{post.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
} 