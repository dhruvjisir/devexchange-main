const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
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

async function diagnoseSubscription406() {
  console.log('🔍 Diagnosing Subscription 406 Error...\n');

  try {
    // 1. Check if user is authenticated
    console.log('1. Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Authentication error:', authError.message);
      return;
    }
    
    if (!user) {
      console.log('❌ No authenticated user found');
      return;
    }
    
    console.log('✅ User authenticated:', user.id);
    console.log('   Email:', user.email);

    // 2. Check table schema
    console.log('\n2. Checking subscriptions table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'subscriptions')
      .eq('table_schema', 'public');

    if (schemaError) {
      console.log('❌ Schema query error:', schemaError.message);
    } else {
      console.log('✅ Table schema:');
      schemaData.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
    }

    // 3. Check RLS policies
    console.log('\n3. Checking RLS policies...');
    const { data: policyData, error: policyError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd, qual')
      .eq('tablename', 'subscriptions');

    if (policyError) {
      console.log('❌ Policy query error:', policyError.message);
    } else {
      console.log('✅ RLS policies:');
      policyData.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd}`);
        console.log(`     Condition: ${policy.qual || 'N/A'}`);
      });
    }

    // 4. Test minimal query
    console.log('\n4. Testing minimal query...');
    const { data: minData, error: minError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);

    if (minError) {
      console.log('❌ Minimal query failed:', minError.message);
      console.log('   Code:', minError.code);
      console.log('   Details:', minError.details);
    } else {
      console.log('✅ Minimal query successful');
      console.log('   Found records:', minData?.length || 0);
    }

    // 5. Test query with user_id filter
    console.log('\n5. Testing query with user_id filter...');
    const { data: userData, error: userError } = await supabase
      .from('subscriptions')
      .select('id, user_id, plan, status')
      .eq('user_id', user.id);

    if (userError) {
      console.log('❌ User query failed:', userError.message);
      console.log('   Code:', userError.code);
      console.log('   Details:', userError.details);
    } else {
      console.log('✅ User query successful');
      console.log('   User subscriptions:', userData?.length || 0);
      if (userData && userData.length > 0) {
        console.log('   Sample subscription:', userData[0]);
      }
    }

    // 6. Test the exact failing query
    console.log('\n6. Testing exact failing query...');
    const { data: exactData, error: exactError } = await supabase
      .from('subscriptions')
      .select('id,user_id,plan,status,price,currency,start_date,end_date')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (exactError) {
      console.log('❌ Exact query failed:', exactError.message);
      console.log('   Code:', exactError.code);
      console.log('   Details:', exactError.details);
      console.log('   Hint:', exactError.hint);
    } else {
      console.log('✅ Exact query successful');
      console.log('   Active subscriptions:', exactData?.length || 0);
    }

    // 7. Check if table exists and has data
    console.log('\n7. Checking table existence and data...');
    const { count, error: countError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Count query failed:', countError.message);
    } else {
      console.log('✅ Total subscriptions in table:', count);
    }

    // 8. Test with different Accept headers
    console.log('\n8. Testing with different Accept headers...');
    
    // Test with default Accept header
    const { data: defaultData, error: defaultError } = await supabase
      .from('subscriptions')
      .select('id, user_id, plan, status')
      .eq('user_id', user.id)
      .limit(1);

    console.log('   Default Accept header:', defaultError ? '❌ Failed' : '✅ Success');

    // Test with explicit Accept header
    const supabaseWithAccept = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Accept': 'application/vnd.pgrst.object+json',
          'Accept-Profile': 'public'
        }
      }
    });

    const { data: explicitData, error: explicitError } = await supabaseWithAccept
      .from('subscriptions')
      .select('id, user_id, plan, status')
      .eq('user_id', user.id)
      .limit(1);

    console.log('   Explicit Accept header:', explicitError ? '❌ Failed' : '✅ Success');

    // 9. Check for any triggers or functions that might interfere
    console.log('\n9. Checking triggers and functions...');
    const { data: triggerData, error: triggerError } = await supabase
      .from('pg_trigger')
      .select('tgname, tgrelid::regclass')
      .eq('tgrelid::regclass', 'subscriptions');

    if (triggerError) {
      console.log('❌ Trigger query failed:', triggerError.message);
    } else {
      console.log('✅ Triggers on subscriptions table:');
      triggerData.forEach(trigger => {
        console.log(`   - ${trigger.tgname}`);
      });
    }

    console.log('\n🔍 Diagnosis complete!');
    console.log('\n📋 Summary:');
    console.log('- If minimal query fails: Schema or RLS issue');
    console.log('- If user query fails: RLS policy issue');
    console.log('- If exact query fails: Column or data type issue');
    console.log('- If all queries fail: Table doesn\'t exist or major schema issue');

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  }
}

// Run the diagnosis
diagnoseSubscription406(); 