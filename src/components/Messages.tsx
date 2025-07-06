import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { messageService, Message } from '@/lib/message';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface MessageWithUsers extends Message {
  sender: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
  receiver: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
}

export const Messages = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [messages, setMessages] = useState<MessageWithUsers[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!projectId) return;
      
      try {
        const data = await messageService.getProjectMessages(projectId);
        setMessages(data as MessageWithUsers[]);
        
        // Mark unread messages as read
        data.forEach(message => {
          if (!message.is_read && message.receiver_id === user?.id) {
            messageService.markAsRead(message.id);
          }
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load messages',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [projectId, user?.id, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !projectId) return;

    try {
      const message = await messageService.sendMessage(
        messages[0]?.receiver_id || '', // Get receiver_id from existing messages
        projectId,
        newMessage.trim()
      );
      setMessages(prev => [...prev, message as MessageWithUsers]);
      setNewMessage('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === user?.id;
          const senderName = message.sender.user_metadata.full_name || message.sender.email;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`p-3 max-w-[70%] ${isOwnMessage ? 'bg-primary text-primary-foreground' : ''}`}>
                <div className="text-sm font-semibold mb-1">
                  {senderName}
                </div>
                <div className="text-sm mb-1">{message.content}</div>
                <div className="text-xs opacity-70">
                  {format(new Date(message.created_at), 'PPp')}
                </div>
              </Card>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}; 