import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Rocket, Zap, Star, Code2, Coffee } from "lucide-react";

const Analytics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-4 animate-fade-in-up">Trust yourself</h1>
            <p className="text-center text-muted-foreground animate-fade-in-up animation-delay-200">just kidding coming soon</p>
            
            <div className="mt-8 space-y-4 animate-fade-in-up animation-delay-400">
              <div className="flex items-center justify-center gap-2">
                <Rocket className="h-5 w-5 text-blue-500 animate-bounce" />
                <span className="text-sm text-muted-foreground">Loading awesome features...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Preparing magic...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-purple-500 animate-spin" />
                <span className="text-sm text-muted-foreground">Almost there...</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg animate-fade-in-up animation-delay-600">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Code2 className="h-6 w-6 text-primary animate-pulse" />
                <Coffee className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Our developers are working hard with coffee and code! 
                <br />
                New features coming soon...
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics; 