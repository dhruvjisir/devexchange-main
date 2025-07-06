// Quick test to verify Supabase connectivity
// Run this in the browser console

console.log('🔍 Quick Supabase Test...\n');

// Test 1: Check if supabase object exists
console.log('1. Checking supabase object...');
if (typeof supabase !== 'undefined') {
  console.log('✅ Supabase object exists');
  console.log('   URL:', supabase.supabaseUrl);
} else {
  console.log('❌ Supabase object not found');
}

// Test 2: Check environment variables
console.log('\n2. Checking environment variables...');
console.log('   VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('   VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

// Test 3: Test basic auth
console.log('\n3. Testing basic auth...');
supabase.auth.getUser().then(({ data, error }) => {
  if (error) {
    console.log('❌ Auth error:', error.message);
  } else {
    console.log('✅ Auth successful');
    console.log('   User:', data.user ? data.user.id : 'No user');
  }
});

// Test 4: Test simple query
console.log('\n4. Testing simple query...');
supabase.from('subscriptions').select('id').limit(1).then(({ data, error }) => {
  if (error) {
    console.log('❌ Query error:', error.message);
    console.log('   Code:', error.code);
  } else {
    console.log('✅ Query successful');
    console.log('   Data:', data);
  }
});

console.log('\n🎯 Quick test initiated. Check console for results.'); 