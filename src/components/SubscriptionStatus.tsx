import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { subscriptionService } from '@/lib/subscription-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Crown, User, Zap } from 'lucide-react'

interface Subscription {
  id: string
  user_id: string
  plan: string
  status: string
  price: number
  currency: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch the user's active subscription
        const details = await subscriptionService.getSubscriptionDetails(user.id)
        if (details.hasActiveSubscription && details.subscription) {
          setSubscription(details.subscription)
        } else {
        setSubscription(null)
        }
      } catch (err) {
        console.error('Error fetching subscription:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user?.id])

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Basic Seller'
      case 'premium':
        return 'Premium Seller'
      case 'buyer_basic':
        return 'Basic Buyer'
      case 'buyer_premium':
        return 'Premium Buyer'
      default:
        return plan
    }
  }

  const getPlanIcon = (plan: string) => {
    if (plan.includes('premium')) {
      return <Crown className="h-4 w-4" />
    }
    return <Zap className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPlanDescription = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'You can list projects up to $100,000.'
      case 'premium':
        return 'You can list projects up to $250,000 and enjoy premium features.'
      case 'buyer_basic':
        return 'You can view contact details for projects under $100,000.'
      case 'buyer_premium':
        return 'You can view contact details for all projects.'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 dark:text-red-400">
            <p className="font-medium">Error loading subscription</p>
            <p className="text-sm mt-1">{error}</p>
            {debugInfo && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs">Debug Info</summary>
                <pre className="text-xs mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
          <CardDescription>
            Manage your subscription and access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No active subscription found
            </p>
            <a href="/pricing" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              View Plans
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  const endDate = new Date(subscription.end_date)
  const isExpired = endDate < new Date()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getPlanIcon(subscription.plan)}
          {getPlanDisplayName(subscription.plan)}
        </CardTitle>
        <CardDescription>
          Subscription details and access information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status</span>
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
        </div>

        <div className="rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-900 dark:text-blue-200 my-2">
          {getPlanDescription(subscription.plan)}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Start Date</span>
          <span className="text-sm">
            {new Date(subscription.start_date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">End Date</span>
          <span className="text-sm flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {endDate.toLocaleDateString()}
          </span>
        </div>

        {isExpired && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your subscription has expired. Renew to continue accessing premium features.
            </p>
          </div>
        )}

        <div className="pt-2">
          <a href="/pricing" className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Manage Subscription
          </a>
        </div>
      </CardContent>
    </Card>
  )
}