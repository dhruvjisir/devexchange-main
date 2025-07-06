console.log("=== STARTING SIMPLE SERVER CJS ===");
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://dhruv4.netlify.app',
  'https://devexchange-main.onrender.com',
  'https://*.netlify.app'  // Allow all Netlify subdomains
];

// Add any additional origins from environment variable
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cashfree config
const CF_ENV = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
const CF_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || '';
const CF_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET || '';
const cashfree = new Cashfree(
  CF_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CF_CLIENT_ID,
  CF_CLIENT_SECRET
);

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  const orderId = hash.digest('hex');
  return orderId.substr(0, 12);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    supabase: supabaseUrl ? 'configured' : 'missing'
  });
});

// Payment: Create Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { orderAmount, orderCurrency, customerDetails } = req.body;
    const orderId = generateOrderId();
    const request = {
      order_amount: orderAmount || 1.0,
      order_currency: orderCurrency || 'INR',
      order_id: orderId,
      customer_details: customerDetails || {
        customer_id: 'webcodder01',
        customer_phone: '9999999999',
        customer_name: 'Web Codder',
        customer_email: 'webcodder@example.com',
      },
      order_meta: {
        return_url: 'https://dhruv4.netlify.app/payment-success?order_id={order_id}'
      }
    };
    const response = await cashfree.PGCreateOrder(request);
    res.status(200).json({ ...response.data, order_id: orderId });
  } catch (error) {
    console.error('Error in /api/payment/create-order:', error);
    res.status(500).json({ error: error?.response?.data?.message || error.message || 'Unknown error' });
  }
});

// Payment: Verify
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { orderId, userId, planType } = req.body;
    console.log('--- /api/payment/verify called ---');
    console.log('Request body:', req.body);
    if (!orderId || !userId || !planType) {
      console.error('Missing required fields:', { orderId, userId, planType });
      return res.status(400).json({ error: 'Missing orderId, userId, or planType' });
    }
    let response;
    try {
      response = await cashfree.PGOrderFetchPayments(orderId);
      console.log('Cashfree PGOrderFetchPayments response:', JSON.stringify(response.data, null, 2));
    } catch (cfErr) {
      console.error('Error fetching payment from Cashfree:', cfErr);
      return res.status(500).json({ error: 'Failed to fetch payment from Cashfree', details: cfErr.message || cfErr });
    }
    const payments = Array.isArray(response.data) ? response.data : response.data.payments;
    const isPaid = payments && payments.some(p => p.payment_status === 'SUCCESS');
    console.log('Payment status:', isPaid, payments);
    if (isPaid && userId && planType) {
      const startDate = new Date();
      let endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      // Get the actual paid amount from the payment response
      const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');
      const paidAmount = successfulPayment ? successfulPayment.payment_amount : 0;
      const insertData = {
        user_id: userId,
        order_id: orderId,
        plan: planType,
        status: 'active',
        price: paidAmount, // Set to actual paid amount
        currency: 'INR',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      };
      console.log('Attempting to insert subscription into Supabase:', insertData);
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([insertData]);
      console.log('Supabase insert result:', { data, error });
      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      console.log('Not inserting subscription: isPaid:', isPaid, 'userId:', userId, 'planType:', planType);
    }
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in /api/payment/verify:', error);
    res.status(500).json({ error: error?.response?.data?.message || error.message || 'Unknown error' });
  }
});

console.log("Registering /api/test GET route...");
app.get('/api/test', (req, res) => {
  res.json({ message: 'GET test route works!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('Supabase configuration:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseKey ? 'set' : 'missing'
  });
}); 