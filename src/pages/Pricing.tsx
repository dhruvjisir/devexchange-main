import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscriptionService } from '../lib/subscription-service'
import { useAuth } from '../hooks/useAuth'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { supabase } from '../lib/supabase'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AuthForm from "@/components/AuthForm";
import { Helmet } from 'react-helmet-async';
import { checkSubscriptionFallback } from '@/lib/supabase-fallback'
import { testEdgeFunction } from '@/lib/test-edge-function'
import { toast } from 'sonner'
import { load as loadCashfree } from '@cashfreepayments/cashfree-js';
import { API_CONFIG, apiCall } from '../config/api';

// Base prices in INR
const BASIC_PRICE_INR = 38000;
const PREMIUM_PRICE_INR = 82000;
const BUYER_BASIC_PRICE_INR = 8200;
const BUYER_PREMIUM_PRICE_INR = 49000;

// Only INR supported
const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee' }
};

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  IN: 'INR',
  // Only INR supported
};

const PriceDisplay = ({ inrAmount }: { inrAmount: number }) => (
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold">₹{inrAmount.toLocaleString('en-IN')}</span>
      <span className="text-muted-foreground">{inrAmount === BUYER_BASIC_PRICE_INR || inrAmount === BUYER_PREMIUM_PRICE_INR ? '/year' : '/month'}</span>
    </div>
    </div>
);

const getPlanDescription = (plan: string) => {
  switch (plan) {
    case 'basic':
      return 'Basic Plan - List projects up to ₹1,00,000'
    case 'premium':
      return 'Pro Plan - List projects up to ₹2,50,000'
    case 'buyer_basic':
      return 'Basic Buyer Plan - View contact details for projects under ₹1,00,000'
    case 'buyer_premium':
      return 'Premium Buyer Plan - View contact details for all projects'
    default:
      return ''
  }
}

const getSuccessMessage = (plan: string) => {
  switch (plan) {
    case 'basic':
      return 'Payment successful! You can now list projects up to ₹1,00,000'
    case 'premium':
      return 'Payment successful! You can now list projects up to ₹2,50,000'
    case 'buyer_basic':
      return 'Payment successful! You can now view contact details for projects under ₹1,00,000'
    case 'buyer_premium':
      return 'Payment successful! You can now view contact details for all projects'
    default:
      return 'Payment successful!'
  }
}

interface Plan {
  name: string
  price: number
  description: string
  features: string[]
  type: 'basic' | 'premium' | 'buyer_basic' | 'buyer_premium' | 'free' | 'contact_us'
}

const plans: Plan[] = [
  {
    type: 'free',
    name: 'Free Plan',
    description: 'List projects up to $10,000 for free',
    price: 0,
    features: [
      'List unlimited projects up to $10,000',
    ]
  },
  {
    type: 'basic',
    name: 'Seller Plan 1',
    description: 'List projects up to $100,000',
    price: 38000,
    features: [
      'List projects up to $100,000',
    ]
  },
  {
    type: 'premium',
    name: 'Seller Plan 2',
    description: 'List projects up to $250,000',
    price: 82000,
    features: [
      'List projects up to $250,000',
    ]
  },
  {
    type: 'contact_us',
    name: 'Extra Plan',
    description: 'For listing projects above $250,000, please contact us for a custom plan.',
    price: -1,
    features: [
      'Custom pricing and features',
      'Dedicated support',
      'Maximum visibility',
      'Tailored solutions'
    ]
  }
]

const buyerPlans: Plan[] = [
  {
    name: 'Buyer Plan 1',
    price: 8200,
    description: 'View contact details for projects under $100,000',
    features: [
      'View contact details for projects under $100,000',
    ],
    type: 'buyer_basic'
  },
  {
    name: 'Buyer Plan 2',
    price: 49000,
    description: 'View contact details for all projects (no price limit)',
    features: [
      'View contact details for all projects',
    ],
    type: 'buyer_premium'
  }
]

interface Subscription {
  id: string
  user_id: string
  plan: 'basic' | 'premium' | 'buyer_basic' | 'buyer_premium'
  status: 'active' | 'cancelled' | 'expired'
  price: number
  currency: string
  start_date: string
  end_date: string
}

// Add a type guard for Subscription
function isSubscription(obj: any): obj is Subscription {
  return (
    obj &&
    typeof obj.id !== 'undefined' &&
    typeof obj.user_id !== 'undefined' &&
    typeof obj.plan !== 'undefined' &&
    typeof obj.status !== 'undefined' &&
    typeof obj.price !== 'undefined' &&
    typeof obj.currency !== 'undefined' &&
    typeof obj.start_date !== 'undefined' &&
    typeof obj.end_date !== 'undefined'
  );
}

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkActiveSubscription()
    }
  }, [user])

  const checkActiveSubscription = async () => {
    try {
      setLoading(true)
      
      // First check if user is authenticated
      if (!user?.id) {
        console.log('No user ID available');
        setHasActiveSubscription(false);
        setSubscription(null);
        return;
      }

      console.log('Checking subscription for user:', user.id);
      
      // Try the main Supabase client first
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan, status, price, currency, start_date, end_date')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      if (error) {
        console.error('Error checking subscription:', error);
        
        // Handle different types of errors
        if (error.code === 'PGRST116') {
          // No rows returned - no active subscription
          console.log('No active subscription found');
          setHasActiveSubscription(false);
          setSubscription(null);
          return;
        }
        
        // Handle CORS/network errors - try fallback
        if (error.message?.includes('NetworkError') || error.message?.includes('CORS') || error.message?.includes('fetch')) {
          console.log('Network/CORS error detected, trying fallback...');
          
          try {
            const fallbackResult = await checkSubscriptionFallback(user.id);
            setHasActiveSubscription(fallbackResult.hasActiveSubscription);
            const sub = fallbackResult.subscription;
            if (isSubscription(sub)) {
              setSubscription(sub);
            } else {
              setSubscription(null);
            }
            return;
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            setHasActiveSubscription(false);
            setSubscription(null);
            return;
          }
        }
        
        // Handle 406 errors (schema issues) - treat as no subscription for now
        if (error.code === '406' || error.message?.includes('406')) {
          console.log('406 error detected - schema issue, treating as no subscription');
          setHasActiveSubscription(false);
          setSubscription(null);
          return;
        }
        
        // For other errors, treat as no subscription
        setHasActiveSubscription(false);
        setSubscription(null);
        return;
      }

      if (data) {
        // Check if subscription has expired based on end_date
        const now = new Date()
        const endDate = new Date(data.end_date)
        if (now > endDate) {
          // Update the status to expired in the database
          try {
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({ status: 'expired' })
              .eq('id', data.id)

            if (updateError) {
              console.error('Error updating subscription status:', updateError)
            }
          } catch (updateError) {
            console.error('Error updating subscription status:', updateError)
          }
          
          setHasActiveSubscription(false)
          setSubscription(null)
          return
        }
        
        console.log('Active subscription found:', data);
        setHasActiveSubscription(true)
        setSubscription(data as Subscription)
      } else {
        console.log('No subscription data returned');
        setHasActiveSubscription(false)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Error in checkActiveSubscription:', error)
      
      // Handle network errors - try fallback
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        console.log('Network error caught, trying fallback...');
        
        try {
          const fallbackResult = await checkSubscriptionFallback(user.id);
          setHasActiveSubscription(fallbackResult.hasActiveSubscription);
          const sub = fallbackResult.subscription;
          if (isSubscription(sub)) {
            setSubscription(sub);
          } else {
            setSubscription(null);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setHasActiveSubscription(false);
          setSubscription(null);
        }
      } else {
        // For other errors, treat as no subscription
        setHasActiveSubscription(false);
        setSubscription(null);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTestEdgeFunction = async () => {
    try {
      console.log('Testing Edge Function...');
      const testResult = await testEdgeFunction();
      console.log('Edge Function test result:', testResult);
      
      if (testResult.error) {
        toast(testResult.error);
        return;
      }
      
      if (!testResult.ok) {
        toast(`Status ${testResult.status}: ${testResult.body}`);
        return;
      }
      
      toast('The Edge Function is working correctly!');
      
    } catch (error) {
      console.error('Edge Function test error:', error);
      toast(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  const handleCashfreePayment = async (plan: Plan) => {
    if (!user) {
      toast('Please log in to purchase a plan.');
      return;
    }
    // Store user and plan info for use after redirect
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('plan_type', plan.type);
    setPaying(plan.type);
    try {
      // 1. Create order on backend
      const data = await apiCall(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        body: JSON.stringify({
          orderAmount: plan.price,
          orderCurrency: 'INR',
          customerDetails: {
            customer_id: user.id,
            customer_phone: user.phone || '9999999999',
            customer_name: (user.user_metadata && user.user_metadata.full_name) || user.email || 'User',
            customer_email: user.email || 'user@example.com',
          },
        }),
      });
      
      if (!data.payment_session_id) {
        toast(data.error || 'Failed to create payment session.');
        setPaying(null);
        return;
      }
      // 2. Load Cashfree SDK
      const cashfree = await loadCashfree({ mode: 'sandbox' });
      // 3. Launch checkout
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_modal',
      });
      // 4. Verify payment
      const verifyData = await apiCall(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT, {
        method: 'POST',
        body: JSON.stringify({ 
          orderId: data.order_id,
          userId: user.id,
          planType: plan.type
        }),
      });
      
      if (verifyData && Array.isArray(verifyData.payments) && verifyData.payments.some((p: any) => p.payment_status === 'SUCCESS')) {
        toast(getSuccessMessage(plan.type));
        checkActiveSubscription();
        // Redirect to payment success page
        window.location.href = `/payment-success?order_id=${data.order_id}`;
      } else {
        toast('Payment not successful. Please try again.');
      }
    } catch (err: any) {
      toast(err.message || 'Payment failed.');
    } finally {
      setPaying(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  if (hasActiveSubscription && subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Active Subscription</AlertTitle>
          <AlertDescription>
            You currently have an active {subscription.plan} subscription that expires on{' '}
            {new Date(subscription.end_date).toLocaleDateString()}. You can manage your subscription in your profile.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Subscription Pricing | capaitalexchange</title>
        <meta name="description" content="Transparent pricing for buying and selling startups and businesses. Choose the best plan for your needs." />
        <link rel="canonical" href="https://www.capaitalexchange.com/pricing" />
        <meta name="keywords" content="pricing, subscription, buy startup, sell startup, SaaS pricing, capaitalexchange" />
        <meta property="og:title" content="Subscription Pricing | Buy & Sell Startups | capaitalexchange" />
        <meta property="og:description" content="See our transparent pricing for buying and selling startups, SaaS, and online businesses. Choose the best plan for your needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.capaitalexchange.com/pricing" />
        <meta property="og:image" content="https://www.capaitalexchange.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subscription Pricing | Buy & Sell Startups | capaitalexchange" />
        <meta name="twitter:description" content="See our transparent pricing for buying and selling startups, SaaS, and online businesses. Choose the best plan for your needs." />
        <meta name="twitter:image" content="https://www.capaitalexchange.com/images/twitter-card.jpg" />
      </Helmet>
    <div className="container mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Subscription Plans & Pricing</h1>
        <blockquote className="text-xl font-semibold text-center text-primary mb-8">BUSINESS MAN RULE NO. XX = NEVER HESITATE IN INVESTING</blockquote>
        
        {/* Debug button for testing Edge Function */}
        <div className="mb-8 text-center">
          <Button 
            variant="outline" 
            onClick={handleTestEdgeFunction}
            className="mb-4"
          >
            Test Edge Function
          </Button>
        </div>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">Seller Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full">
        {plans.map((plan) => (
          <div key={plan.type} className="border rounded-lg p-4 sm:p-6 shadow-sm flex flex-col justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">{plan.name}</h2>
              {plan.price === 0 ? (
                <p className="text-3xl font-bold mb-4 text-center">Free</p>
              ) : plan.price === -1 ? (
                <p className="text-3xl font-bold mb-4 text-center">Contact Us</p>
              ) : (
                <div className="flex justify-center"><PriceDisplay inrAmount={plan.price} /></div>
              )}
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm sm:text-base">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {plan.type === 'free' && (
                <Button className="w-full mb-4" onClick={() => navigate('/sell')}>Get Started</Button>
              )}
              {plan.type === 'contact_us' && (
                <Button className="w-full" variant="outline" onClick={() => window.location.href = 'mailto:support@yourdomain.com'}>Contact Us</Button>
              )}
              {plan.price > 0 && plan.type !== 'contact_us' && (
                <Button className="w-full" onClick={() => handleCashfreePayment(plan)} disabled={paying === plan.type}>
                  {paying === plan.type ? 'Processing...' : 'Pay with Cashfree'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-4 mt-8">Buyer Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {buyerPlans.map((plan) => (
          <div key={plan.type} className="border rounded-lg p-4 sm:p-6 shadow-sm flex flex-col justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">{plan.name}</h2>
              <div className="flex justify-center"><PriceDisplay inrAmount={plan.price} /></div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm sm:text-base">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {plan.price > 0 && (
                <Button className="w-full" onClick={() => handleCashfreePayment(plan)} disabled={paying === plan.type}>
                  {paying === plan.type ? 'Processing...' : 'Pay with Cashfree'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}