#!/usr/bin/env node

/**
 * Test Subscription Queries
 * 
 * This script tests the subscription queries to ensure they work correctly
 * and don't return 406 errors.
 */

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://edripbsktgfvctrwtfny.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-application-name': 'devexchange',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Profile': 'public'
    }
  }
});

async function testSubscriptionQueries() {
  console.log('🧪 Testing Subscription Queries...\n');

  try {
    // Test 1: Minimal query
    console.log('1. Testing minimal query...');
    const { data: minData, error: minError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (minError) {
      console.log('❌ Minimal query failed:', minError.message);
    } else {
      console.log('✅ Minimal query successful');
    }

    // Test 2: Query with user_id filter
    console.log('\n2. Testing user_id filter...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: userData, error: userError } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status')
        .eq('user_id', user.id);
      
      if (userError) {
        console.log('❌ User query failed:', userError.message);
      } else {
        console.log('✅ User query successful');
        console.log('   Found subscriptions:', userData?.length || 0);
      }
    } else {
      console.log('⚠️ No authenticated user found');
    }

    // Test 3: Exact failing query
    console.log('\n3. Testing exact failing query...');
    if (user) {
      const { data: exactData, error: exactError } = await supabase
        .from('subscriptions')
        .select('id,user_id,plan,status,price,currency,start_date,end_date')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (exactError) {
        console.log('❌ Exact query failed:', exactError.message);
        console.log('   Code:', exactError.code);
        console.log('   Details:', exactError.details);
      } else {
        console.log('✅ Exact query successful');
        console.log('   Active subscriptions:', exactData?.length || 0);
      }
    }

    // Test 4: Test with different select syntax
    console.log('\n4. Testing different select syntax...');
    if (user) {
      const { data: altData, error: altError } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status, price, currency, start_date, end_date')
        .eq('user_id', user.id);
      
      if (altError) {
        console.log('❌ Alternative syntax failed:', altError.message);
      } else {
        console.log('✅ Alternative syntax successful');
      }
    }

    console.log('\n🎯 Test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSubscriptionQueries(); 