import { useState } from 'react';
import { DebugPanel } from '@/components/DebugPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { debugProjectLoading } from '@/lib/debug-project';
import { toast } from '@/components/ui/use-toast';
import { getProject } from '@/store/projects';

export default function DebugPage() {
  const [projectId, setProjectId] = useState('8a956219-a684-484d-8681-6311d60183cc');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testProjectId, setTestProjectId] = useState('');

  const testSpecificProject = async () => {
    setLoading(true);
    try {
      const result = await debugProjectLoading(projectId);
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testProjectHook = async () => {
    if (!testProjectId) {
      toast({
        title: "Error",
        description: "Please enter a project ID to test",
        variant: "destructive",
      });
      return;
    }

    console.log('🧪 Testing useProject hook with ID:', testProjectId);
    
    try {
      // Test the direct getProject function
      const project = await getProject(testProjectId);
      console.log('✅ getProject result:', project);
      
      toast({
        title: "Success",
        description: `Project "${project.title}" loaded successfully!`,
      });
    } catch (error) {
      console.error('❌ getProject error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Debug Tools</h1>
        
        {/* Specific Project Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Specific Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Enter project ID"
                />
              </div>
              <Button onClick={testSpecificProject} disabled={loading}>
                {loading ? "Testing..." : "Test Project"}
              </Button>
              {results && (
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Project Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testProjectId">Project ID</Label>
                <Input
                  id="testProjectId"
                  value={testProjectId}
                  onChange={(e) => setTestProjectId(e.target.value)}
                  placeholder="Enter project ID to test hook"
                />
              </div>
              <Button onClick={testProjectHook}>
                Test Project Hook
              </Button>
              <p className="text-sm text-muted-foreground">
                This tests the getProject function directly to verify the database query works.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* General Debug Panel */}
        <DebugPanel />
      </div>
    </div>
  );
} 