// Fix the existing payment to have the correct accountId
fetch('http://localhost:5000/api/payments/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    studentId: '29',
    studentName: 'Calton mandeya',
    amount: 1000,
    currency: 'ZAR',
    paymentMethod: 'cash',
    paymentDate: '2025-08-20',
    description: 'Tuition Receipt Book Payment',
    invoiceNumber: '405-1755809155136',
    status: 'completed',
    accountId: '405'  // Set the correct account ID
  }),
})
.then(response => response.json())
.then(data => {
  console.log('Payment updated:', data);
  
  // Fetch the updated payment to verify
  return fetch('http://localhost:5000/api/payments');
})
.then(response => response.json())
.then(payments => {
  console.log('Updated payment:', payments[0]);
})
.catch(error => {
  console.error('Error:', error);
});
