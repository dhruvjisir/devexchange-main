@echo off
REM StartupBazzar Production Release Script for Windows
REM This script automates the production deployment process

echo 🚀 Starting StartupBazzar Production Release...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Check if .env.production exists
if not exist ".env.production" (
    echo [ERROR] .env.production file not found. Please create it with production environment variables.
    exit /b 1
)

REM Check if Supabase CLI is installed
supabase --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Supabase CLI not found. Please install it: npm install -g supabase
    exit /b 1
)

echo [INFO] Starting production build process...

REM Step 1: Clean previous builds
echo [INFO] Cleaning previous builds...
call npm run clean

REM Step 2: Install dependencies
echo [INFO] Installing dependencies...
call npm install

REM Step 3: Type checking
echo [INFO] Running type checks...
call npm run type-check

REM Step 4: Linting
echo [INFO] Running linting...
call npm run lint

REM Step 5: Build for production
echo [INFO] Building for production...
call npm run build:prod

REM Step 6: Deploy Edge Functions
echo [INFO] Deploying Supabase Edge Functions...
call supabase functions deploy

REM Step 7: Verify build
echo [INFO] Verifying production build...
if exist "dist" (
    echo [INFO] Build successful! Production files are in the 'dist' directory.
) else (
    echo [ERROR] Build failed! 'dist' directory not found.
    exit /b 1
)

REM Step 8: Display deployment information
echo [INFO] Production release completed successfully!
echo.
echo 📋 Next steps:
echo 1. Upload the 'dist' folder to your hosting provider
echo 2. Configure your domain to point to the new deployment
echo 3. Set up SSL certificates if not already configured
echo 4. Test the payment flow with real credentials
echo 5. Monitor Edge Function logs in Supabase dashboard
echo.
echo 🔗 Useful URLs:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/%SUPABASE_PROJECT_ID%
echo - Vercel Dashboard: https://vercel.com/dashboard
echo - GitHub Repository: https://github.com/yourusername/startupbazzar
echo.
echo ⚠️  Important reminders:
echo - Verify all environment variables are set correctly
echo - Test payment flow in production
echo - Monitor error logs and performance
echo - Keep database backups

echo [INFO] Release script completed! 🎉
pause 