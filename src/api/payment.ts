import { Cashfree, CFEnvironment } from 'cashfree-pg';
import crypto from 'crypto';

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

export async function createOrder(req: Request) {
  try {
    const body = await req.json();
    const orderAmount = body.orderAmount || 1.0;
    const orderCurrency = body.orderCurrency || 'INR';
    const customerDetails = body.customerDetails || {
      customer_id: 'webcodder01',
      customer_phone: '9999999999',
      customer_name: 'Web Codder',
      customer_email: 'webcodder@example.com',
    };
    const orderId = generateOrderId();
    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: customerDetails,
    };
    const response = await cashfree.PGCreateOrder(request);
    return new Response(
      JSON.stringify({ ...response.data, order_id: orderId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.response?.data?.message || error.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function verifyPayment(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;
    const response = await cashfree.PGOrderFetchPayments(orderId);
    return new Response(
      JSON.stringify(response.data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.response?.data?.message || error.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 