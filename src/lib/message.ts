import { supabase } from './supabase';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  project_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const messageService = {
  async sendMessage(receiverId: string, projectId: string, content: string): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to send messages');
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        project_id: projectId,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Message send error:', error);
      throw new Error('Failed to send message');
    }

    return message;
  },

  async getProjectMessages(projectId: string): Promise<Message[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to view messages');
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          email,
          user_metadata
        ),
        receiver:receiver_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Message fetch error:', error);
      throw new Error('Failed to fetch messages');
    }

    return messages || [];
  },

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Message update error:', error);
      throw new Error('Failed to mark message as read');
    }
  },

  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to view unread count');
    }

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Unread count error:', error);
      throw new Error('Failed to get unread count');
    }

    return count || 0;
  }
}; 