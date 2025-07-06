import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { debugProjectLoading, listAllProjects } from '@/lib/debug-project';
import { checkAllProjects, findProjectById, checkDatabaseTables } from '@/lib/check-projects';
import { supabase } from '@/lib/supabase';

export const DebugPanel = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .limit(1);
      
      setResults({
        success: !error,
        data: data,
        error: error
      });
    } catch (err) {
      setResults({
        success: false,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const testProjectFetch = async () => {
    setLoading(true);
    try {
      // Get the first project ID
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .limit(1);
      
      if (projects && projects.length > 0) {
        const result = await debugProjectLoading(projects[0].id);
        setResults(result);
      } else {
        setResults({
          success: false,
          error: 'No projects found in database'
        });
      }
    } catch (err) {
      setResults({
        success: false,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const listProjects = async () => {
    setLoading(true);
    try {
      const projects = await listAllProjects();
      setResults({
        success: true,
        data: projects
      });
    } catch (err) {
      setResults({
        success: false,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAllProjectsInDB = async () => {
    setLoading(true);
    try {
      const result = await checkAllProjects();
      setResults(result);
    } catch (err) {
      setResults({
        success: false,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSpecificProject = async () => {
    setLoading(true);
    try {
      const result = await findProjectById('8a956219-a684-484d-8681-6311d60183cc');
      setResults(result);
    } catch (err) {
      setResults({
        success: false,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const checkTables = async () => {
    setLoading(true);
    try {
      const result = await checkDatabaseTables();
      setResults(result);
    } catch (err) {
      setResults({
        success: false,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={testConnection} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            Test Connection
          </Button>
          <Button 
            onClick={testProjectFetch} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            Test Project Fetch
          </Button>
          <Button 
            onClick={listProjects} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            List Projects
          </Button>
          <Button 
            onClick={checkAllProjectsInDB} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            Check All Projects
          </Button>
          <Button 
            onClick={checkSpecificProject} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            Check Specific Project
          </Button>
          <Button 
            onClick={checkTables} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            Check Tables
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <p>Loading...</p>
          </div>
        )}

        {results && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Results:</h3>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 