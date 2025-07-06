#!/bin/bash

echo "🚀 DevExchange Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
    echo ""
    echo "🎯 Next Steps:"
    echo ""
    echo "1. BACKEND DEPLOYMENT (Render/Railway):"
    echo "   - Go to https://render.com or https://railway.app"
    echo "   - Create new Web Service/Project"
    echo "   - Connect your GitHub repo"
    echo "   - Set root directory to 'server'"
    echo "   - Add environment variables:"
    echo "     VITE_SUPABASE_URL=your_supabase_url"
    echo "     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo "     CASHFREE_CLIENT_ID=your_cashfree_client_id"
    echo "     CASHFREE_CLIENT_SECRET=your_cashfree_client_secret"
    echo "     CASHFREE_ENV=PRODUCTION"
    echo ""
    echo "2. FRONTEND DEPLOYMENT (Netlify):"
    echo "   - Go to https://netlify.com"
    echo "   - Drag & drop the 'dist' folder OR connect GitHub"
    echo "   - Add environment variables:"
    echo "     VITE_SUPABASE_URL=your_supabase_url"
    echo "     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "     VITE_BACKEND_URL=https://your-backend-url.onrender.com"
    echo ""
    echo "3. UPDATE CORS:"
    echo "   - Update server/simple-server.cjs to include your Netlify domain"
    echo ""
    echo "📁 Your dist folder is ready for deployment!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi 