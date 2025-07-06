#!/bin/bash

echo "🚀 Starting Production Deployment for StartupBazzar Payment System"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "📝 Please copy .env.production.example to .env.production and fill in your values"
    exit 1
fi

echo "✅ Environment file found"

# Build the application
echo "🔨 Building application for production..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy Supabase Edge Functions
echo "🚀 Deploying Supabase Edge Functions..."
npx supabase functions deploy create-order

if [ $? -ne 0 ]; then
    echo "❌ Edge Function deployment failed!"
    echo "💡 Make sure you're logged into Supabase CLI and have the correct project selected"
    exit 1
fi

echo "✅ Edge Functions deployed successfully"

# Deploy payment webhook function
echo "🚀 Deploying payment webhook function..."
npx supabase functions deploy payment-webhook

if [ $? -ne 0 ]; then
    echo "⚠️  Payment webhook deployment failed, but continuing..."
fi

echo "✅ Payment webhook deployed successfully"

echo "🎉 Production deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production environment variables in Supabase dashboard"
echo "2. Configure your domain in Cashfree dashboard"
echo "3. Test the payment flow in production"
echo "4. Set up SSL certificates for your domain"
echo ""
echo "🔧 Environment variables to set in Supabase dashboard:"
echo "   - CASHFREE_CLIENT_ID"
echo "   - CASHFREE_CLIENT_SECRET"
echo "   - CASHFREE_ENVIRONMENT=production"
echo "   - SITE_URL=https://yourdomain.com" 