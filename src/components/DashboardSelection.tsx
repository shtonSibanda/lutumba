import React from 'react';
import { DollarSign, Globe, TrendingUp, BarChart3 } from 'lucide-react';
import { Currency } from '../types';

interface DashboardSelectionProps {
  onSelectCurrency: (currency: Currency) => void;
}

const DashboardSelection: React.FC<DashboardSelectionProps> = ({ onSelectCurrency }) => {
  const currencies = [
    {
      code: 'USD' as Currency,
      name: 'US Dollar',
      symbol: '$',
      description: 'United States Dollar financial analysis',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      borderColor: 'border-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      code: 'ZAR' as Currency,
      name: 'South African Rand',
      symbol: 'R',
      description: 'South African Rand financial analysis',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      code: 'ZiG' as Currency,
      name: 'Zimbabwe Gold',
      symbol: 'ZiG',
      description: 'Zimbabwe Gold financial analysis',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Financial Dashboard</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a currency to view detailed financial analysis and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {currencies.map((currency) => (
          <div
            key={currency.code}
            onClick={() => onSelectCurrency(currency.code)}
            className={`
              relative bg-white rounded-xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 
              hover:scale-105 hover:shadow-xl border-2 ${currency.borderColor} group
            `}
          >
            {/* Currency Icon */}
            <div className={`${currency.bgLight} p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
              <div className="flex items-center space-x-1">
                <DollarSign className={`h-8 w-8 ${currency.textColor}`} />
                <Globe className={`h-6 w-6 ${currency.textColor}`} />
              </div>
            </div>

            {/* Currency Info */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currency.code}</h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">{currency.name}</h4>
              <p className="text-gray-600 mb-6">{currency.description}</p>
              
              {/* Action Button */}
              <div className={`
                ${currency.color} ${currency.hoverColor} text-white px-6 py-3 rounded-lg 
                font-semibold transition-colors duration-300 flex items-center justify-center space-x-2
                group-hover:shadow-lg
              `}>
                <TrendingUp className="h-5 w-5" />
                <span>View {currency.code} Analytics</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <div className={`text-6xl font-bold ${currency.textColor}`}>
                {currency.symbol}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Multi-Currency Financial Management</h3>
          <p className="text-gray-600 leading-relaxed">
            Our system supports comprehensive financial analysis across multiple currencies. 
            Each dashboard provides detailed insights including revenue tracking, payment analysis, 
            expense monitoring, and cash flow management specific to the selected currency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Revenue Analysis</h4>
            <p className="text-sm text-gray-600">Track daily, monthly, and total revenue by currency</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
            <p className="text-sm text-gray-600">Comprehensive financial performance indicators</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Currency Insights</h4>
            <p className="text-sm text-gray-600">Detailed analysis for each supported currency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSelection;
