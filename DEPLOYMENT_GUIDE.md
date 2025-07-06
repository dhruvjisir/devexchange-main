# Deployment Guide - Split Approach

## Overview
This project uses a split deployment approach:
- **Frontend**: Netlify (static files) - `https://startupbazzar.com`
- **Backend**: Render/Railway (Express server) - `https://api.startupbazzar.com`

## Step 1: Deploy Backend (Express Server)

### Option A: Deploy on Render (Recommended)

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `startupbazzar-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

5. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   CASHFREE_CLIENT_ID=your_cashfree_client_id
   CASHFREE_CLIENT_SECRET=your_cashfree_client_secret
   CASHFREE_ENV=PRODUCTION
   ```

6. **Deploy** - Render will automatically deploy your backend

### Option B: Deploy on Railway

1. **Go to [Railway.app](https://railway.app)** and sign up/login
2. **Create a new project**
3. **Connect your GitHub repository**
4. **Set the root directory to `server`**
5. **Add the same environment variables as above**
6. **Deploy**

## Step 2: Deploy Frontend (Netlify)

### Method 1: Deploy from GitHub

1. **Go to [Netlify.com](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

5. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BACKEND_URL=https://api.startupbazzar.com
   ```

6. **Deploy**

### Method 2: Deploy dist folder directly

1. **Go to Netlify dashboard**
2. **Drag and drop your `dist` folder**
3. **Add environment variables as above**
4. **Your site will be live immediately**

## Step 3: Update Frontend Configuration

After deploying the backend, update your frontend to use the new backend URL:

1. **In your frontend code, update API calls to use the new backend URL**
2. **Update CORS settings in your backend to allow your Netlify domain**

## Step 4: Test Your Deployment

1. **Test the backend health endpoint**: `https://api.startupbazzar.com/api/health`
2. **Test the frontend**: Visit your Netlify URL
3. **Test payment flow**: Make sure payments work end-to-end

## Environment Variables Checklist

### Backend (.env or Render/Railway environment variables):
```
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CASHFREE_CLIENT_ID=your_cashfree_client_id
CASHFREE_CLIENT_SECRET=your_cashfree_client_secret
CASHFREE_ENV=PRODUCTION
```

### Frontend (Netlify environment variables):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=https://api.startupbazzar.com
```

## Troubleshooting

### Common Issues:

1. **CORS errors**: Make sure your backend CORS settings include your Netlify domain
2. **Environment variables not working**: Double-check variable names and values
3. **Build failures**: Check the build logs in Netlify/Render
4. **Payment issues**: Verify Cashfree credentials and environment settings

### Backend CORS Update:
Update your `server/simple-server.cjs` to include your Netlify domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://startupbazzar.com',
    'https://www.startupbazzar.com'
  ],
  credentials: true
}));
```

## URLs After Deployment

- **Frontend**: `https://startupbazzar.com`
- **Backend**: `https://api.startupbazzar.com`
- **Health Check**: `https://api.startupbazzar.com/api/health` 