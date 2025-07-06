import { supabase } from './supabase';

export interface Purchase {
  id: string;
  buyer_id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export const purchaseService = {
  async createPurchase(projectId: string, amount: number): Promise<Purchase> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to make a purchase');
    }

    try {
      // Check if project exists and is available
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, price, user_id')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Project fetch error:', projectError);
        throw new Error('Failed to fetch project details');
      }

      if (!project) {
        throw new Error('Project not found');
      }

      // Prevent self-purchase
      if (project.user_id === user.id) {
        throw new Error('You cannot purchase your own project');
      }

      // Check if user has already purchased this project
      const { data: existingPurchase, error: existingError } = await supabase
        .from('purchases')
        .select('id, status')
        .eq('buyer_id', user.id)
        .eq('project_id', projectId)
        .single();

      if (existingError && existingError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Existing purchase check error:', existingError);
        throw new Error('Failed to check existing purchases');
      }

      if (existingPurchase) {
        if (existingPurchase.status === 'completed') {
          throw new Error('You have already purchased this project');
        } else if (existingPurchase.status === 'pending') {
          throw new Error('You have a pending purchase for this project');
        }
      }

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          buyer_id: user.id,
          project_id: projectId,
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Purchase creation error:', purchaseError);
        throw new Error('Failed to create purchase record');
      }

      if (!purchase) {
        throw new Error('Failed to create purchase record');
      }

      return purchase;
    } catch (error: any) {
      console.error('Purchase creation error:', error);
      throw new Error(error.message || 'Failed to create purchase');
    }
  },

  async completePurchase(purchaseId: string, paymentIntentId: string): Promise<Purchase> {
    try {
      const { data: purchase, error } = await supabase
        .from('purchases')
        .update({
          status: 'completed',
          payment_intent_id: paymentIntentId
        })
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) {
        console.error('Purchase completion error:', error);
        throw new Error('Failed to complete purchase');
      }

      if (!purchase) {
        throw new Error('Purchase not found');
      }

      return purchase;
    } catch (error: any) {
      console.error('Purchase completion error:', error);
      throw new Error(error.message || 'Failed to complete purchase');
    }
  },

  async getUserPurchases(): Promise<Purchase[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to view purchases');
      }

      const { data: purchases, error } = await supabase
        .from('purchases')
        .select(`
          *,
          project:projects (
            id,
            title,
            description
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch purchases error:', error);
        throw new Error('Failed to fetch purchases');
      }

      return purchases || [];
    } catch (error: any) {
      console.error('Fetch purchases error:', error);
      throw new Error(error.message || 'Failed to fetch purchases');
    }
  }
}; 