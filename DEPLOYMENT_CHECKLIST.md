# 🚀 Production Deployment Checklist

Use this checklist to ensure your payment system is ready for production deployment.

## ✅ Pre-Deployment Checklist

### Environment Setup
- [ ] `.env.production` file created with real values
- [ ] Production Supabase project configured
- [ ] Production Cashfree account activated
- [ ] Domain with SSL certificate ready

### Cashfree Configuration
- [ ] Production Client ID obtained
- [ ] Production Client Secret obtained
- [ ] Webhook URL configured: `https://your-project.supabase.co/functions/v1/payment-webhook`
- [ ] Return URL configured: `https://yourdomain.com/payment/success`
- [ ] Test payments completed in Cashfree dashboard

### Supabase Configuration
- [ ] Edge Function environment variables set:
  - [ ] `CASHFREE_CLIENT_ID`
  - [ ] `CASHFREE_CLIENT_SECRET`
  - [ ] `CASHFREE_ENVIRONMENT=production`
  - [ ] `SITE_URL=https://yourdomain.com`
- [ ] Database tables created and migrated
- [ ] RLS policies configured

### Application Configuration
- [ ] Production build tested locally
- [ ] All environment variables validated
- [ ] Payment flow tested in development
- [ ] Error handling verified

## 🚀 Deployment Steps

### 1. Deploy Edge Functions
```bash
# Windows
scripts\deploy-production.bat

# Linux/Mac
./scripts/deploy-production.sh
```

### 2. Deploy Application
```bash
npm run build:prod
# Deploy dist/ folder to your hosting provider
```

### 3. Configure Domain
- [ ] DNS records updated
- [ ] SSL certificate installed
- [ ] CORS configured if needed

## 🧪 Post-Deployment Testing

### Payment Flow Test
- [ ] Navigate to pricing page
- [ ] Select a plan
- [ ] Complete test payment
- [ ] Verify success page loads
- [ ] Check order status in database
- [ ] Verify webhook received

### Error Handling Test
- [ ] Test with invalid payment data
- [ ] Test network failures
- [ ] Test authentication errors
- [ ] Verify error messages display correctly

### Security Test
- [ ] Verify HTTPS is enforced
- [ ] Check API keys are not exposed
- [ ] Test authentication requirements
- [ ] Verify CORS settings

## 📊 Monitoring Setup

### Supabase Monitoring
- [ ] Edge Function logs enabled
- [ ] Database monitoring configured
- [ ] Error alerts set up

### Cashfree Monitoring
- [ ] Webhook logs monitored
- [ ] Transaction dashboard accessible
- [ ] Payment failure alerts configured

### Application Monitoring
- [ ] Error tracking service configured
- [ ] Performance monitoring enabled
- [ ] User analytics set up

## 🔧 Troubleshooting Guide

### Common Issues

**406 Error (Edge Function)**
- Check if function is deployed
- Verify environment variables
- Check function logs in Supabase dashboard

**CORS Errors**
- Verify domain configuration
- Check hosting provider CORS settings
- Test with different browsers

**Payment Stuck**
- Check return URL configuration
- Verify Cashfree dashboard settings
- Test with different payment methods

**Webhook Not Working**
- Verify webhook URL is correct
- Check webhook authentication
- Monitor webhook logs in Cashfree dashboard

### Debug Commands
```bash
# Check Edge Function status
npx supabase functions list

# View function logs
npx supabase functions logs create-order

# Test function locally
npx supabase functions serve create-order
```

## 📞 Support Contacts

- **Cashfree Support**: support.cashfree.com
- **Supabase Support**: supabase.com/support
- **Your Hosting Provider**: [Provider-specific support]

## 🔐 Security Reminders

- [ ] Never commit `.env.production` to git
- [ ] Regularly rotate API keys
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Implement rate limiting if needed

---

**🎉 If all items are checked, your payment system is ready for production!** 