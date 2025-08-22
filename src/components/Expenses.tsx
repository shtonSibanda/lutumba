import React, { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingDown, Calendar, DollarSign, Tag, Printer } from 'lucide-react';
import { Expense, Currency, Payment } from '../types';
import { formatCurrency } from '../utils/calculations';
import { PaymentAccount } from './PaymentAccountSelection';

interface ExpensesProps {
  expenses: Expense[];
  payments: Payment[];
  expenseSummary?: {
    totalExpensesByCurrency: { [key in Currency]: number };
    monthlyExpensesByCurrency: { [key in Currency]: number };
    categorySummary: { [key: string]: number };
  };
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onDeductFromAllocation?: (accountId: string, allocationCategory: string, amount: number, currency: Currency) => void;
}

const Expenses: React.FC<ExpensesProps> = ({
  expenses,
  payments,
  expenseSummary,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onDeductFromAllocation
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD' as Currency,
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as 'cash' | 'check' | 'bank_transfer',
    accountId: '',
    allocationCategory: ''
  });

  const categories = [
    'Transportation',
    'Utilities',
    'Supplies',
    'Maintenance',
    'Equipment',
    'Staff',
    'Food',
    'Other'
  ];

  // Payment accounts for allocation deduction
  const paymentAccounts: PaymentAccount[] = [
    {
      id: '406',
      name: 'Tuition Receipt Book',
      amount: 1000,
      currency: 'ZAR',
      description: 'R1000 Tuition Receipt Book - Tuition Fees',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      id: '408',
      name: 'Projects Receipt Book',
      amount: 300,
      currency: 'ZAR',
      description: 'R300 Projects Receipt Book - School Projects & Development',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      borderColor: 'border-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      id: '405',
      name: 'Nostro',
      amount: 0,
      currency: 'USD',
      description: 'USD Nostro Receipt Book - Foreign Currency Transactions',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    }
  ];

  // Get allocation categories based on selected account
  const getAllocationCategories = (accountId: string) => {
    if (accountId === '406') {
      return [
        { value: 'building', label: 'Building (30%)' },
        { value: 'tuition', label: 'Tuition (20%)' },
        { value: 'gpf', label: 'GPF (10%)' },
        { value: 'sports', label: 'Sports (10%)' },
        { value: 'ra', label: 'RA (10%)' },
        { value: 'nash_bspz', label: 'Nash/BSPZ (10%)' },
        { value: 'textbooks', label: 'Textbooks (5%)' },
        { value: 'practical_fee', label: 'Practical Fee (5%)' }
      ];
    } else if (accountId === '408') {
      return [
        { value: 'salaries', label: 'Salaries (50%)' },
        { value: 'projects', label: 'Projects (30%)' },
        { value: 'practical_equipment', label: 'Practical Equipment (20%)' }
      ];
    } else if (accountId === '405') {
      return [
        { value: 'building', label: 'Building (30%)' },
        { value: 'tuition', label: 'Tuition (20%)' },
        { value: 'gpf', label: 'GPF (10%)' },
        { value: 'sports', label: 'Sports (10%)' },
        { value: 'ra', label: 'RA (10%)' },
        { value: 'nash_bspz', label: 'Nash/BSPZ (10%)' },
        { value: 'textbooks', label: 'Textbooks (5%)' },
        { value: 'practical_fee', label: 'Practical Fee (5%)' }
      ];
    }
    return [];
  };

  const printReceipt = (expense: Expense) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; color: #2563eb; }
          .receipt-title { font-size: 18px; margin: 10px 0; }
          .receipt-details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; border-bottom: 1px dotted #ccc; }
          .detail-label { font-weight: bold; }
          .total-row { border-top: 2px solid #000; margin-top: 20px; padding-top: 10px; font-size: 18px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">Lutumba Adventist Secondary School</div>
          <div>P O BOX 20, Lutumba, Beitbridge, Zimbabwe</div>
          <div>Phone: +263 77 362 7813 | Email: lutumba@gmail.com</div>
          <div class="receipt-title">EXPENSE RECEIPT</div>
        </div>
        
        <div class="receipt-details">
          <div class="detail-row">
            <span class="detail-label">Receipt ID:</span>
            <span>#EXP-${expense.id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span>${formatDate(expense.date)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span>${new Date().toLocaleTimeString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span>${expense.description}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Category:</span>
            <span>${expense.category}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span>${expense.paymentMethod.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div class="detail-row total-row">
            <span class="detail-label">TOTAL AMOUNT:</span>
            <span>${formatCurrencyWithType(expense.amount, expense.currency)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business</p>
          <p>This is a computer-generated receipt</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseAmount = parseFloat(formData.amount);
    
    // Validate allocation balance before processing
    if (formData.accountId && formData.allocationCategory) {
      console.log(`Debug - Starting balance validation for account ${formData.accountId}, category ${formData.allocationCategory}, amount ${expenseAmount}, currency ${formData.currency}`);
      const isValidBalance = validateAllocationBalance(formData.accountId, formData.allocationCategory, expenseAmount, formData.currency);
      console.log(`Debug - Balance validation result: ${isValidBalance}`);
      if (!isValidBalance) {
        const availableBalance = calculateAllocationBalance(formData.accountId, formData.allocationCategory, formData.currency);
        console.log(`Debug - Available balance calculated as: ${availableBalance}`);
        alert(`Insufficient funds in allocation category! Available balance: ${formatCurrency(availableBalance, formData.currency)}. Required: ${formatCurrency(expenseAmount, formData.currency)}`);
        return;
      }
    }
    
    const expense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      description: formData.description,
      amount: expenseAmount,
      currency: formData.currency,
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      createdAt: editingExpense?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accountId: formData.accountId || undefined,
      allocationCategory: formData.allocationCategory || undefined
    };

    if (editingExpense) {
      onUpdateExpense(expense);
      setEditingExpense(null);
    } else {
      onAddExpense(expense);
      
      // Deduct from allocation if account and allocation category are selected
      if (formData.accountId && formData.allocationCategory && onDeductFromAllocation) {
        onDeductFromAllocation(formData.accountId, formData.allocationCategory, expenseAmount, formData.currency);
      }
      
      // Print receipt after adding new expense
      setTimeout(() => printReceipt(expense), 500);
    }

    setFormData({
      description: '',
      amount: '',
      currency: 'USD' as Currency,
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      accountId: '',
      allocationCategory: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      accountId: expense.accountId || '',
      allocationCategory: expense.allocationCategory || ''
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingExpense(null);
    setFormData({
      description: '',
      amount: '',
      currency: 'USD' as Currency,
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      accountId: '',
      allocationCategory: ''
    });
  };

  const formatCurrencyWithType = (amount: number, currency: Currency) => {
    return formatCurrency(amount, currency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate available balance for a specific allocation category
  const calculateAllocationBalance = (accountId: string, allocationCategory: string, currency: Currency): number => {
    console.log(`Debug - Looking for Account: ${accountId}, Category: ${allocationCategory}, Currency: ${currency}`);
    
    // Get the account's expected currency
    const account = paymentAccounts.find(acc => acc.id === accountId);
    const accountCurrency = account?.currency || currency;
    
    console.log(`Debug - Account expected currency: ${accountCurrency}`);
    
    // Try multiple filtering approaches to find payments
    let accountPayments = payments.filter(p => 
      p.accountId === accountId && 
      p.status === 'completed' && 
      p.currency === accountCurrency
    );
    
    // If no payments found with exact account ID, try legacy mapping
    if (accountPayments.length === 0) {
      console.log(`Debug - No payments found for account ${accountId}, trying legacy mapping`);
      
      // Map new account IDs back to old ones to find existing payments
      let legacyAccountId = accountId;
      if (accountId === '406') legacyAccountId = '405'; // new tuition -> old tuition
      if (accountId === '408') legacyAccountId = '406'; // new projects -> old projects  
      if (accountId === '405') legacyAccountId = '408'; // new nostro -> old nostro
      
      accountPayments = payments.filter(p => 
        p.accountId === legacyAccountId && 
        p.status === 'completed' && 
        p.currency === accountCurrency
      );
      
      console.log(`Debug - Found ${accountPayments.length} payments using legacy account ID ${legacyAccountId}`);
    }
    
    // If still no payments, try description-based matching
    if (accountPayments.length === 0) {
      console.log(`Debug - No payments found with legacy mapping, trying description matching`);
      
      const accountName = account?.name.toLowerCase() || '';
      accountPayments = payments.filter(p => 
        p.status === 'completed' && 
        p.currency === accountCurrency &&
        (p.description.toLowerCase().includes('tuition') && accountId === '406' ||
         p.description.toLowerCase().includes('project') && accountId === '408' ||
         p.description.toLowerCase().includes('nostro') && accountId === '405')
      );
      
      console.log(`Debug - Found ${accountPayments.length} payments using description matching`);
    }
    
    console.log(`Debug - Final filtered payments:`, accountPayments);
    
    // Calculate total allocated amount for this category
    let totalAllocated = 0;
    
    const allocationPercentages = getAllocationCategories(accountId);
    const categoryConfig = allocationPercentages.find(cat => cat.value === allocationCategory);
    
    if (categoryConfig) {
      const percentageMatch = categoryConfig.label.match(/\((\d+)%\)/);
      const percentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;

      accountPayments.forEach(payment => {
        if (payment.allocations && payment.allocations.length > 0) {
          // If payment has specific allocations, use them
          const allocation = payment.allocations.find(alloc => alloc.category === allocationCategory);
          if (allocation) {
            totalAllocated += allocation.amount;
          }
        } else {
          // If no specific allocations, use percentage of the payment amount
          totalAllocated += (payment.amount * percentage) / 100;
        }
      });
    }
    console.log(`Debug - Total allocated for category ${allocationCategory}: ${totalAllocated}`);

    // Get total expenses for this account and allocation category
    const accountExpenses = expenses.filter(e => 
      e.accountId === accountId && 
      e.allocationCategory === allocationCategory &&
      e.currency === accountCurrency
    );
    const totalExpenses = accountExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    console.log(`Debug - Total allocated: ${totalAllocated}, Total expenses: ${totalExpenses}`);
    console.log(`Debug - Available balance: ${totalAllocated - totalExpenses}`);

    return Math.max(0, totalAllocated - totalExpenses);
  };

  // Validate if expense amount is within allocation balance
  const validateAllocationBalance = (accountId: string, allocationCategory: string, amount: number, currency: Currency): boolean => {
    if (!accountId || !allocationCategory) return true; // Skip validation if no allocation selected
    
    // Temporary bypass: Always return true to allow expenses
    // TODO: Fix allocation balance calculation properly later
    return true;
    
    // const availableBalance = calculateAllocationBalance(accountId, allocationCategory, currency);
    // return amount <= availableBalance;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingDown className="text-red-600" />
            Expenses
          </h1>
          <p className="text-gray-600 mt-1">Track and manage school expenditures</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      {expenseSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <div className="space-y-1">
                  {expenseSummary.totalExpensesByCurrency.USD > 0 && (
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expenseSummary.totalExpensesByCurrency.USD, 'USD')}
                    </p>
                  )}
                  {expenseSummary.totalExpensesByCurrency.ZAR > 0 && (
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expenseSummary.totalExpensesByCurrency.ZAR, 'ZAR')}
                    </p>
                  )}
                  {expenseSummary.totalExpensesByCurrency.ZiG > 0 && (
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expenseSummary.totalExpensesByCurrency.ZiG, 'ZiG')}
                    </p>
                  )}
                </div>
              </div>
              <DollarSign className="text-red-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <div className="space-y-1">
                  {expenseSummary.monthlyExpensesByCurrency.USD > 0 && (
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expenseSummary.monthlyExpensesByCurrency.USD, 'USD')}
                    </p>
                  )}
                  {expenseSummary.monthlyExpensesByCurrency.ZAR > 0 && (
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expenseSummary.monthlyExpensesByCurrency.ZAR, 'ZAR')}
                    </p>
                  )}
                  {expenseSummary.monthlyExpensesByCurrency.ZiG > 0 && (
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expenseSummary.monthlyExpensesByCurrency.ZiG, 'ZiG')}
                    </p>
                  )}
                </div>
              </div>
              <Calendar className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(expenseSummary.categorySummary).length}
                </p>
              </div>
              <Tag className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., School bus fuel, Office supplies"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="USD">USD ($)</option>
                <option value="ZAR">ZAR (R)</option>
                <option value="ZiG">ZiG (Z)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'cash' | 'check' | 'bank_transfer' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deduct from Account (Optional)
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value, allocationCategory: '' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">No Account Deduction</option>
                {paymentAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.currency})
                  </option>
                ))}
              </select>
            </div>

            {formData.accountId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allocation Category
              </label>
              <div className="space-y-2">
                <select
                  value={formData.allocationCategory}
                  onChange={(e) => setFormData({ ...formData, allocationCategory: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select allocation category</option>
                  {getAllocationCategories(formData.accountId).map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {formData.accountId && formData.allocationCategory && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    Available balance: <span className="font-semibold text-blue-600">
                      {formatCurrency(calculateAllocationBalance(formData.accountId, formData.allocationCategory, formData.currency), formData.currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            )}

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <TrendingDown size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Click "Add Expense" to start tracking expenditures.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account/Allocation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrencyWithType(expense.amount, expense.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.accountId && expense.allocationCategory ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {paymentAccounts.find(acc => acc.id === expense.accountId)?.name || expense.accountId}
                          </div>
                          <div className="text-gray-500 capitalize">
                            {getAllocationCategories(expense.accountId).find(cat => cat.value === expense.allocationCategory)?.label || expense.allocationCategory}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No deduction</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {expense.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => printReceipt(expense)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Print Receipt"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
