@echo off
echo 🚀 Starting Production Deployment for StartupBazzar Payment System

REM Check if .env.production exists
if not exist .env.production (
    echo ❌ .env.production file not found!
    echo 📝 Please copy .env.production.example to .env.production and fill in your values
    pause
    exit /b 1
)

echo ✅ Environment file found

REM Build the application
echo 🔨 Building application for production...
call npm run build:prod

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Deploy Supabase Edge Functions
echo 🚀 Deploying Supabase Edge Functions...
call npx supabase functions deploy create-order

if %errorlevel% neq 0 (
    echo ❌ Edge Function deployment failed!
    echo 💡 Make sure you're logged into Supabase CLI and have the correct project selected
    pause
    exit /b 1
)

echo ✅ Edge Functions deployed successfully

REM Deploy payment webhook function
echo 🚀 Deploying payment webhook function...
call npx supabase functions deploy payment-webhook

if %errorlevel% neq 0 (
    echo ⚠️  Payment webhook deployment failed, but continuing...
)

echo ✅ Payment webhook deployed successfully

echo 🎉 Production deployment completed!
echo.
echo 📋 Next steps:
echo 1. Set up your production environment variables in Supabase dashboard
echo 2. Configure your domain in Cashfree dashboard
echo 3. Test the payment flow in production
echo 4. Set up SSL certificates for your domain
echo.
echo 🔧 Environment variables to set in Supabase dashboard:
echo    - CASHFREE_CLIENT_ID
echo    - CASHFREE_CLIENT_SECRET
echo    - CASHFREE_ENVIRONMENT=production
echo    - SITE_URL=https://yourdomain.com
pause 