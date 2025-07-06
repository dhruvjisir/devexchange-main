export async function testEdgeFunction() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Testing Edge Function accessibility...');
  console.log('URL:', `${supabaseUrl}/functions/v1/create-order`);
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'X-Client-Info': 'supabase-js/2.0.0',
      },
      body: JSON.stringify({
        orderAmount: 100,
        customerEmail: 'test@example.com',
        customerPhone: '9999999999',
        customerId: 'test-user-id',
        plan: 'basic',
        currency: 'INR'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    return {
      status: response.status,
      ok: response.ok,
      body: responseText
    };
  } catch (error) {
    console.error('Error testing Edge Function:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 