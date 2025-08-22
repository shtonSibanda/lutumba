// Quick test to create a payment with accountId
const testPayment = {
  studentId: '1',
  studentName: 'Test Student',
  amount: 1000,
  currency: 'ZAR',
  paymentMethod: 'cash',
  paymentDate: '2025-08-21',
  description: 'Test payment with account',
  invoiceNumber: 'TEST-001',
  status: 'completed',
  accountId: '406'
};

fetch('http://localhost:5000/api/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testPayment),
})
.then(response => response.json())
.then(data => {
  console.log('Payment created:', data);
  
  // Now fetch all payments to see the structure
  return fetch('http://localhost:5000/api/payments');
})
.then(response => response.json())
.then(payments => {
  console.log('All payments:', payments);
  if (payments.length > 0) {
    console.log('First payment structure:', payments[0]);
  }
})
.catch(error => {
  console.error('Error:', error);
});
