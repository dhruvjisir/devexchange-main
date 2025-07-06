# Supabase Deployment Guide

## Overview

This guide will help you deploy the capaitalexchange application to Supabase.

## Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Environment Variables

Set the following environment variables in your Supabase project dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add the following secrets:

```env
VITE_APP_URL=http://capaitalexchange.com
```

## Deploy Edge Functions

Deploy all functions at once:
```bash
supabase functions deploy
```

## Test Functions Locally

1. Start Supabase locally:
```bash
supabase start
```

## Production Deployment

1. Deploy to production:
```bash
supabase functions deploy --project-ref YOUR_PROJECT_REF
```

2. Update your frontend environment variables to use the production Supabase URL:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## Function URLs

After deployment, your functions will be available at:
- `https://your-project-ref.supabase.co/functions/v1/`

## Common Issues

1. **Function not deployed**: Run `supabase functions deploy`
2. **Environment variables missing**: Set them in Supabase Dashboard
3. **Authentication issues**: Ensure user is logged in
4. **CORS issues**: Already fixed in the Edge Function code

## Testing

Use the test scripts in the `scripts/` directory to verify the deployment.

## Support

If you encounter issues:
1. Check Supabase Edge Function logs
2. Verify environment variables
3. Contact support with error details 