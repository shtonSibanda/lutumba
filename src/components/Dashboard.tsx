import React from 'react';
import { DollarSign, Users, TrendingUp, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { FinancialSummary } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';

interface DashboardProps {
  financialSummary: FinancialSummary;
}

const Dashboard: React.FC<DashboardProps> = ({ financialSummary }) => {
  const {
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    outstandingAmount,
    totalStudents,
    activeStudents,
    recentPayments
  } = financialSummary;

  const collectionRate = totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">Overview of school financial performance and cash analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">↗ 12.5%</span>
            <span className="text-gray-500 text-sm ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">↗ 8.3%</span>
            <span className="text-gray-500 text-sm ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(dailyRevenue)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-600 text-sm font-medium">Today</span>
            <span className="text-gray-500 text-sm ml-2">Daily Analysis</span>
          </div>
        </div>
      </div>

      {/* Daily Financial Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Daily Financial Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(dailyRevenue)}</div>
            <div className="text-sm text-gray-600">Today's Collection</div>
            <div className="text-xs text-green-500 mt-1">Real-time tracking</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(monthlyRevenue)}</div>
            <div className="text-sm text-gray-600">This Month's Collection</div>
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
                  <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { method: 'Bank Transfer', amount: 8500, percentage: 45, color: 'bg-blue-500' },
            { method: 'Card Payment', amount: 6200, percentage: 33, color: 'bg-green-500' },
            { method: 'Cash', amount: 2800, percentage: 15, color: 'bg-yellow-500' },
            { method: 'Check', amount: 1300, percentage: 7, color: 'bg-purple-500' }
          ].map((method) => (
            <div key={method.method} className="text-center">
              <div className="mb-3">
                <div className={`w-16 h-16 ${method.color} rounded-full mx-auto flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{method.percentage}%</span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900">{method.method}</h4>
              <p className="text-gray-600">{formatCurrency(method.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;