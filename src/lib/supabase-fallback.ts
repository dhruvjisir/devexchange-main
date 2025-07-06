import { createClient } from '@supabase/supabase-js';

// Fallback Supabase client with different CORS settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client with minimal configuration
export const supabaseFallback = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Alternative client with different fetch configuration
export const supabaseAlternative = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options: RequestInit = {}) => {
      return fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          ...(options.headers as Record<string, string>),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
    }
  }
});

// Simple subscription check function that handles CORS errors
export async function checkSubscriptionFallback(userId: string) {
  try {
    // Try the main client first
    const { data, error } = await supabaseFallback
      .from('subscriptions')
      .select('id, user_id, plan, status, end_date')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.log('Main client failed, trying alternative...');
      
      // Try alternative client
      const { data: altData, error: altError } = await supabaseAlternative
        .from('subscriptions')
        .select('id, user_id, plan, status, end_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (altError) {
        console.log('Alternative client also failed:', altError.message);
        return { hasActiveSubscription: false, subscription: null };
      }

      return { hasActiveSubscription: true, subscription: altData };
    }

    return { hasActiveSubscription: true, subscription: data };
  } catch (error) {
    console.error('Fallback subscription check failed:', error);
    return { hasActiveSubscription: false, subscription: null };
  }
} 