import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Calendar, CreditCard, ArrowLeft, Users } from 'lucide-react';
import { FinancialSummary, Student, Payment, Expense } from '../types';
import { formatCurrency, formatDate, calculateFinancialSummary } from '../utils/calculations';

interface ZARDashboardProps {
  financialSummary: FinancialSummary;
  students: Student[];
  payments: Payment[];
  expenses: Expense[];
  onBack: () => void;
}

const ZARDashboard: React.FC<ZARDashboardProps> = ({ 
  financialSummary, 
  students, 
  payments, 
  expenses, 
  onBack 
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateFilteredSummary, setDateFilteredSummary] = useState(financialSummary);
  
  // Recalculate financial summary when date changes
  useEffect(() => {
    const newSummary = calculateFinancialSummary(students, payments, expenses, selectedDate);
    setDateFilteredSummary(newSummary);
  }, [selectedDate, students, payments, expenses]);
  
  const {
    recentPayments,
    totalRevenueByCurrency,
    monthlyRevenueByCurrency,
    dailyRevenueByCurrency
  } = dateFilteredSummary;

  // Filter payments and expenses for ZAR only
  const zarPayments = payments.filter(payment => payment.currency === 'ZAR');
  const zarExpenses = expenses.filter(expense => expense.currency === 'ZAR');
  const zarRecentPayments = recentPayments.filter(payment => payment.currency === 'ZAR').slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <span>ZAR Financial Dashboard</span>
            </h1>
            <p className="text-gray-600">South African Rand financial analysis and performance metrics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Analysis Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* ZAR Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">Total ZAR Revenue</p>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(totalRevenueByCurrency.ZAR, 'ZAR')}
              </div>
              <p className="text-sm text-gray-500 mt-2">All-time ZAR collections</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Monthly ZAR Revenue
              </p>
              <div className="text-3xl font-bold text-indigo-600">
                {formatCurrency(monthlyRevenueByCurrency.ZAR, 'ZAR')}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Daily ZAR Collection
              </p>
              <div className="text-3xl font-bold text-cyan-600">
                {formatCurrency(dailyRevenueByCurrency.ZAR, 'ZAR')}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-cyan-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ZAR Payment Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">ZAR Payment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(dailyRevenueByCurrency.ZAR, 'ZAR')}
            </div>
            <div className="text-sm text-gray-600">Today's ZAR Collection</div>
            <div className="text-xs text-blue-500 mt-1">Real-time tracking</div>
          </div>
          <div className="text-center p-6 bg-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {formatCurrency(monthlyRevenueByCurrency.ZAR, 'ZAR')}
            </div>
            <div className="text-sm text-gray-600">This Month's ZAR Collection</div>
            <div className="text-xs text-indigo-500 mt-1">Monthly total</div>
          </div>
          <div className="text-center p-6 bg-cyan-50 rounded-lg">
            <div className="text-3xl font-bold text-cyan-600 mb-2">{zarPayments.length}</div>
            <div className="text-sm text-gray-600">Total ZAR Transactions</div>
            <div className="text-xs text-cyan-500 mt-1">Payment count</div>
          </div>
        </div>
      </div>

      {/* ZAR Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">ZAR Cash Flow Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">ZAR Cash Inflow (This Month)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(monthlyRevenueByCurrency.ZAR, 'ZAR')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">ZAR Expenses (This Month)</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    zarExpenses
                      .filter(expense => new Date(expense.date).getMonth() === new Date(selectedDate).getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    'ZAR'
                  )}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net ZAR Position</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(
                    monthlyRevenueByCurrency.ZAR - 
                    zarExpenses
                      .filter(expense => new Date(expense.date).getMonth() === new Date(selectedDate).getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    'ZAR'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent ZAR Payments</h3>
          <div className="space-y-4">
            {zarRecentPayments.length > 0 ? (
              zarRecentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, 'ZAR')}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent ZAR payments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ZAR Student Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Statistics (ZAR Payments)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {new Set(zarPayments.map(p => p.studentId)).size}
            </div>
            <div className="text-sm text-gray-600">Students with ZAR Payments</div>
          </div>
          <div className="text-center p-6 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {formatCurrency(
                zarPayments.length > 0 ? totalRevenueByCurrency.ZAR / zarPayments.length : 0,
                'ZAR'
              )}
            </div>
            <div className="text-sm text-gray-600">Average ZAR Payment</div>
          </div>
          <div className="text-center p-6 bg-cyan-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-cyan-600 mb-2">
              {((totalRevenueByCurrency.ZAR / (totalRevenueByCurrency.USD + totalRevenueByCurrency.ZAR + totalRevenueByCurrency.ZiG)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">ZAR Revenue Share</div>
          </div>
        </div>
      </div>

      {/* ZAR Expense Breakdown */}
      {zarExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">ZAR Expense Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zarExpenses.slice(0, 6).map((expense) => (
              <div key={expense.id} className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{expense.category}</h4>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(expense.amount, 'ZAR')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{expense.description}</p>
                <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZARDashboard;
