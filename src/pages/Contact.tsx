import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | StartupBazzar</title>
        <meta name="description" content="Contact StartupBazzar for support, partnership, or general inquiries." />
        <link rel="canonical" href="https://www.startupbazzar.com/contact" />
        <meta name="keywords" content="contact startupbazzar, support, help, startup marketplace" />
        <meta property="og:title" content="Contact Us | StartupBazzar" />
        <meta property="og:description" content="Get in touch with the StartupBazzar team. We're here to help with buying, selling, or any questions about our startup marketplace." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.startupbazzar.com/contact" />
        <meta property="og:image" content="https://www.startupbazzar.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | StartupBazzar" />
        <meta name="twitter:description" content="Get in touch with the StartupBazzar team. We're here to help with buying, selling, or any questions about our startup marketplace." />
        <meta name="twitter:image" content="https://www.startupbazzar.com/images/twitter-card.jpg" />
      </Helmet>
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Contact StartupBazzar</h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We're here to help!
          </p>
        </div>

        <Card className="hover:shadow-lg transition-all duration-300 max-w-md mx-auto">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email Us</CardTitle>
            <CardDescription>Get in touch via email</CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="mailto:capaitalexchangehelp@gmail.com"
              className="text-primary hover:underline text-lg"
            >
              capaitalexchangehelp@gmail.com
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Contact; 