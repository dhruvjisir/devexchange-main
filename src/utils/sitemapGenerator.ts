import { blogPosts } from '@/config/blogPosts';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://blog.startupbazzar.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    // Main pages
    {
      loc: `${baseUrl}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/explore`,
      lastmod: currentDate,
      changefreq: 'hourly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/sell`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/tools`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/pricing`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  // Add blog posts
  blogPosts.forEach(post => {
    urls.push({
      loc: `${baseUrl}${post.path}`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: 0.8
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://blog.startupbazzar.com/sitemap.xml
Sitemap: https://www.startupbazzar.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/
Disallow: /private/
`;
};

export const generateRSSFeed = (): string => {
  const baseUrl = 'https://blog.startupbazzar.com';
  const currentDate = new Date().toISOString();
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>StartupBazzar Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert guides, tips, and insights on buying, selling, and acquiring startups</description>
    <language>en-US</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${blogPosts.map(post => `    <item>
      <title>${post.title}</title>
      <link>${baseUrl}${post.path}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${baseUrl}${post.path}</guid>
      <category>${post.category}</category>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return rss;
}; 