import { supabase } from './supabase'

export interface Subscription {
  id: string
  user_id: string
  plan: 'basic' | 'premium' | 'buyer_basic' | 'buyer_premium'
  status: 'active' | 'cancelled' | 'expired'
  price: number
  currency: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface SubscriptionDetails {
  hasActiveSubscription: boolean
  subscription?: Subscription
  planDetails?: any
}

class SubscriptionService {
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, status, end_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - no active subscription
          return false;
        }
        console.error('Error checking active subscription:', error);
        return false;
      }

      if (!data) {
        return false;
      }

      // Check if subscription has expired
      const now = new Date();
      const expiresAt = new Date(data.end_date);
      
      if (now > expiresAt) {
        // Update status to expired
        await this.updateSubscriptionStatus(data.id, 'expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in hasActiveSubscription:', error);
      return false;
    }
  }

  async createSubscription(userId: string, planType: 'basic' | 'premium' | 'buyer_basic' | 'buyer_premium', duration: number = 30): Promise<SubscriptionDetails> {
    // Check for existing active subscription
    const hasActive = await this.hasActiveSubscription(userId);
    if (hasActive) {
      throw new Error('User already has an active subscription');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: planType,
        status: 'active',
        start_date: now.toISOString(),
        end_date: expiresAt.toISOString()
      })
      .select();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw subscriptionError;
    }

    return this.getSubscriptionDetails(userId);
  }

  async getSubscriptionDetails(userId: string): Promise<SubscriptionDetails> {
    try {
      // First try to get the most recent active subscription with specific columns
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status, price, currency, start_date, end_date, created_at, updated_at')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching subscription details:', error);
        
        // Handle different types of errors
        if (error.code === '406' || error.message?.includes('406')) {
          console.log('406 error detected, trying fallback...');
          return await this.getSubscriptionDetailsFallback(userId);
        }
        
        // Handle CORS/network errors
        if (error.message?.includes('NetworkError') || error.message?.includes('CORS')) {
          console.log('Network/CORS error detected, trying fallback...');
          return await this.getSubscriptionDetailsFallback(userId);
        }
        
        return { hasActiveSubscription: false };
      }

      if (!subscriptions || subscriptions.length === 0) {
        return { hasActiveSubscription: false };
      }

      const subscription = subscriptions[0];

      // Check if subscription has expired
      const now = new Date();
      const expiresAt = new Date(subscription.end_date);
      
      if (now > expiresAt) {
        // Update status to expired
        await this.updateSubscriptionStatus(subscription.id, 'expired');
        return { hasActiveSubscription: false };
      }

      // Get plan details with specific columns
      const { data: planDetails } = await supabase
        .from('plans')
        .select('id, name, description, price, features')
        .eq('id', subscription.plan);

      return {
        hasActiveSubscription: true,
        subscription,
        planDetails: planDetails?.[0] || null
      };
    } catch (error) {
      console.error('Error in getSubscriptionDetails:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        console.log('Network error caught, returning false');
        return { hasActiveSubscription: false };
      }
      
      return { hasActiveSubscription: false };
    }
  }

  // Fallback method for 406 errors and network issues
  async getSubscriptionDetailsFallback(userId: string): Promise<SubscriptionDetails> {
    try {
      // Try with a simpler query
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status, end_date, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Fallback query also failed:', error);
        return { hasActiveSubscription: false };
      }

      if (!subscriptions || subscriptions.length === 0) {
        return { hasActiveSubscription: false };
      }

      const subscription = subscriptions[0];

      // Check if subscription is active and not expired
      if (subscription.status !== 'active') {
        return { hasActiveSubscription: false };
      }

      const now = new Date();
      const expiresAt = new Date(subscription.end_date);
      
      if (now > expiresAt) {
        // Update status to expired
        await this.updateSubscriptionStatus(subscription.id, 'expired');
        return { hasActiveSubscription: false };
      }

      return {
        hasActiveSubscription: true,
        subscription: subscription as Subscription
      };
    } catch (error) {
      console.error('Error in getSubscriptionDetailsFallback:', error);
      return { hasActiveSubscription: false };
    }
  }

  async canViewContactDetails(userId: string, projectPrice: number): Promise<boolean> {
    try {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('plan, status, end_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(1);

      if (error) {
        console.error('Error checking contact access:', error);
        return false;
      }

      if (!subscriptions || subscriptions.length === 0) {
        return false;
      }

      const subscription = subscriptions[0];

      // Check if subscription is expired
      const now = new Date();
      const expiresAt = new Date(subscription.end_date);
      if (now > expiresAt) {
        return false;
      }

      // Check limits based on subscription type
      switch (subscription.plan) {
        case 'buyer_basic':
          return projectPrice < 100000; // Can view contacts for projects under $100K
        case 'buyer_premium':
          return true; // Can view contacts for all projects
        case 'basic':
        case 'premium':
          return false; // Seller plans cannot view contact details
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking contact access:', error);
      return false;
    }
  }

  async canListProject(userId: string, projectPrice: number): Promise<boolean> {
    try {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('plan, status, end_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(1);

      if (error) {
        console.error('Error checking listing permissions:', error);
        return false;
      }

      // If no subscription, check free plan limits
      if (!subscriptions || subscriptions.length === 0) {
        return projectPrice <= 10000; // Free plan: up to $10K
      }

      const subscription = subscriptions[0];

      // Check if subscription is expired
      const now = new Date();
      const expiresAt = new Date(subscription.end_date);
      if (now > expiresAt) {
        return projectPrice <= 10000; // Expired subscription: free plan limits
      }

      // Check limits based on subscription type
      switch (subscription.plan) {
        case 'basic':
          return projectPrice <= 100000; // Basic plan: up to $100K
        case 'premium':
          return projectPrice <= 250000; // Premium plan: up to $250K
        case 'buyer_basic':
        case 'buyer_premium':
          return false; // Buyer plans cannot list projects
        default:
          return projectPrice <= 10000; // Default to free plan limits
      }
    } catch (error) {
      console.error('Error checking listing permissions:', error);
      return false;
    }
  }

  async updateSubscriptionStatus(subscriptionId: string, status: 'active' | 'cancelled' | 'expired'): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', subscriptionId)

      if (error) {
        console.error('Error updating subscription status:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in updateSubscriptionStatus:', error)
      throw error
    }
  }

  async getPlanDetails(planId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('id, name, description, price, features, duration_days')
        .eq('id', planId);

      if (error) {
        console.error('Error fetching plan details:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getPlanDetails:', error);
      return null;
    }
  }
}

export const subscriptionService = new SubscriptionService(); 