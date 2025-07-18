import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SparklesText } from "@/components/ui/sparkles-text";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, type: 'spring' } })
};

const divider = (
  <div className="flex justify-center my-8">
    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
  </div>
);

const Dhruv = () => {
  return (
    <>
      <Helmet>
        <title>Dhruv | CEO & Founder of StartupBazzar</title>
        <meta name="description" content="Portfolio of Dhruv, CEO & Founder of StartupBazzar. Dreamer, creator, and builder on a mission to turn bold ideas into reality." />
        <meta property="og:title" content="Dhruv | CEO & Founder of StartupBazzar" />
        <meta property="og:description" content="Portfolio of Dhruv, CEO & Founder of StartupBazzar. Dreamer, creator, and builder on a mission to turn bold ideas into reality." />
      </Helmet>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 animate-gradient-move bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-2xl opacity-60" />
      <div className="max-w-3xl mx-auto py-16 px-4 relative">
        {/* Announcement with SparklesText */}
        <div className="mb-10 flex justify-center">
          <SparklesText text="We sold our 1st startup successfully for $27,000!" className="text-3xl sm:text-4xl md:text-5xl text-center" />
        </div>
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-glow">
            Hi, I'm Dhruv
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-muted-foreground animate-fade-in">
            CEO & Founder of StartupBazzar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            I'm a dreamer, a creator, and a builder—on a mission to turn bold ideas into reality. Whether it's launching startups, designing digital experiences, or crafting stories through video—I'm all in.
          </p>
        </motion.div>

        {/* Animated Cards */}
        <motion.div initial="hidden" animate="visible" variants={{}}>
          <motion.div custom={0} variants={sectionVariants} className="mb-8">
            <Card className="shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <CardHeader>
                <CardTitle>🚀 StartupBazzar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  I'm the founder of <span className="font-semibold">StartupBazzar</span>, a platform where people can buy and sell startups with ease. We're making the startup ecosystem more transparent, accessible, and realistic for everyday builders—not just venture-backed founders.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          {divider}
          <motion.div custom={1} variants={sectionVariants} className="mb-8">
            <Card className="shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <CardHeader>
                <CardTitle>🔧 What I Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Build and launch digital products with clarity and speed</li>
                  <li>Explore tech, storytelling, design, and human behavior</li>
                  <li>Shape meaningful experiences through design and content</li>
                  <li>Think long-term while executing short-term with intent</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          {divider}
          <motion.div custom={2} variants={sectionVariants} className="mb-8">
            <Card className="shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <CardHeader>
                <CardTitle>💼 My Journey So Far</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Created multiple passion projects in tech, media, and design</li>
                  <li>Self-taught across fields like product design, video editing, and no-code tools</li>
                  <li>Collaborated with creators and makers to bring ideas to life</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          {divider}
          <motion.div custom={3} variants={sectionVariants} className="mb-8">
            <Card className="shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <CardHeader>
                <CardTitle>🛠️ Tools & Tech I Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                  <div>
                    <span className="font-semibold">Video:</span> Premiere Pro, After Effects, DaVinci Resolve
                  </div>
                  <div>
                    <span className="font-semibold">Web:</span> React, TypeScript, Tailwind, Supabase
                  </div>
                  <div>
                    <span className="font-semibold">Creative:</span> Figma, Canva, Notion
                  </div>
                  <div>
                    <span className="font-semibold">Workflow:</span> ChatGPT, Trello, Framer, Git
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {divider}
          <motion.div custom={4} variants={sectionVariants}>
            <Card className="shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <CardHeader>
                <CardTitle>🌱 I Believe In</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Building things that matter</li>
                  <li>Learning by doing</li>
                  <li>Dreaming beyond limits—and acting on those dreams</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      {/* Custom Animations */}
      <style>{`
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-glow {
          text-shadow: 0 0 16px #a78bfa66, 0 0 32px #f472b666;
          animation: textGlow 2.5s ease-in-out infinite alternate;
        }
        @keyframes textGlow {
          0% { text-shadow: 0 0 16px #a78bfa66, 0 0 32px #f472b666; }
          100% { text-shadow: 0 0 32px #a78bfa, 0 0 64px #f472b6; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Dhruv; 