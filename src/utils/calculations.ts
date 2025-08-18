import { Student, Payment } from '../types';

export const calculateFinancialSummary = (students: Student[], payments: Payment[]) => {
  // Convert all payments to USD for consistent calculations
  const convertToUSD = (amount: number, currency: string): number => {
    if (currency === 'USD') return amount;
    return convertCurrency(amount, currency, 'USD');
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + convertToUSD(payment.amount, payment.currency), 0);

  const currentMonth = new Date().getMonth();
  const monthlyRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate.getMonth() === currentMonth && p.status === 'completed';
    })
    .reduce((sum, payment) => sum + convertToUSD(payment.amount, payment.currency), 0);

  // Calculate daily revenue for today
  const today = new Date().toISOString().split('T')[0];
  const dailyRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.paymentDate).toISOString().split('T')[0];
      return paymentDate === today && p.status === 'completed';
    })
    .reduce((sum, payment) => sum + convertToUSD(payment.amount, payment.currency), 0);

  const outstandingAmount = students.reduce((sum, student) => sum + student.outstandingBalance, 0);
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;

  const recentPayments = payments
    .filter(p => p.status === 'completed')
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return {
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    outstandingAmount,
    totalStudents,
    activeStudents,
    recentPayments
  };
};

// Exchange rates (base: USD)
export const EXCHANGE_RATES = {
  USD: 1,
  ZAR: 17.5,
  ZIG: 34
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
  const toRate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES];
  return (amount * fromRate) / toRate;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const currencySymbols = {
    USD: '$',
    ZAR: 'R',
    ZIG: 'Z'
  };
  
  const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const suggestCurrency = (amount: number): string => {
  // Simple logic to suggest currency based on amount
  if (amount >= 1000) {
    return 'USD'; // Large amounts in USD
  } else if (amount >= 100) {
    return 'ZAR'; // Medium amounts in Rands
  } else {
    return 'ZIG'; // Small amounts in ZIG
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'suspended':
    case 'failed':
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'inactive':
    case 'pending':
    case 'unpaid':
      return 'bg-yellow-100 text-yellow-800';
    case 'graduated':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};