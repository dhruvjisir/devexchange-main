import { createClient } from '@supabase/supabase-js';
// import { sendVerificationEmail } from './email-service'; // No longer needed

// Use Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('DEBUG: VITE_SUPABASE_URL =', supabaseUrl); // Debug log

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  alert('VITE_SUPABASE_URL is missing or invalid: ' + supabaseUrl);
  throw new Error('Missing or invalid Supabase URL');
}

if (!supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseAnonKey ? 'set' : 'missing'
  });
  throw new Error('Missing Supabase environment variables');
}

// Log the Supabase URL (without the key) for debugging
console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: (url, options = {}) => {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    }
  }
});

// Auth helpers
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken: null,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email_confirmed: false
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return { error };
    }

    // No custom verification email logic
    return { data, error: null };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: null
      }
    });

    if (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
    return { user, error: null };
  } catch (error: any) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
}; 