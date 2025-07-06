import { supabase } from '@/lib/supabase';

interface SubscriptionDetails {
  type: 'free' | 'basic' | 'premium' | 'buyer_basic' | 'buyer_premium';
  maxListingAmount: number;
}

export const subscriptionService = {
  async getSubscriptionDetails(userId: string): Promise<SubscriptionDetails> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status, end_date, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching subscription:', error);
        return {
          type: 'free',
          maxListingAmount: 10000
        };
      }

      // If no subscription found, return free tier
      if (!data || data.length === 0) {
        return {
          type: 'free',
          maxListingAmount: 10000
        };
      }

      const subscription = data[0];

      // Check if subscription is expired
      const now = new Date();
      const expiresAt = new Date(subscription.end_date);
      const isExpired = now > expiresAt;

      // If expired, return free tier
      if (isExpired) {
        return {
          type: 'free',
          maxListingAmount: 10000
        };
      }

      // Determine max listing amount based on plan
      let maxListingAmount = 10000; // Default to free tier
      switch (subscription.plan) {
        case 'basic':
          maxListingAmount = 100000; // $100,000 limit
          break;
        case 'premium':
          maxListingAmount = 250000; // $250,000 limit
          break;
        case 'buyer_basic':
        case 'buyer_premium':
          maxListingAmount = 0; // Buyer plans don't allow listing projects
          break;
        default:
          maxListingAmount = 10000; // Free tier
      }

      return {
        type: subscription.plan,
        maxListingAmount
      };
    } catch (error) {
      console.error('Error in getSubscriptionDetails:', error);
      return {
        type: 'free',
        maxListingAmount: 10000
      };
    }
  },

  async canListProject(userId: string, price: number): Promise<boolean> {
    try {
      const subscription = await this.getSubscriptionDetails(userId);
      
      // Check limits based on subscription type
      if (price <= 10000) {
        return true; // Free for all under $10k
      } else if (price <= 100000) {
        return subscription.type === 'basic' || subscription.type === 'premium';
      } else if (price <= 250000) {
        return subscription.type === 'premium';
      } else {
        // For price > $250,000, require contact us
        return false;
      }
    } catch (error) {
      console.error('Error in canListProject:', error);
      return false; // Default to false if there's an error
    }
  }
}; 