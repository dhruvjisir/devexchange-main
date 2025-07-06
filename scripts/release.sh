#!/bin/bash

# StartupBazzar Production Release Script
# This script automates the production deployment process

set -e  # Exit on any error

echo "🚀 Starting StartupBazzar Production Release..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please create it with production environment variables."
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Please install it: npm install -g supabase"
    exit 1
fi

print_status "Starting production build process..."

# Step 1: Clean previous builds
print_status "Cleaning previous builds..."
npm run clean

# Step 2: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 3: Type checking
print_status "Running type checks..."
npm run type-check

# Step 4: Linting
print_status "Running linting..."
npm run lint

# Step 5: Build for production
print_status "Building for production..."
npm run build:prod

# Step 6: Deploy Edge Functions
print_status "Deploying Supabase Edge Functions..."
supabase functions deploy

# Step 7: Verify build
print_status "Verifying production build..."
if [ -d "dist" ]; then
    print_status "Build successful! Production files are in the 'dist' directory."
else
    print_error "Build failed! 'dist' directory not found."
    exit 1
fi

# Step 8: Display deployment information
print_status "Production release completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Upload the 'dist' folder to your hosting provider"
echo "2. Configure your domain to point to the new deployment"
echo "3. Set up SSL certificates if not already configured"
echo "4. Test the payment flow with real credentials"
echo "5. Monitor Edge Function logs in Supabase dashboard"
echo ""
echo "🔗 Useful URLs:"
echo "- Supabase Dashboard: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_ID"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- GitHub Repository: https://github.com/yourusername/startupbazzar"
echo ""
echo "⚠️  Important reminders:"
echo "- Verify all environment variables are set correctly"
echo "- Test payment flow in production"
echo "- Monitor error logs and performance"
echo "- Keep database backups"

print_status "Release script completed! 🎉" 