import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

export default function PricingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    if (user) {
      checkActiveSubscription()
    }
  }, [user])

  const checkActiveSubscription = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking subscription:', error)
        return
      }

      if (data) {
        // Check if subscription has expired based on end_date
        const now = new Date()
        const endDate = new Date(data.end_date)
        if (now > endDate) {
          // Update the status to expired in the database
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', data.id)

          if (updateError) {
            console.error('Error updating subscription status:', updateError)
          } else {
            setHasActiveSubscription(false)
            setSubscription(null)
            return
          }
        }
        setHasActiveSubscription(true)
        setSubscription(data)
      } else {
        setHasActiveSubscription(false)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Error in checkActiveSubscription:', error)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Basic Plan */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Basic Plan</h2>
          <p className="text-3xl font-bold mb-4">₹38,000<span className="text-lg font-normal">/month</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ List projects up to ₹1,00,000</li>
            <li>✓ Basic analytics</li>
            <li>✓ Email support</li>
          </ul>
          <Button 
            className="w-full"
            onClick={() => window.location.href = '/checkout?plan=basic'}
          >
            Get Started
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Premium Plan</h2>
          <p className="text-3xl font-bold mb-4">₹82,000<span className="text-lg font-normal">/month</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ List projects up to ₹2,50,000</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Priority support</li>
            <li>✓ Custom domain</li>
          </ul>
          <Button 
            className="w-full"
            onClick={() => window.location.href = '/checkout?plan=premium'}
          >
            Get Started
          </Button>
        </div>

        {/* Buyer Basic Plan */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Buyer Basic</h2>
          <p className="text-3xl font-bold mb-4">₹8,200<span className="text-lg font-normal">/year</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ View contact details for projects under ₹1,00,000</li>
            <li>✓ Basic project details</li>
            <li>✓ Email support</li>
          </ul>
          <Button 
            className="w-full"
            onClick={() => window.location.href = '/checkout?plan=buyer_basic'}
          >
            Get Started
          </Button>
        </div>

        {/* Buyer Premium Plan */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Buyer Premium</h2>
          <p className="text-3xl font-bold mb-4">₹49,000<span className="text-lg font-normal">/year</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ View contact details for all projects</li>
            <li>✓ Full project details</li>
            <li>✓ Priority support</li>
            <li>✓ Direct contact</li>
          </ul>
          <Button 
            className="w-full"
            onClick={() => window.location.href = '/checkout?plan=buyer_premium'}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
} 