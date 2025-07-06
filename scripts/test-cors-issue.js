// Test script to diagnose CORS issue
// Run this in the browser console

async function testCorsIssue() {
  console.log('🔍 Testing CORS Issue...\n');

  try {
    // Test 1: Basic Supabase connection
    console.log('1. Testing basic Supabase connection...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log('✅ Auth connection successful');
      console.log('   User:', user ? user.id : 'No user');
    }

    // Test 2: Simple query without custom headers
    console.log('\n2. Testing simple query...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (simpleError) {
      console.log('❌ Simple query failed:', simpleError.message);
      console.log('   Code:', simpleError.code);
      console.log('   Details:', simpleError.details);
    } else {
      console.log('✅ Simple query successful');
      console.log('   Data:', simpleData);
    }

    // Test 3: Test with fetch directly
    console.log('\n3. Testing direct fetch...');
    const url = 'https://edripbsktgfvctrwtfny.supabase.co/rest/v1/subscriptions?select=id&limit=1';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcmlwYnNrdGdmdmN0cnd0Zm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODU3NjcsImV4cCI6MjA2MzQ2MTc2N30.lZcArOYzPUFAN0_wCv1kVF38NyzR20tu8bZTt6SThqk',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcmlwYnNrdGdmdmN0cnd0Zm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODU3NjcsImV4cCI6MjA2MzQ2MTc2N30.lZcArOYzPUFAN0_wCv1kVF38NyzR20tu8bZTt6SThqk'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct fetch successful');
      console.log('   Data:', data);
    } else {
      console.log('❌ Direct fetch failed:', response.status, response.statusText);
    }

    // Test 4: Check if user is authenticated
    console.log('\n4. Checking authentication...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else {
      console.log('✅ Session check successful');
      console.log('   Has session:', !!session);
      if (session) {
        console.log('   User ID:', session.user.id);
      }
    }

    // Test 5: Test authenticated query
    if (session) {
      console.log('\n5. Testing authenticated query...');
      const { data: authData, error: authQueryError } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status')
        .eq('user_id', session.user.id);
      
      if (authQueryError) {
        console.log('❌ Authenticated query failed:', authQueryError.message);
        console.log('   Code:', authQueryError.code);
        console.log('   Details:', authQueryError.details);
      } else {
        console.log('✅ Authenticated query successful');
        console.log('   Subscriptions:', authData?.length || 0);
      }
    }

    console.log('\n🎯 CORS test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error type:', error.constructor.name);
    console.error('   Stack:', error.stack);
  }
}

// Run the test
testCorsIssue(); 