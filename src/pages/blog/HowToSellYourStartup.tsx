import { Helmet } from 'react-helmet-async';

export default function HowToSellYourStartup() {
  return (
    <>
      <Helmet>
        <title>How to Sell Your Startup | StartupBazzar Blog</title>
        <meta name="description" content="Learn how to sell your startup online. Step-by-step guide, tips, and best platforms including StartupBazzar and Acquire.com." />
        <meta name="keywords" content="how to sell your startup, sell startup online, startup acquisition, StartupBazzar, Acquire.com" />
        <meta property="og:title" content="How to Sell Your Startup | StartupBazzar Blog" />
        <meta property="og:description" content="Learn how to sell your startup online. Step-by-step guide, tips, and best platforms including StartupBazzar and Acquire.com." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.startupbazzar.com/blog/HowToSellYourStartup" />
        <meta property="og:image" content="https://www.startupbazzar.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Sell Your Startup | StartupBazzar Blog" />
        <meta name="twitter:description" content="Learn how to sell your startup online. Step-by-step guide, tips, and best platforms including StartupBazzar and Acquire.com." />
        <meta name="twitter:image" content="https://www.startupbazzar.com/images/twitter-card.jpg" />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">How to Sell Your Startup</h1>
        <p className="text-muted-foreground mb-6 text-center">Learn how to sell your startup online. Step-by-step guide, tips, and best platforms including StartupBazzar and Acquire.com.</p>
        {/* Add detailed content here */}
      </div>
    </>
  );
} 