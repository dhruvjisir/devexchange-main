import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet-async';

const Dhruv = () => {
  return (
    <>
      <Helmet>
        <title>Dhruv | CEO & Founder of StartupBazaar</title>
        <meta name="description" content="Portfolio of Dhruv, CEO & Founder of StartupBazaar. Dreamer, creator, and builder on a mission to turn bold ideas into reality." />
        <meta property="og:title" content="Dhruv | CEO & Founder of StartupBazaar" />
        <meta property="og:description" content="Portfolio of Dhruv, CEO & Founder of StartupBazaar. Dreamer, creator, and builder on a mission to turn bold ideas into reality." />
      </Helmet>
      <div className="max-w-3xl mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Hi, I'm Dhruv</h1>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-muted-foreground">CEO & Founder of StartupBazaar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm a dreamer, a creator, and a builder—on a mission to turn bold ideas into reality. Whether it's launching startups, designing digital experiences, or crafting stories through video—I'm all in.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🚀 StartupBazaar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              I'm the founder of <span className="font-semibold">StartupBazaar</span>, a platform where people can buy and sell startups with ease. We're making the startup ecosystem more transparent, accessible, and realistic for everyday builders—not just venture-backed founders.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
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

        <Card className="mb-8">
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

        <Card className="mb-8">
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

        <Card>
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
      </div>
    </>
  );
};

export default Dhruv; 