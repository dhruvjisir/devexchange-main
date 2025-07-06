# Subscription Logic Implementation

## Overview
This document outlines the subscription logic implemented in the DevExchange platform, including pricing tiers, limits, and access controls.

## Subscription Plans

### Seller Plans (For listing projects)

#### 1. Free Plan
- **Price**: $0
- **Limit**: List projects up to $10,000
- **Features**:
  - List unlimited projects under $10,000
  - Basic project analytics
  - Standard visibility
  - 30 days listing duration
  - Email support

#### 2. Seller Plan 1 (Basic)
- **Price**: $459/month
- **Limit**: List projects up to $100,000
- **Features**:
  - List projects up to $100,000
  - Basic project analytics
  - Standard visibility
  - 30 days listing duration
  - Email support

#### 3. Seller Plan 2 (Premium)
- **Price**: $999/month
- **Limit**: List projects up to $250,000
- **Features**:
  - List projects up to $250,000
  - Advanced project analytics
  - Featured visibility
  - 90 days listing duration
  - Priority email support
  - Custom project page
  - Performance metrics

#### 4. Extra Plan (Contact Us)
- **Price**: Custom pricing
- **Limit**: Projects above $250,000
- **Features**:
  - Custom pricing and features
  - Dedicated support
  - Maximum visibility
  - Tailored solutions

### Buyer Plans (For viewing contact details)

#### 1. Buyer Plan 1 (Basic)
- **Price**: $99/year
- **Access**: View contact details for projects under $100,000
- **Features**:
  - View contact details for projects under $100,000
  - Basic search filters
  - Email support

#### 2. Buyer Plan 2 (Premium)
- **Price**: $599/year
- **Access**: View contact details for all projects (no price limit)
- **Features**:
  - View contact details for all projects
  - Advanced search filters
  - Priority support
  - Direct messaging

## Implementation Details

### Database Schema
- **Table**: `subscriptions`
- **Key Fields**:
  - `plan`: ENUM('basic', 'premium', 'buyer_basic', 'buyer_premium')
  - `status`: ENUM('active', 'cancelled', 'expired')
  - `price`: DECIMAL(10,2) - automatically set based on plan
  - `start_date`: TIMESTAMP
  - `end_date`: TIMESTAMP

### Business Logic

#### Project Listing Validation
```typescript
async canListProject(userId: string, price: number): Promise<boolean | 'contact_us'> {
  // Free tier: up to $10,000
  if (price <= 10000) return true;
  
  // Basic plan: up to $100,000
  if (price <= 100000) return subscription.type === 'basic' || subscription.type === 'premium';
  
  // Premium plan: up to $250,000
  if (price <= 250000) return subscription.type === 'premium';
  
  // Above $250,000: contact us required
  return 'contact_us';
}
```

#### Contact Details Access Validation
```typescript
async canViewContactDetails(userId: string, projectPrice: number): Promise<boolean> {
  switch (subscription.type) {
    case 'buyer_basic':
      return projectPrice < 100000; // Projects under $100K
    case 'buyer_premium':
      return true; // All projects
    default:
      return false; // Seller plans cannot view contacts
  }
}
```

### Key Features

1. **Free Plan by Default**: All users start with a free plan allowing listings up to $10,000
2. **Expired Subscriptions**: Automatically revert to free tier limits
3. **Plan Separation**: Seller and buyer plans are completely separate
4. **Automatic Pricing**: Database triggers automatically set correct prices
5. **Expiration Handling**: Automatic status updates when subscriptions expire

### Files Modified

1. **Database Migration**: `supabase/migrations/20240328000000_create_subscriptions.sql`
   - Updated pricing functions
   - Updated contact access logic

2. **Subscription Service**: `src/lib/subscription-service.ts`
   - Implemented correct limit logic
   - Added free plan handling

3. **Pricing Pages**: 
   - `src/pages/Pricing.tsx` - Updated pricing display
   - `src/pages/PricingPage.tsx` - Updated pricing display

4. **Subscription Status**: `src/components/SubscriptionStatus.tsx`
   - Added plan-specific information display
   - Added contact access information

5. **Server API**: `server/index.js`
   - Added plan validation
   - Updated subscription creation logic

### Usage Examples

#### Checking if user can list a project
```typescript
const canList = await subscriptionService.canListProject(userId, 50000);
// Returns true for basic/premium plans, false for free/buyer plans
```

#### Checking if user can view contact details
```typescript
const canView = await subscriptionService.canViewContactDetails(userId, 75000);
// Returns true for buyer_basic (under $100K), true for buyer_premium (all), false for others
```

#### Getting subscription details
```typescript
const details = await subscriptionService.getSubscriptionDetails(userId);
// Returns plan type, limits, expiration status, etc.
```

## Testing Scenarios

1. **Free User**: Can list projects up to $10,000, cannot view contact details
2. **Basic Seller**: Can list projects up to $100,000, cannot view contact details
3. **Premium Seller**: Can list projects up to $250,000, cannot view contact details
4. **Basic Buyer**: Cannot list projects, can view contacts for projects under $100,000
5. **Premium Buyer**: Cannot list projects, can view contacts for all projects
6. **Expired Subscription**: Reverts to free tier limits
7. **No Subscription**: Treated as free tier

## Security Considerations

1. **Server-side validation**: All limits enforced on server
2. **Database constraints**: Automatic price setting via triggers
3. **RLS Policies**: Row-level security for subscription data
4. **Expiration checks**: Automatic status updates
5. **Plan separation**: Clear separation between seller and buyer functionality 