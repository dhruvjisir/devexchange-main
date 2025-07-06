import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About StartupBazzar | Our Mission & Team</title>
        <meta name="description" content="Learn about StartupBazzar, our mission, and the team behind the leading marketplace for buying and selling startups and online businesses." />
        <meta name="keywords" content="about StartupBazzar, our team, startup marketplace, buy startups, sell startups, SaaS, business acquisition" />
        <meta property="og:title" content="About StartupBazzar | Our Mission & Team" />
        <meta property="og:description" content="Learn about StartupBazzar, our mission, and the team behind the leading marketplace for buying and selling startups and online businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.startupbazzar.com/about" />
        <meta property="og:image" content="https://www.startupbazzar.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About StartupBazzar | Our Mission & Team" />
        <meta name="twitter:description" content="Learn about StartupBazzar, our mission, and the team behind the leading marketplace for buying and selling startups and online businesses." />
        <meta name="twitter:image" content="https://www.startupbazzar.com/images/twitter-card.jpg" />
      </Helmet>
    <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">About StartupBazzar</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We are a discovery platform built for founders, makers, and entrepreneurs to showcase and explore startups and SaaS products available for acquisition. Our goal is to simplify the process of connecting sellers with interested buyers — without getting involved in the transaction itself.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>For Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Whether you're listing a profitable SaaS, an early-stage startup, or a side project ready for a new owner, StartupBazzar gives you the visibility and tools to reach the right audience.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>For Buyers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Buyers can browse a wide range of opportunities and reach out directly to founders to start the conversation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Approach</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We don't take commissions or handle payments — just a space to connect, share, and grow through meaningful startup deals.
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default About; 