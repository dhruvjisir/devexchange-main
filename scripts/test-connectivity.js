// Test Supabase connectivity
// Run this in the browser console

console.log('🔍 Testing Supabase Connectivity...\n');

// Test 1: Check if we can reach Supabase at all
async function testBasicConnectivity() {
  console.log('1. Testing basic connectivity...');
  
  try {
    const response = await fetch('https://edripbsktgfvctrwtfny.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcmlwYnNrdGdmdmN0cnd0Zm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODU3NjcsImV4cCI6MjA2MzQ2MTc2N30.lZcArOYzPUFAN0_wCv1kVF38NyzR20tu8bZTt6SThqk'
      }
    });
    
    if (response.ok) {
      console.log('✅ Basic connectivity successful');
      console.log('   Status:', response.status);
    } else {
      console.log('❌ Basic connectivity failed');
      console.log('   Status:', response.status);
      console.log('   StatusText:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Basic connectivity error:', error.message);
  }
}

// Test 2: Test with different fetch options
async function testFetchOptions() {
  console.log('\n2. Testing different fetch options...');
  
  const options = [
    { mode: 'cors', credentials: 'omit' },
    { mode: 'cors', credentials: 'same-origin' },
    { mode: 'cors', credentials: 'include' },
    { mode: 'no-cors' }
  ];
  
  for (const option of options) {
    try {
      console.log(`   Testing: ${JSON.stringify(option)}`);
      const response = await fetch('https://edripbsktgfvctrwtfny.supabase.co/rest/v1/subscriptions?select=id&limit=1', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcmlwYnNrdGdmdmN0cnd0Zm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODU3NjcsImV4cCI6MjA2MzQ2MTc2N30.lZcArOYzPUFAN0_wCv1kVF38NyzR20tu8bZTt6SThqk'
        },
        ...option
      });
      
      console.log(`   ✅ ${JSON.stringify(option)} - Status: ${response.status}`);
    } catch (error) {
      console.log(`   ❌ ${JSON.stringify(option)} - Error: ${error.message}`);
    }
  }
}

// Test 3: Test Supabase client
async function testSupabaseClient() {
  console.log('\n3. Testing Supabase client...');
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ Supabase client auth error:', error.message);
    } else {
      console.log('✅ Supabase client auth successful');
      console.log('   User:', data.user ? data.user.id : 'No user');
    }
  } catch (error) {
    console.log('❌ Supabase client error:', error.message);
  }
}

// Test 4: Test simple query
async function testSimpleQuery() {
  console.log('\n4. Testing simple query...');
  
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Simple query error:', error.message);
      console.log('   Code:', error.code);
    } else {
      console.log('✅ Simple query successful');
      console.log('   Data:', data);
    }
  } catch (error) {
    console.log('❌ Simple query exception:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testBasicConnectivity();
  await testFetchOptions();
  await testSupabaseClient();
  await testSimpleQuery();
  
  console.log('\n🎯 All tests complete!');
}

runAllTests(); 