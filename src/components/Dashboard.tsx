import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Calendar, CreditCard, Globe, Users } from 'lucide-react';
import { FinancialSummary, Currency, Student, Payment, Expense } from '../types';
import { formatCurrency, formatDate, calculateFinancialSummary } from '../utils/calculations';

interface DashboardProps {
  financialSummary: FinancialSummary;
  students: Student[];
  payments: Payment[];
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ financialSummary, students, payments, expenses }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
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

  const currencies: Currency[] = ['USD', 'ZAR', 'ZiG'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Overview of school financial performance and cash analysis</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">Total Revenue</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">USD:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(totalRevenueByCurrency.USD, 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-medium">ZAR:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(totalRevenueByCurrency.ZAR, 'ZAR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600 font-medium">ZiG:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(totalRevenueByCurrency.ZiG, 'ZiG')}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Monthly Revenue ({new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">USD:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(monthlyRevenueByCurrency.USD, 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-medium">ZAR:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(monthlyRevenueByCurrency.ZAR, 'ZAR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600 font-medium">ZiG:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(monthlyRevenueByCurrency.ZiG, 'ZiG')}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Daily Collection ({new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">USD:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(dailyRevenueByCurrency.USD, 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-medium">ZAR:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(dailyRevenueByCurrency.ZAR, 'ZAR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600 font-medium">ZiG:</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(dailyRevenueByCurrency.ZiG, 'ZiG')}</span>
                </div>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full group-hover:bg-yellow-200 transition-colors duration-300">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Currency Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Revenue by Currency</h3>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currencies.map((currency) => (
            <div key={currency} className={`p-6 rounded-lg border-2 ${selectedCurrency === currency ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(totalRevenueByCurrency[currency], currency)}
                </div>
                <div className="text-sm text-gray-600 mb-3">{currency} Total Revenue</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Monthly:</span>
                    <span className="font-medium">{formatCurrency(monthlyRevenueByCurrency[currency], currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today:</span>
                    <span className="font-medium">{formatCurrency(dailyRevenueByCurrency[currency], currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Financial Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Daily Financial Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(dailyRevenue)}</div>
            <div className="text-sm text-gray-600">Today's Collection (USD Equivalent)</div>
            <div className="text-xs text-green-500 mt-1">Real-time tracking</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(monthlyRevenue)}</div>
            <div className="text-sm text-gray-600">This Month's Collection (USD Equivalent)</div>
            <div className="text-xs text-blue-500 mt-1">Monthly total</div>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(outstandingAmount)}</div>
            <div className="text-sm text-gray-600">Pending Collections</div>
            <div className="text-xs text-orange-500 mt-1">Requires follow-up</div>
          </div>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Cash Flow Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash Inflow (This Month)</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Collections</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(outstandingAmount)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net Cash Position</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(totalRevenue - (outstandingAmount * 0.1))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Payments</h3>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
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
                  <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                  <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalStudents}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">{activeStudents}</div>
            <div className="text-sm text-gray-600">Active Students</div>
            <div className="text-xs text-green-500 mt-1">
              {totalStudents > 0 ? `${((activeStudents / totalStudents) * 100).toFixed(1)}% active` : '0% active'}
            </div>
          </div>
        </div>
      </div>

      {/* Currency Distribution Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Currency Distribution Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currencies.map((currency) => {
            const totalAmount = totalRevenueByCurrency[currency];
            const monthlyAmount = monthlyRevenueByCurrency[currency];
            const dailyAmount = dailyRevenueByCurrency[currency];
            const totalRevSum = totalRevenueByCurrency.USD + totalRevenueByCurrency.ZAR + totalRevenueByCurrency.ZiG;
            const percentage = totalRevSum > 0 ? ((totalAmount / totalRevSum) * 100).toFixed(1) : '0';
            
            const getCurrencyColor = (curr: string) => {
              switch (curr) {
                case 'USD': return 'bg-green-500';
                case 'ZAR': return 'bg-blue-500';
                case 'ZiG': return 'bg-purple-500';
                default: return 'bg-gray-500';
              }
            };

            return (
              <div key={currency} className="text-center">
                <div className="mb-3">
                  <div className={`w-20 h-20 ${getCurrencyColor(currency)} rounded-full mx-auto flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{percentage}%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-lg">{currency}</h4>
                <p className="text-gray-600 font-medium">{formatCurrency(totalAmount, currency)}</p>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <div>Monthly: {formatCurrency(monthlyAmount, currency)}</div>
                  <div>Today: {formatCurrency(dailyAmount, currency)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;