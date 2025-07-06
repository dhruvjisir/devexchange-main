import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/store/projects';
import { Messages } from '@/components/Messages';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { debugProjectLoading } from '@/lib/debug-project';
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

const ProjectMessages = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, error, refetch } = useProject(projectId || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const forceRefresh = async () => {
    if (projectId) {
      // Invalidate the specific project query
      await queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      // Force refetch
      await refetch();
    }
  };

  // Log errors for debugging
  useEffect(() => {
    if (error && projectId) {
      console.error('ProjectMessages error:', error);
      // Run debug function to help identify the issue
      debugProjectLoading(projectId);
    }
  }, [error, projectId]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading project messages...</p>
      </div>
    );
  }

  if (error) {
    console.error('ProjectMessages render error:', error);
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error loading project messages.</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/explore')}
          >
            Back to Explore
          </Button>
          <Button 
            variant="secondary" 
            onClick={forceRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {projectId && (
            <Button 
              variant="secondary" 
              onClick={() => debugProjectLoading(projectId)}
            >
              Debug
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Project not found.</p>
        <div className="flex gap-2 justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/explore')}
          >
            Back to Explore
          </Button>
          <Button 
            variant="secondary" 
            onClick={forceRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          Messages for {project.title}
        </h1>
      </div>

      <div className="bg-card rounded-lg border h-[600px]">
        <Messages />
      </div>
    </div>
  );
};

export default ProjectMessages; 