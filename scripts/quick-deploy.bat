@echo off
echo 🚀 Quick Production Deployment for StartupBazzar
echo ================================================

echo.
echo 📋 Step 1: Environment Setup
echo ----------------------------
if not exist .env.production (
    echo ❌ .env.production not found!
    echo 📝 Please create .env.production with your production values
    echo 💡 Use .env.production.example as a template
    pause
    exit /b 1
) else (
    echo ✅ .env.production found
)

echo.
echo 🔨 Step 2: Building Application
echo ------------------------------
call npm run build:prod
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check your code and try again.
    pause
    exit /b 1
)
echo ✅ Build completed successfully

echo.
echo 🚀 Step 3: Deploying Edge Functions
echo ----------------------------------
echo ⚠️  Make sure you're logged into Supabase CLI
echo 💡 Run: npx supabase login
echo.
pause

echo Deploying create-order function...
call npx supabase functions deploy create-order
if %errorlevel% neq 0 (
    echo ❌ Edge Function deployment failed!
    echo 💡 Check your Supabase CLI login and project selection
    pause
    exit /b 1
)
echo ✅ create-order function deployed

echo Deploying payment-webhook function...
call npx supabase functions deploy payment-webhook
if %errorlevel% neq 0 (
    echo ⚠️  Payment webhook deployment failed, but continuing...
) else (
    echo ✅ payment-webhook function deployed
)

echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Set environment variables in Supabase dashboard
echo 2. Configure your domain in Cashfree dashboard
echo 3. Deploy the dist/ folder to your hosting provider
echo 4. Test the payment flow
echo.
echo 📖 For detailed instructions, see:
echo    - PRODUCTION_PAYMENT_SETUP.md
echo    - DEPLOYMENT_CHECKLIST.md
echo.
pause 