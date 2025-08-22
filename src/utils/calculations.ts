import { Student, Payment, Expense, ExpenseSummary } from '../types';

export const calculateFinancialSummary = (students: Student[], payments: Payment[], expenses: Expense[] = [], selectedDate?: string) => {
  // Convert all payments to USD for consistent calculations
  const convertToUSD = (amount: number, currency: string): number => {
    if (currency === 'USD') return amount;
    return convertCurrency(amount, currency, 'USD');
  };

  // Calculate revenue by currency
  const calculateRevenueByCurrency = (paymentsToAnalyze: Payment[]) => {
    const byCurrency = { USD: 0, ZAR: 0, ZiG: 0 };
    paymentsToAnalyze
      .filter(p => p.status === 'completed')
      .forEach(payment => {
        byCurrency[payment.currency] += payment.amount;
      });
    return byCurrency;
  };

  // Use selected date or current date
  const referenceDate = selectedDate ? new Date(selectedDate) : new Date();
  
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + convertToUSD(payment.amount, payment.currency), 0);

  const monthlyPayments = payments.filter(p => {
    if (!p.paymentDate) return false;
    const paymentDate = new Date(p.paymentDate);
    return paymentDate.getMonth() === referenceDate.getMonth() && paymentDate.getFullYear() === referenceDate.getFullYear();
  });

  const monthlyRevenue = monthlyPayments
    .reduce((sum, payment) => sum + convertToUSD(payment.amount, payment.currency), 0);

  // Calculate daily revenue for selected date
  const dailyPayments = payments.filter(p => {
    if (!p.paymentDate) return false;
    const paymentDate = new Date(p.paymentDate);
    return (
      p.status === 'completed' &&
      paymentDate.getFullYear() === referenceDate.getFullYear() &&
      paymentDate.getMonth() === referenceDate.getMonth() &&
      paymentDate.getDate() === referenceDate.getDate()
    );
  });

  const dailyRevenue = dailyPayments
    .reduce((sum, payment) => sum + convertToUSD(payment.amount, payment.currency), 0);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate monthly expenses
  const monthlyExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === referenceDate.getMonth() && expenseDate.getFullYear() === referenceDate.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate net balance (revenue - expenses)
  const netBalance = totalRevenue - totalExpenses;
  const monthlyNetBalance = monthlyRevenue - monthlyExpenses;

  const outstandingAmount = students.reduce((sum, student) => sum + student.outstandingBalance, 0);
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;

  const recentPayments = payments
    .filter(p => p.status === 'completed')
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  // Calculate currency breakdowns
  const totalRevenueByCurrency = calculateRevenueByCurrency(payments);
  const monthlyRevenueByCurrency = calculateRevenueByCurrency(monthlyPayments);
  const dailyRevenueByCurrency = calculateRevenueByCurrency(dailyPayments);

  return {
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    totalExpenses,
    monthlyExpenses,
    netBalance,
    monthlyNetBalance,
    outstandingAmount,
    totalStudents,
    activeStudents,
    recentPayments,
    totalRevenueByCurrency,
    monthlyRevenueByCurrency,
    dailyRevenueByCurrency
  };
};

// Exchange rates (base: USD)
export const EXCHANGE_RATES = {
  USD: 1,
  ZAR: 17.5,
  ZiG: 34
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
    ZiG: 'Z'
  };
  
  const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
  
  // For ZiG currency, use custom formatting since it's not in Intl standard
  if (currency === 'ZiG') {
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ZAR' ? 'ZAR' : 'USD',
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
    return 'ZiG'; // Small amounts in ZiG
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  // Calculate expenses by currency
  const calculateExpensesByCurrency = (expensesToAnalyze: Expense[]) => {
    const byCurrency = { USD: 0, ZAR: 0, ZiG: 0 };
    expensesToAnalyze.forEach(expense => {
      byCurrency[expense.currency] += expense.amount;
    });
    return byCurrency;
  };

  const totalExpensesByCurrency = calculateExpensesByCurrency(expenses);
  
  const currentDate = new Date();
  const monthlyExpensesList = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentDate.getMonth() && expenseDate.getFullYear() === currentDate.getFullYear();
  });
  
  const monthlyExpensesByCurrency = calculateExpensesByCurrency(monthlyExpensesList);

  const categorySummary = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });


  return {
    categorySummary,
    totalExpensesByCurrency,
    monthlyExpensesByCurrency
  };
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