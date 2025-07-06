// Test Payment Flow
// Run this in the browser console to test the payment system

console.log('🧪 Testing Payment Flow...\n');

// Test 1: Check if payment service is available
async function testPaymentService() {
  console.log('1. Testing payment service availability...');
  
  try {
    // Import the payment service
    const { paymentService } = await import('/src/services/paymentService.ts');
    
    if (paymentService) {
      console.log('✅ Payment service is available');
      console.log('   Methods:', Object.keys(paymentService));
      return true;
    } else {
      console.log('❌ Payment service not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error importing payment service:', error.message);
    return false;
  }
}

// Test 2: Test order creation
async function testOrderCreation() {
  console.log('\n2. Testing order creation...');
  
  try {
    const { paymentService } = await import('/src/services/paymentService.ts');
    
    // Mock user data
    const mockUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      phone: '9999999999'
    };
    
    const orderData = await paymentService.createOrder({
      amount: 38000,
      currency: 'INR',
      notes: {
        userId: mockUser.id,
        customer_email: mockUser.email,
        customer_phone: mockUser.phone
      }
    });
    
    console.log('✅ Order created successfully');
    console.log('   Order ID:', orderData.id);
    console.log('   Amount:', orderData.amount);
    console.log('   Currency:', orderData.currency);
    
    return orderData;
  } catch (error) {
    console.log('❌ Error creating order:', error.message);
    return null;
  }
}

// Test 3: Test payment verification
async function testPaymentVerification(orderData) {
  console.log('\n3. Testing payment verification...');
  
  if (!orderData) {
    console.log('⚠️ Skipping verification test - no order data');
    return false;
  }
  
  try {
    const { paymentService } = await import('/src/services/paymentService.ts');
    
    const result = await paymentService.verifyPayment(
      'test-payment-id',
      orderData.id,
      'test-signature'
    );
    
    console.log('✅ Payment verification successful');
    console.log('   Result:', result);
    
    return true;
  } catch (error) {
    console.log('❌ Error verifying payment:', error.message);
    return false;
  }
}

// Test 4: Test subscription creation
async function testSubscriptionCreation() {
  console.log('\n4. Testing subscription creation...');
  
  try {
    const { paymentService } = await import('/src/services/paymentService.ts');
    
    const subscription = await paymentService.createSubscription(
      'basic',
      38000,
      'test-user-123',
      'test@example.com'
    );
    
    console.log('✅ Subscription created successfully');
    console.log('   Plan:', subscription.plan);
    console.log('   Status:', subscription.status);
    console.log('   Price:', subscription.price);
    
    return subscription;
  } catch (error) {
    console.log('❌ Error creating subscription:', error.message);
    return null;
  }
}

// Test 5: Test user access update
async function testUserAccessUpdate(orderData) {
  console.log('\n5. Testing user access update...');
  
  if (!orderData) {
    console.log('⚠️ Skipping user access test - no order data');
    return false;
  }
  
  try {
    const { paymentService } = await import('/src/services/paymentService.ts');
    
    await paymentService.updateUserAccess(
      'test-user-123',
      'basic',
      'seller',
      'test-payment-id',
      orderData.id,
      38000,
      'INR'
    );
    
    console.log('✅ User access updated successfully');
    
    return true;
  } catch (error) {
    console.log('❌ Error updating user access:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting payment flow tests...\n');
  
  const serviceAvailable = await testPaymentService();
  if (!serviceAvailable) {
    console.log('\n❌ Payment service not available. Tests stopped.');
    return;
  }
  
  const orderData = await testOrderCreation();
  const verificationSuccess = await testPaymentVerification(orderData);
  const subscriptionCreated = await testSubscriptionCreation();
  const accessUpdated = await testUserAccessUpdate(orderData);
  
  console.log('\n📊 Test Results Summary:');
  console.log('✅ Payment Service Available:', serviceAvailable);
  console.log('✅ Order Creation:', !!orderData);
  console.log('✅ Payment Verification:', verificationSuccess);
  console.log('✅ Subscription Creation:', !!subscriptionCreated);
  console.log('✅ User Access Update:', accessUpdated);
  
  const allPassed = serviceAvailable && orderData && verificationSuccess && subscriptionCreated && accessUpdated;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Payment flow is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('- Try clicking "Subscribe Now" on the pricing page');
  console.log('- The payment should process automatically (mock flow)');
  console.log('- You should see a success message after 2 seconds');
}

// Run the tests
runAllTests(); 