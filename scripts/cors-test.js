// Test CORS fix
// Run this in the browser console

console.log('🔍 Testing CORS Fix...\n');

// Test 1: Check if the main Supabase client works now
async function testMainClient() {
  console.log('1. Testing main Supabase client...');
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ Main client auth error:', error.message);
    } else {
      console.log('✅ Main client auth successful');
      console.log('   User:', data.user ? data.user.id : 'No user');
    }
  } catch (error) {
    console.log('❌ Main client error:', error.message);
  }
}

// Test 2: Test simple query with main client
async function testMainQuery() {
  console.log('\n2. Testing main client query...');
  
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Main query error:', error.message);
      console.log('   Code:', error.code);
      
      // If it's a 406 error, that's expected due to schema issues
      if (error.code === '406') {
        console.log('   ✅ 406 error is expected due to schema issues');
      }
    } else {
      console.log('✅ Main query successful');
      console.log('   Data:', data);
    }
  } catch (error) {
    console.log('❌ Main query exception:', error.message);
  }
}

// Test 3: Test direct fetch with correct CORS settings
async function testDirectFetch() {
  console.log('\n3. Testing direct fetch with correct CORS settings...');
  
  try {
    const response = await fetch('https://edripbsktgfvctrwtfny.supabase.co/rest/v1/subscriptions?select=id&limit=1', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcmlwYnNrdGdmdmN0cnd0Zm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODU3NjcsImV4cCI6MjA2MzQ2MTc2N30.lZcArOYzPUFAN0_wCv1kVF38NyzR20tu8bZTt6SThqk'
      },
      mode: 'cors',
      credentials: 'omit' // This should fix the CORS issue
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct fetch successful');
      console.log('   Status:', response.status);
      console.log('   Data:', data);
    } else {
      console.log('❌ Direct fetch failed');
      console.log('   Status:', response.status);
      console.log('   StatusText:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Direct fetch error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testMainClient();
  await testMainQuery();
  await testDirectFetch();
  
  console.log('\n🎯 CORS fix test complete!');
  console.log('\n📋 Summary:');
  console.log('- If no CORS errors: ✅ CORS issue is fixed');
  console.log('- If 406 errors: ✅ Expected due to schema issues');
  console.log('- If other errors: ❌ May need additional fixes');
}

runAllTests(); 