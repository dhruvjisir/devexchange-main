import { createOrder, verifyPayment } from './payment'

export async function handleRequest(req: Request) {
  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname

  if (path === '/api/payment/create-order' && req.method === 'POST') {
    return createOrder(req)
  }

  if (path === '/api/payment/verify' && req.method === 'POST') {
    return verifyPayment(req)
  }

  if (path === '/api/create-session' && req.method === 'POST') {
    // Call Supabase Edge Function to create order
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'your-anon-key';
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
        customerId: 'test-user-123',
        plan: 'basic',
        currency: 'INR'
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: 'Failed to create order', details: errorText }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const data = await response.json();
    return new Response(JSON.stringify({ paymentSessionId: data.payment_session_id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Not found', { status: 404 })
} 