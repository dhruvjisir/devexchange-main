import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t mt-16 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="font-mono font-bold text-lg">StartupBazzar</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-md">
              The marketplace for developers to buy and sell startups and SaaS.
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-semibold text-base sm:text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/explore" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Explore</Link></li>
              <li><Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Sell</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Subscription</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Blog</Link></li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold text-base sm:text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Contact</Link></li>
              <li><a href="https://dhruv.startupbazzar.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Founder & CEO</a></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} StartupBazzar. All rights reserved.
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
