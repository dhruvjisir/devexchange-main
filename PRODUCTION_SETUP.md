# Production Setup Guide

## Overview

This guide will help you set up the StartupBazzar application for production deployment.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Vercel account (for deployment)

## Environment Setup

### 1. Environment Variables

Create a `.env.production` file with the following variables:

```env
# Supabase (Production)
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Application
VITE_APP_URL=https://startupbazzar.com
NODE_ENV=production

# Supabase Edge Functions (Set in Supabase Dashboard)
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_URL=https://startupbazzar.com
```

### 2. Supabase Edge Functions Setup

#### Deploy Edge Functions
1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login and link your project:
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

3. Set environment variables in Supabase Dashboard:
   - Go to Settings > Edge Functions
   - Add the following secrets:
     - `SITE_URL`

4. Deploy functions:
```bash
supabase functions deploy
```

### 3. Production Build

#### Build Commands
```bash
# Clean and build for production
npm run deploy:build

# Or step by step:
npm run clean
npm run build:prod
```

#### Build Verification
```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Preview production build
npm run preview:prod
```

### 4. Deployment Options

#### Option A: Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with build command: `npm run build:prod`
4. Set output directory to `dist`

#### Option B: Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build:prod`
3. Set publish directory to `dist`
4. Configure environment variables

#### Option C: Traditional VPS
1. Upload built files to your server
2. Configure nginx/Apache to serve static files
3. Set up SSL certificates
4. Configure environment variables

### 5. Security Checklist

#### ✅ Environment Variables
- [ ] All sensitive data is in environment variables
- [ ] No hardcoded API keys in source code
- [ ] Production credentials are different from development

#### ✅ CORS Configuration
- [ ] Edge Functions have proper CORS headers
- [ ] Only allow your domain: `https://startupbazzar.com`

#### ✅ SSL/TLS
- [ ] HTTPS is enabled
- [ ] SSL certificates are valid
- [ ] HTTP to HTTPS redirect is configured

### 6. Performance Optimization

#### Build Optimizations
- [ ] Code splitting is enabled
- [ ] Assets are compressed (gzip/brotli)
- [ ] Images are optimized
- [ ] Bundle size is reasonable

#### Runtime Optimizations
- [ ] CDN is configured for static assets
- [ ] Caching headers are set
- [ ] Database queries are optimized

### 7. Monitoring & Analytics

#### Error Tracking
- Set up error monitoring (Sentry, LogRocket, etc.)
- Monitor Edge Function logs in Supabase dashboard

#### Analytics
- Configure Google Analytics
- Set up conversion tracking

### 8. Testing Checklist

#### Pre-Deployment Testing
- [ ] User authentication works
- [ ] All features are functional
- [ ] Mobile responsiveness is good
- [ ] Performance is acceptable

#### Post-Deployment Testing
- [ ] Error pages are working
- [ ] SEO meta tags are correct

### 9. Rollback Plan

#### Emergency Rollback
1. Keep previous version ready
2. Have database backup strategy
3. Document rollback procedures

### 10. Maintenance

#### Regular Tasks
- [ ] Monitor error logs
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review security settings

## 🚨 Important Notes

1. **Never commit production credentials** to version control
2. **Monitor** Edge Function logs for errors
3. **Keep backups** of your database
4. **Document** any custom configurations

## 📞 Support

If you encounter issues:
1. Check Supabase Edge Function logs
2. Verify environment variables
3. Contact support with error details 