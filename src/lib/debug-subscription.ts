import { supabase } from './supabase'

export async function debugSubscriptionQuery(userId: string) {
  console.log('Debugging subscription query for user:', userId);
  
  try {
    // Test 1: Basic query without filters
    console.log('Test 1: Basic query');
    const { data: test1, error: error1 } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    console.log('Test 1 result:', { data: test1, error: error1 });

    // Test 2: Query with user filter
    console.log('Test 2: Query with user filter');
    const { data: test2, error: error2 } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);
    
    console.log('Test 2 result:', { data: test2, error: error2 });

    // Test 3: Query with status filter
    console.log('Test 3: Query with status filter');
    const { data: test3, error: error3 } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');
    
    console.log('Test 3 result:', { data: test3, error: error3 });

    // Test 4: Query with both filters
    console.log('Test 4: Query with both filters');
    const { data: test4, error: error4 } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    console.log('Test 4 result:', { data: test4, error: error4 });

    // Test 5: Query with maybeSingle
    console.log('Test 5: Query with maybeSingle');
    const { data: test5, error: error5 } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    console.log('Test 5 result:', { data: test5, error: error5 });

    return {
      test1: { data: test1, error: error1 },
      test2: { data: test2, error: error2 },
      test3: { data: test3, error: error3 },
      test4: { data: test4, error: error4 },
      test5: { data: test5, error: error5 }
    };

  } catch (error) {
    console.error('Debug error:', error);
    return { error };
  }
} 