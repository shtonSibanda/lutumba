import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Calendar, CreditCard, ArrowLeft, Users } from 'lucide-react';
import { FinancialSummary, Student, Payment, Expense } from '../types';
import { formatCurrency, formatDate, calculateFinancialSummary } from '../utils/calculations';

interface USDDashboardProps {
  financialSummary: FinancialSummary;
  students: Student[];
  payments: Payment[];
  expenses: Expense[];
  onBack: () => void;
}

const USDDashboard: React.FC<USDDashboardProps> = ({ 
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
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    outstandingAmount,
    totalStudents,
    activeStudents,
    recentPayments,
    totalRevenueByCurrency,
    monthlyRevenueByCurrency,
    dailyRevenueByCurrency
  } = dateFilteredSummary;

  // Filter payments and expenses for USD only
  const usdPayments = payments.filter(payment => payment.currency === 'USD');
  const usdExpenses = expenses.filter(expense => expense.currency === 'USD');
  const usdRecentPayments = recentPayments.filter(payment => payment.currency === 'USD').slice(0, 5);

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
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <span>USD Financial Dashboard</span>
            </h1>
            <p className="text-gray-600">US Dollar financial analysis and performance metrics</p>
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* USD Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">Total USD Revenue</p>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(totalRevenueByCurrency.USD, 'USD')}
              </div>
              <p className="text-sm text-gray-500 mt-2">All-time USD collections</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Monthly USD Revenue
              </p>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(monthlyRevenueByCurrency.USD, 'USD')}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Daily USD Collection
              </p>
              <div className="text-3xl font-bold text-yellow-600">
                {formatCurrency(dailyRevenueByCurrency.USD, 'USD')}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* USD Payment Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">USD Payment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(dailyRevenueByCurrency.USD, 'USD')}
            </div>
            <div className="text-sm text-gray-600">Today's USD Collection</div>
            <div className="text-xs text-green-500 mt-1">Real-time tracking</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(monthlyRevenueByCurrency.USD, 'USD')}
            </div>
            <div className="text-sm text-gray-600">This Month's USD Collection</div>
            <div className="text-xs text-blue-500 mt-1">Monthly total</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">{usdPayments.length}</div>
            <div className="text-sm text-gray-600">Total USD Transactions</div>
            <div className="text-xs text-purple-500 mt-1">Payment count</div>
          </div>
        </div>
      </div>

      {/* USD Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">USD Cash Flow Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">USD Cash Inflow (This Month)</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthlyRevenueByCurrency.USD, 'USD')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">USD Expenses (This Month)</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    usdExpenses
                      .filter(expense => new Date(expense.date).getMonth() === new Date(selectedDate).getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    'USD'
                  )}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net USD Position</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(
                    monthlyRevenueByCurrency.USD - 
                    usdExpenses
                      .filter(expense => new Date(expense.date).getMonth() === new Date(selectedDate).getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    'USD'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent USD Payments</h3>
          <div className="space-y-4">
            {usdRecentPayments.length > 0 ? (
              usdRecentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, 'USD')}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent USD payments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* USD Student Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Statistics (USD Payments)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {new Set(usdPayments.map(p => p.studentId)).size}
            </div>
            <div className="text-sm text-gray-600">Students with USD Payments</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(
                usdPayments.length > 0 ? totalRevenueByCurrency.USD / usdPayments.length : 0,
                'USD'
              )}
            </div>
            <div className="text-sm text-gray-600">Average USD Payment</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {((totalRevenueByCurrency.USD / (totalRevenueByCurrency.USD + totalRevenueByCurrency.ZAR + totalRevenueByCurrency.ZiG)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">USD Revenue Share</div>
          </div>
        </div>
      </div>

      {/* USD Expense Breakdown */}
      {usdExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">USD Expense Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usdExpenses.slice(0, 6).map((expense) => (
              <div key={expense.id} className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{expense.category}</h4>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(expense.amount, 'USD')}
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

export default USDDashboard;
