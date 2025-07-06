import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const body = await req.json()
    console.log('Payment webhook received:', body)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract payment information
    const { order_id, payment_id, payment_status, amount } = body

    if (!order_id || !payment_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate webhook signature (implement based on your payment provider documentation)
    // For now, we'll process the webhook without signature validation

    // Update order status based on payment status
    let orderStatus = 'pending'
    if (payment_status === 'SUCCESS' || payment_status === 'COMPLETED') {
      orderStatus = 'completed'
    } else if (payment_status === 'FAILED' || payment_status === 'CANCELLED') {
      orderStatus = 'failed'
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: orderStatus,
        payment_id: payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If payment was successful, create or update subscription
    if (orderStatus === 'completed') {
      // Get order details to find user and plan information
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('user_id, amount')
        .eq('id', order_id)
        .single()

      if (!orderError && orderData) {
        // Create subscription (you may need to determine the plan based on amount)
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: orderData.user_id,
            plan: 'basic', // Determine plan based on amount or other criteria
            status: 'active',
            price: orderData.amount,
            currency: 'INR',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          })

        if (subscriptionError) {
          console.error('Error creating subscription:', subscriptionError)
        }
      }
    }

    console.log('Webhook processed successfully')
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 