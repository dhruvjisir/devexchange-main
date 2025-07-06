# 🚀 Production Payment System Setup Guide

This guide will help you set up the Cashfree payment system for production deployment.

## 📋 Prerequisites

1. **Supabase Project** - Your production Supabase project
2. **Cashfree Production Account** - Live Cashfree merchant account
3. **Domain** - Your production domain with SSL certificate
4. **Supabase CLI** - For deploying Edge Functions

## 🔧 Step 1: Environment Configuration

### 1.1 Create Production Environment File

```bash
cp .env.production.example .env.production
```

### 1.2 Fill in Production Values

Edit `.env.production` with your actual production values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Cashfree Production Configuration
VITE_CASHFREE_CLIENT_ID=your_production_client_id
VITE_CASHFREE_CLIENT_SECRET=your_production_client_secret
CASHFREE_ENVIRONMENT=production

# Site Configuration
SITE_URL=https://yourdomain.com
VITE_ENVIRONMENT=production
```

## 🏦 Step 2: Cashfree Production Setup

### 2.1 Get Production Credentials

1. Log into your Cashfree merchant dashboard
2. Go to **Settings > API Keys**
3. Copy your **Production Client ID** and **Client Secret**
4. Note: These are different from sandbox credentials

### 2.2 Configure Webhook URL

In Cashfree dashboard:
1. Go to **Settings > Webhooks**
2. Add webhook URL: `https://your-project.supabase.co/functions/v1/payment-webhook`
3. Select events: `order.payment_success`, `order.payment_failed`

### 2.3 Configure Return URLs

In Cashfree dashboard:
1. Go to **Settings > Return URLs**
2. Add: `https://yourdomain.com/payment/success`

## ☁️ Step 3: Supabase Configuration

### 3.1 Set Environment Variables

In your Supabase dashboard:
1. Go to **Settings > Edge Functions**
2. Add these environment variables:

```env
CASHFREE_CLIENT_ID=your_production_client_id
CASHFREE_CLIENT_SECRET=your_production_client_secret
CASHFREE_ENVIRONMENT=production
SITE_URL=https://yourdomain.com
```

### 3.2 Deploy Edge Functions

Run the deployment script:

**Windows:**
```bash
scripts\deploy-production.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

Or manually:
```bash
npx supabase functions deploy create-order
npx supabase functions deploy payment-webhook
```

## 🌐 Step 4: Domain Configuration

### 4.1 SSL Certificate

Ensure your domain has a valid SSL certificate (HTTPS).

### 4.2 CORS Configuration

If needed, configure CORS in your hosting provider to allow:
- `https://api.cashfree.com`
- `https://your-project.supabase.co`

## 🧪 Step 5: Testing

### 5.1 Test Payment Flow

1. Deploy your application to production
2. Navigate to the pricing page
3. Select a plan and initiate payment
4. Complete test payment with Cashfree test cards
5. Verify webhook receives payment confirmation

### 5.2 Test Cards (Production)

Use Cashfree's production test cards:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`

## 🔍 Step 6: Monitoring

### 6.1 Supabase Logs

Monitor Edge Function logs in Supabase dashboard:
- **Settings > Edge Functions > Logs**

### 6.2 Cashfree Dashboard

Monitor payments in Cashfree merchant dashboard:
- **Transactions > Orders**
- **Settings > Webhooks > Logs**

## 🚨 Troubleshooting

### Common Issues

1. **406 Error**: Edge Function not deployed or environment variables missing
2. **CORS Error**: Check domain configuration
3. **Payment Stuck**: Verify return URL configuration
4. **Webhook Not Working**: Check webhook URL and authentication

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Test Edge Function directly via Supabase dashboard
4. Check Cashfree webhook logs

## 📞 Support

- **Cashfree Support**: [support.cashfree.com](https://support.cashfree.com)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)

## 🔐 Security Notes

1. Never commit `.env.production` to version control
2. Use environment variables for all sensitive data
3. Regularly rotate API keys
4. Monitor for suspicious payment activity
5. Implement proper error handling and logging

---

**🎉 Your payment system is now ready for production!** 