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

        {/* Contact Policy Section */}
        <div className="mb-10 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-sm text-gray-500 mb-4">Last updated on 07-07-2025 18:46:56</p>
          <ul className="text-left text-base space-y-2">
            <li><strong>Merchant Legal entity name:</strong> OM PRAKASH RAJORA</li>
            <li><strong>Registered Address:</strong> Jail road, tonk, Rajasthan, PIN: 304001</li>
            <li><strong>Operational Address:</strong> Jail road, tonk, Rajasthan, PIN: 304001</li>
            <li><strong>Telephone No:</strong> 9460411413</li>
            <li><strong>E-Mail ID:</strong></li>
          </ul>
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
            {/* Email removed as per request */}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Contact; 