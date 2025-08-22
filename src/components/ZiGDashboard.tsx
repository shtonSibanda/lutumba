import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Calendar, CreditCard, ArrowLeft, Users } from 'lucide-react';
import { FinancialSummary, Student, Payment, Expense } from '../types';
import { formatCurrency, formatDate, calculateFinancialSummary } from '../utils/calculations';

interface ZiGDashboardProps {
  financialSummary: FinancialSummary;
  students: Student[];
  payments: Payment[];
  expenses: Expense[];
  onBack: () => void;
}

const ZiGDashboard: React.FC<ZiGDashboardProps> = ({ 
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

  // Filter payments and expenses for ZiG only
  const zigPayments = payments.filter(payment => payment.currency === 'ZiG');
  const zigExpenses = expenses.filter(expense => expense.currency === 'ZiG');
  const zigRecentPayments = recentPayments.filter(payment => payment.currency === 'ZiG').slice(0, 5);

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
              <div className="bg-purple-100 p-2 rounded-full">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <span>ZiG Financial Dashboard</span>
            </h1>
            <p className="text-gray-600">Zimbabwe Gold financial analysis and performance metrics</p>
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* ZiG Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">Total ZiG Revenue</p>
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(totalRevenueByCurrency.ZiG, 'ZiG')}
              </div>
              <p className="text-sm text-gray-500 mt-2">All-time ZiG collections</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-violet-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Monthly ZiG Revenue
              </p>
              <div className="text-3xl font-bold text-violet-600">
                {formatCurrency(monthlyRevenueByCurrency.ZiG, 'ZiG')}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-violet-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-fuchsia-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Daily ZiG Collection
              </p>
              <div className="text-3xl font-bold text-fuchsia-600">
                {formatCurrency(dailyRevenueByCurrency.ZiG, 'ZiG')}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-fuchsia-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-fuchsia-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ZiG Payment Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">ZiG Payment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(dailyRevenueByCurrency.ZiG, 'ZiG')}
            </div>
            <div className="text-sm text-gray-600">Today's ZiG Collection</div>
            <div className="text-xs text-purple-500 mt-1">Real-time tracking</div>
          </div>
          <div className="text-center p-6 bg-violet-50 rounded-lg">
            <div className="text-3xl font-bold text-violet-600 mb-2">
              {formatCurrency(monthlyRevenueByCurrency.ZiG, 'ZiG')}
            </div>
            <div className="text-sm text-gray-600">This Month's ZiG Collection</div>
            <div className="text-xs text-violet-500 mt-1">Monthly total</div>
          </div>
          <div className="text-center p-6 bg-fuchsia-50 rounded-lg">
            <div className="text-3xl font-bold text-fuchsia-600 mb-2">{zigPayments.length}</div>
            <div className="text-sm text-gray-600">Total ZiG Transactions</div>
            <div className="text-xs text-fuchsia-500 mt-1">Payment count</div>
          </div>
        </div>
      </div>

      {/* ZiG Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">ZiG Cash Flow Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">ZiG Cash Inflow (This Month)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(monthlyRevenueByCurrency.ZiG, 'ZiG')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">ZiG Expenses (This Month)</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    zigExpenses
                      .filter(expense => new Date(expense.date).getMonth() === new Date(selectedDate).getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    'ZiG'
                  )}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net ZiG Position</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(
                    monthlyRevenueByCurrency.ZiG - 
                    zigExpenses
                      .filter(expense => new Date(expense.date).getMonth() === new Date(selectedDate).getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    'ZiG'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent ZiG Payments</h3>
          <div className="space-y-4">
            {zigRecentPayments.length > 0 ? (
              zigRecentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, 'ZiG')}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent ZiG payments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ZiG Student Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Statistics (ZiG Payments)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {new Set(zigPayments.map(p => p.studentId)).size}
            </div>
            <div className="text-sm text-gray-600">Students with ZiG Payments</div>
          </div>
          <div className="text-center p-6 bg-violet-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-violet-600" />
            </div>
            <div className="text-3xl font-bold text-violet-600 mb-2">
              {formatCurrency(
                zigPayments.length > 0 ? totalRevenueByCurrency.ZiG / zigPayments.length : 0,
                'ZiG'
              )}
            </div>
            <div className="text-sm text-gray-600">Average ZiG Payment</div>
          </div>
          <div className="text-center p-6 bg-fuchsia-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-fuchsia-600" />
            </div>
            <div className="text-3xl font-bold text-fuchsia-600 mb-2">
              {((totalRevenueByCurrency.ZiG / (totalRevenueByCurrency.USD + totalRevenueByCurrency.ZAR + totalRevenueByCurrency.ZiG)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">ZiG Revenue Share</div>
          </div>
        </div>
      </div>

      {/* ZiG Expense Breakdown */}
      {zigExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">ZiG Expense Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zigExpenses.slice(0, 6).map((expense) => (
              <div key={expense.id} className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{expense.category}</h4>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(expense.amount, 'ZiG')}
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

export default ZiGDashboard;
