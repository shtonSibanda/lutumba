import React, { useState, useMemo } from 'react';
import { Calendar, User, DollarSign, Plus, Search, Filter, Printer, Receipt, ArrowLeft, TrendingUp, PieChart, ToggleLeft, ToggleRight } from 'lucide-react';
import { Payment, Student, Currency, PaymentAllocation, Expense } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/calculations';
import { PaymentAccount } from './PaymentAccountSelection';

interface PaymentAccountPanelProps {
  account: PaymentAccount;
  payments: Payment[];
  students: Student[];
  expenses?: Expense[];
  onAddPayment: (payment: Payment) => void;
  onUpdateStudentBalance: (studentId: string, paidAmount: number) => void;
  onBack: () => void;
}

const PaymentAccountPanel: React.FC<PaymentAccountPanelProps> = ({ 
  account, 
  payments, 
  students, 
  expenses = [],
  onAddPayment, 
  onUpdateStudentBalance, 
  onBack 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    studentId: '',
    amount: account.amount || 0,
    currency: account.currency,
    paymentMethod: 'cash' as Payment['paymentMethod'],
    description: `${account.name} Payment`,
    paymentDate: new Date().toISOString().split('T')[0],
    accountId: account.id
  });
  const [studentQuery, setStudentQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllocations, setShowAllocations] = useState(true);
  const [allocationToggles, setAllocationToggles] = useState(() => {
    if (account.id === '406') {
      return {
        building: true,
        tuition: true,
        gpf: true,
        sports: true,
        ra: true,
        nash_bspz: true,
        textbooks: true,
        practical_fee: true
      };
    } else if (account.id === '408') {
      return {
        salaries: true,
        projects: true,
        practical_equipment: true
      };
    } else if (account.id === '405') {
      return {
        building: true,
        tuition: true,
        gpf: true,
        sports: true,
        ra: true,
        nash_bspz: true,
        textbooks: true,
        practical_fee: true
      };
    }
    return {};
  });

  // Allocation percentages for different accounts
  const allocationPercentages = account.id === '406' ? {
    building: 30,
    tuition: 20,
    gpf: 10,
    sports: 10,
    ra: 10,
    nash_bspz: 10,
    textbooks: 5,
    practical_fee: 5
  } : account.id === '408' ? {
    salaries: 50,
    projects: 30,
    practical_equipment: 20
  } : account.id === '405' ? {
    building: 30,
    tuition: 20,
    gpf: 10,
    sports: 10,
    ra: 10,
    nash_bspz: 10,
    textbooks: 5,
    practical_fee: 5
  } : {};

  const allocationLabels = account.id === '406' ? {
    building: 'Building',
    tuition: 'Tuition',
    gpf: 'GPF',
    sports: 'Sports',
    ra: 'RA',
    nash_bspz: 'Nash/BSPZ',
    textbooks: 'Textbooks',
    practical_fee: 'Practical Fee'
  } : account.id === '408' ? {
    salaries: 'Salaries',
    projects: 'Projects',
    practical_equipment: 'Practical Equipment'
  } : account.id === '405' ? {
    building: 'Building',
    tuition: 'Tuition',
    gpf: 'GPF',
    sports: 'Sports',
    ra: 'RA',
    nash_bspz: 'Nash/BSPZ',
    textbooks: 'Textbooks',
    practical_fee: 'Practical Fee'
  } : {};

  // Filter payments for this specific account
  const accountPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesAccountId = payment.accountId === account.id;
      const matchesCurrencyAndName = payment.currency === account.currency && payment.description.includes(account.name);
      
      const matchesTuitionAccount = account.id === '406' && (
        payment.accountId === '406' || 
        payment.accountId === '405' || // legacy mapping
        payment.description.toLowerCase().includes('tuition') ||
        payment.description.includes(account.name)
      );
      
      const matchesProjectAccount = account.id === '408' && (
        payment.accountId === '408' || 
        payment.accountId === '406' || // legacy mapping (old projects was 406)
        payment.description.toLowerCase().includes('project') ||
        payment.description.includes(account.name)
      );
      
      const matchesNostroAccount = account.id === '405' && (
        payment.accountId === '405' || 
        payment.accountId === '408' || // legacy mapping (old nostro was 408)
        payment.currency === 'USD' ||
        payment.description.toLowerCase().includes('nostro') ||
        payment.description.includes(account.name)
      );
      
      const matchesOtherAccount = !['406', '408', '405'].includes(account.id) && (
        matchesAccountId || matchesCurrencyAndName
      );
      
      return matchesTuitionAccount || matchesProjectAccount || matchesNostroAccount || matchesOtherAccount;
    });
  }, [payments, account.id, account.currency, account.name]);

  // Calculate allocation analytics
  const allocationAnalytics = useMemo(() => {
    if (account.id !== '406' && account.id !== '408' && account.id !== '405') {
      return {};
    }
    
    const completedPayments = accountPayments.filter(p => p.status === 'completed');
    const analytics: { [key: string]: number } = {};
    
    // Calculate total revenue for this account first
    const totalAccountRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate revenue from payments based on percentages of total revenue
    Object.keys(allocationPercentages).forEach(category => {
      const percentage = allocationPercentages[category as keyof typeof allocationPercentages];
      
      // Calculate allocation amount based on total account revenue and percentage
      analytics[category] = completedPayments.reduce((sum, payment) => {
        if (payment.allocations) {
          // Use stored allocations if available
          const allocation = payment.allocations.find(a => a.category === category);
          return sum + (allocation?.amount || 0);
        } else {
          // Calculate allocations for payments without stored allocations
          // Use the payment amount multiplied by the percentage
          return sum + (payment.amount * (percentage || 0)) / 100;
        }
      }, 0);
    });
    
    // Subtract expenses from the relevant allocation categories
    const accountExpenses = expenses.filter(expense => 
      expense.accountId === account.id && expense.allocationCategory
    );
    
    accountExpenses.forEach(expense => {
      if (expense.allocationCategory && analytics[expense.allocationCategory] !== undefined) {
        analytics[expense.allocationCategory] = Math.max(0, analytics[expense.allocationCategory] - expense.amount);
      }
    });
    
    return analytics;
  }, [accountPayments, allocationPercentages, account.id, expenses]);

  // Generate allocations for a payment amount
  const generateAllocations = (amount: number): PaymentAllocation[] => {
    return Object.entries(allocationPercentages).map(([category, percentage]) => ({
      category,
      percentage: percentage || 0,
      amount: (amount * (percentage || 0)) / 100
    }));
  };

  const filteredPayments = accountPayments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate account-specific metrics with expense deductions
  const accountMetrics = useMemo(() => {
    const completedPayments = accountPayments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const currentDate = new Date();
    const monthlyPayments = completedPayments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate.getMonth() === currentDate.getMonth() && paymentDate.getFullYear() === currentDate.getFullYear();
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const dailyPayments = completedPayments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate.toDateString() === currentDate.toDateString();
    });
    const dailyRevenue = dailyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate expenses for this specific account
    const accountExpenses = expenses.filter(e => e.accountId === account.id);
    const totalExpenses = accountExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyExpenses = accountExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentDate.getMonth() && expenseDate.getFullYear() === currentDate.getFullYear();
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    const dailyExpenses = accountExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.toDateString() === currentDate.toDateString();
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate net amounts (revenue - expenses)
    const totalAmount = totalRevenue - totalExpenses;
    const monthlyAmount = monthlyRevenue - monthlyExpenses;
    const dailyAmount = dailyRevenue - dailyExpenses;
    
    const uniqueStudents = new Set(completedPayments.map(p => p.studentId)).size;
    
    return {
      totalAmount,
      monthlyAmount,
      dailyAmount,
      totalRevenue,
      monthlyRevenue,
      dailyRevenue,
      totalExpenses,
      monthlyExpenses,
      dailyExpenses,
      totalTransactions: completedPayments.length,
      monthlyTransactions: monthlyPayments.length,
      dailyTransactions: dailyPayments.length,
      uniqueStudents,
      averagePayment: completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0
    };
  }, [accountPayments, expenses, account.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (!selectedStudent) return;

    // For account 405, enforce R1000 maximum and generate allocations
    // For account 406, generate allocations
    let finalAmount = formData.amount;
    let allocations: PaymentAllocation[] | undefined;
    
    if (account.id === '406') {
      if (finalAmount > 1000) {
        alert('Maximum payment amount for Tuition Receipt Book is R1000');
        return;
      }
      allocations = generateAllocations(finalAmount);
    } else if (account.id === '408') {
      if (finalAmount > 300) {
        alert('Maximum payment amount for Projects Receipt Book is R300');
        return;
      }
      allocations = generateAllocations(finalAmount);
    } else if (account.id === '405') {
      if (finalAmount > 70) {
        alert('Maximum payment amount for Nostro Receipt Book is $70 USD');
        return;
      }
      // Nostro account uses the same allocation scheme as 406
      allocations = generateAllocations(finalAmount);
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      amount: finalAmount,
      currency: formData.currency,
      paymentMethod: formData.paymentMethod,
      paymentDate: formData.paymentDate,
      description: formData.description,
      invoiceNumber: `${account.id}-${Date.now()}`,
      status: 'completed',
      accountId: account.id,
      allocations
    };

    onAddPayment(newPayment);
    onUpdateStudentBalance(formData.studentId, selectedStudent.paidAmount + finalAmount);

    setSelectedPayment(newPayment);
    setShowReceiptModal(true);
    setShowModal(false);
    setFormData({
      studentId: '',
      amount: account.amount || 0,
      currency: account.currency,
      paymentMethod: 'cash',
      description: `${account.name} Payment`,
      paymentDate: new Date().toISOString().split('T')[0],
      accountId: account.id
    });
    setStudentQuery('');
  };

  const handlePrintReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'ZAR': return 'R';
      case 'ZiG': return 'ZiG';
      default: return '';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Back to Accounts</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className={`${account.bgLight} p-2 rounded-full`}>
                  <Receipt className={`h-8 w-8 ${account.textColor}`} />
                </div>
                <span>{account.name} Receipt Book</span>
              </h1>
              <p className="text-gray-600">{account.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`${account.color} ${account.hoverColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors`}
          >
            <Plus className="h-5 w-5" />
            <span>Process Payment</span>
          </button>
        </div>

        {/* Allocation Analytics for Account 406, 408, and 405 */}
        {(account.id === '406' || account.id === '408' || account.id === '405') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <PieChart className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Allocation Analytics</h3>
              </div>
              <button
                onClick={() => setShowAllocations(!showAllocations)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                {showAllocations ? <ToggleRight className="h-5 w-5 text-blue-600" /> : <ToggleLeft className="h-5 w-5 text-blue-600" />}
                <span className="text-blue-700 text-sm font-medium">{showAllocations ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>
            
            {showAllocations && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(allocationLabels).map(([key, label]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <button
                        onClick={() => setAllocationToggles(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {allocationToggles[key as keyof typeof allocationToggles] ? 
                          <ToggleRight className="h-4 w-4" /> : 
                          <ToggleLeft className="h-4 w-4" />
                        }
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{allocationPercentages[key as keyof typeof allocationPercentages]}%</div>
                    <div className="text-lg font-bold text-gray-900">
                      {allocationToggles[key as keyof typeof allocationToggles] ? 
                        formatCurrency(allocationAnalytics[key] || 0, account.currency) : 
                        '---'
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${account.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue (Total)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(accountMetrics.totalAmount, account.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Revenue: {formatCurrency(accountMetrics.totalRevenue, account.currency)} - 
                  Expenses: {formatCurrency(accountMetrics.totalExpenses, account.currency)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${account.textColor}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue (This Month)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(accountMetrics.monthlyAmount, account.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Revenue: {formatCurrency(accountMetrics.monthlyRevenue, account.currency)} - 
                  Expenses: {formatCurrency(accountMetrics.monthlyExpenses, account.currency)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue (Today)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(accountMetrics.dailyAmount, account.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Revenue: {formatCurrency(accountMetrics.dailyRevenue, account.currency)} - 
                  Expenses: {formatCurrency(accountMetrics.dailyExpenses, account.currency)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{accountMetrics.uniqueStudents}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${account.name} payments...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {account.name} Payment History ({filteredPayments.length} records)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`${account.bgLight} p-2 rounded-full mr-3`}>
                            <User className={`h-4 w-4 ${account.textColor}`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.paymentDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePrintReceipt(payment)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                        >
                          <Receipt className="h-4 w-4" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No payments found for {account.name}</p>
                        <p className="text-sm">Start by processing your first payment</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`${account.bgLight} p-2 rounded-full`}>
                    <Receipt className={`h-6 w-6 ${account.textColor}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{account.name} Payment</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                    <input
                      type="text"
                      placeholder="Search student by name"
                      value={studentQuery}
                      onChange={(e) => {
                        setStudentQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />

                    {showSuggestions && studentQuery.trim().length > 0 && (
                      <ul className="absolute z-40 left-0 right-0 bg-white border border-gray-200 rounded shadow max-h-60 overflow-auto mt-1">
                        {students
                          .filter(s => {
                            const q = studentQuery.toLowerCase();
                            const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                            return fullName.includes(q);
                          })
                          .slice(0, 10)
                          .map(s => (
                            <li
                              key={s.id}
                              onClick={() => {
                                setFormData({ ...formData, studentId: s.id });
                                setStudentQuery(`${s.firstName} ${s.lastName}`);
                                setShowSuggestions(false);
                              }}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            >
                              <div className="font-medium">{s.firstName} {s.lastName}</div>
                              <div className="text-xs text-gray-500">{s.class}</div>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount {account.amount > 0 && `(${getCurrencySymbol(account.currency)}${account.amount})`}
                        {account.id === '406' && <span className="text-red-600 text-xs ml-2">(Max: R1000)</span>}
                        {account.id === '408' && <span className="text-red-600 text-xs ml-2">(Max: R300)</span>}
                        {account.id === '405' && <span className="text-red-600 text-xs ml-2">(Max: $70)</span>}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={account.id === '406' ? 1000 : account.id === '408' ? 300 : account.id === '405' ? 70 : undefined}
                        step="0.01"
                        required
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      {(account.id === '406' || account.id === '408') ? (
                        <input
                          type="text"
                          value="ZAR (R)"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      ) : account.id === '405' ? (
                        <input
                          type="text"
                          value="USD ($)"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      ) : (
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="ZAR">ZAR (R)</option>
                          <option value="ZiG">ZiG (Z)</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Payment['paymentMethod'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="check">Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className={`flex-1 ${account.color} ${account.hoverColor} text-white py-2 px-4 rounded-lg transition-colors`}
                    >
                      Process Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setStudentQuery('');
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Receipt</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print</span>
                    </button>
                    <button
                      onClick={() => setShowReceiptModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 p-4 print:border-0 print:p-0">
                  <div className="text-center mb-4">
                    <div className={`${account.bgLight} p-2 rounded-full inline-block mb-2`}>
                      <Receipt className={`h-5 w-5 ${account.textColor}`} />
                    </div>
                    <h1 className={`text-xl font-bold ${account.textColor} mb-1`}>PAYMENT RECEIPT</h1>
                    <p className="text-sm text-gray-600">Lutumba Adventist Secondary School</p>
                    <p className="text-xs text-gray-600">P O BOX 20, Lutumba, Beitbridge, Zimbabwe</p>
                    <div className={`mt-2 ${account.bgLight} px-2 py-1 rounded inline-block`}>
                      <p className={`text-sm font-semibold ${account.textColor}`}>{account.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Receipt No:</span>
                        <p className="font-semibold">{selectedPayment.invoiceNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="font-semibold">{formatDate(selectedPayment.paymentDate)}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <span className="text-gray-600 text-sm">Student:</span>
                      <p className="font-semibold">{selectedPayment.studentName}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 text-sm">Payment Method:</span>
                      <p className="font-semibold capitalize">{selectedPayment.paymentMethod.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className={`${account.bgLight} rounded p-3 mb-4`}>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                      <p className={`text-2xl font-bold ${account.textColor}`}>
                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Thank you for your payment!</p>
                    <p className="text-xs text-gray-600">Email: lutumba@gmail.com | Phone: +263 77 362 7813</p>
                    <p className="text-xs text-gray-500 mt-2">Generated: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:border-0 {
              border: 0 !important;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
            .fixed.inset-0 * {
              visibility: visible;
            }
            .fixed.inset-0 {
              position: static !important;
              background: white !important;
            }
            .bg-black {
              background: white !important;
            }
            .max-w-md {
              max-width: 100% !important;
              width: 100% !important;
            }
            .rounded-lg, .rounded {
              border-radius: 0 !important;
            }
            .shadow-xl {
              box-shadow: none !important;
            }
            .mb-4:last-child {
              margin-bottom: 0 !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default PaymentAccountPanel;
