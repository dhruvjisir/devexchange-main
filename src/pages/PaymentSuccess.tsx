import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { API_CONFIG, apiCall } from '../config/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();

  // TODO: Replace with actual userId and planType retrieval logic
  const userId = localStorage.getItem('user_id');
  const planType = localStorage.getItem('plan_type');

  useEffect(() => {
    console.log('orderId:', orderId, 'userId:', userId, 'planType:', planType);
    if (orderId && userId && planType) {
      apiCall(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT, {
        method: 'POST',
        body: JSON.stringify({ orderId, userId, planType })
      })
        .then(data => {
          console.log('Verify response:', data);
        })
        .catch(err => {
          console.error('Error verifying payment:', err);
        });
      // Redirect to profile after 3 seconds
      const timeout = setTimeout(() => {
        navigate('/profile');
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      console.warn('Missing orderId, userId, or planType for verification', { orderId, userId, planType });
      alert('Payment verification failed: missing order or user info. Please contact support.');
    }
  }, [orderId, userId, planType, navigate]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <p>Your order ID: <b>{orderId}</b></p>
      <p>Thank you for your purchase.</p>
      <p>You will be redirected to your profile to check your subscription status.</p>
    </div>
  );
} 