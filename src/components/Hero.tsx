import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ArrowRight, Code, Zap, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import './HeroShimmer.css';

const AnimatedBackground = memo(() => null);

const FeatureCard = memo(({ title, description }: { title: string; description: string }) => (
  <motion.div
    className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors"
    whileHover={{ 
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.3)"
    }}
    transition={{ duration: 0.3 }}
  >
    <motion.span 
      className="bg-white/10 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mb-2"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      ✓
    </motion.span>
    <span className="font-medium text-white">{title}</span>
    <span className="text-xs text-gray-400 mt-1">{description}</span>
  </motion.div>
));

export const Hero = memo(() => {
  const features = [
    {
      title: "No Commission",
      description: "Keep 100% of your sale"
    },
    {
      title: "Developer First",
      description: "Built for tech creators"
    }
  ];

  return (
    <div className="relative overflow-hidden h-screen flex items-center" style={{ background: 'transparent' }}>
      <div className="container relative h-full flex flex-col justify-center">
        <AnimatedBackground />
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-20" style={{height: '60px'}}>
          {/* Remove the curved SVG fade for a cleaner transition */}
          {/* (SVG fade removed) */}
        </div>
        <div className="relative z-30 max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_auto] bg-clip-text text-transparent relative overflow-hidden hero-shimmer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover & Sell<br className="md:hidden" /> Indie Tech Projects
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto mb-12 text-xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The marketplace for developers to buy and sell startups and SaaS. 
            List for a flat $15 fee and connect directly with buyers.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <RainbowButton onClick={() => window.location.href="/sell"} className="font-semibold group btn-primary text-lg px-8 py-6">
                <Rocket className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12" />
                List Your Project
              </RainbowButton>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button asChild variant="outline" size="lg" className="group btn-secondary text-white border-white/20 hover:border-white/50 hover:bg-white/5 text-lg px-8 py-6">
                <Link to="/explore">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
});
