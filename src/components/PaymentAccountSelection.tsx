import React from 'react';
import { CreditCard, Receipt, DollarSign, TrendingUp, BookOpen } from 'lucide-react';

export interface PaymentAccount {
  id: string;
  name: string;
  amount: number;
  currency: 'USD' | 'ZAR' | 'ZiG';
  description: string;
  color: string;
  hoverColor: string;
  borderColor: string;
  textColor: string;
  bgLight: string;
}

interface PaymentAccountSelectionProps {
  onSelectAccount: (account: PaymentAccount) => void;
}

const PaymentAccountSelection: React.FC<PaymentAccountSelectionProps> = ({ onSelectAccount }) => {
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
    },
    {
      id: '402',
      name: 'Account 402',
      amount: 0,
      currency: 'ZiG',
      description: 'ZiG Receipt Book - Local Currency Payments',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50'
    },
    {
      id: '401',
      name: 'USD SiG Account',
      amount: 0,
      currency: 'USD',
      description: 'USD SiG Receipt Book - USD Currency Transactions Only',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      borderColor: 'border-indigo-500',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50'
    }
  ];

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'ZAR': return 'R';
      case 'ZiG': return 'ZiG';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Receipt Books</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a receipt book account to process payments and view financial analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {paymentAccounts.map((account) => (
          <div
            key={account.id}
            onClick={() => onSelectAccount(account)}
            className={`
              relative bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 
              hover:scale-105 hover:shadow-xl border-2 ${account.borderColor} group
            `}
          >
            {/* Account Header */}
            <div className={`${account.bgLight} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Receipt className={`h-6 w-6 ${account.textColor}`} />
                  <h3 className="text-xl font-bold text-gray-900">{account.name}</h3>
                </div>
                <div className={`${account.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {account.currency}
                </div>
              </div>
              
              {account.amount > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {getCurrencySymbol(account.currency)}{account.amount}
                  </div>
                  <div className="text-sm text-gray-600">Standard Amount</div>
                </div>
              )}
              
              {account.amount === 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    Variable Amount
                  </div>
                  <div className="text-sm text-gray-600">Flexible Payment</div>
                </div>
              )}
            </div>

            {/* Account Description */}
            <div className="mb-6">
              <p className="text-gray-700 text-center leading-relaxed">
                {account.description}
              </p>
            </div>

            {/* Action Button */}
            <div className={`
              ${account.color} ${account.hoverColor} text-white px-6 py-3 rounded-lg 
              font-semibold transition-colors duration-300 flex items-center justify-center space-x-2
              group-hover:shadow-lg
            `}>
              <CreditCard className="h-5 w-5" />
              <span>Access {account.name}</span>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <div className={`text-4xl font-bold ${account.textColor}`}>
                {account.id}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Receipt Book Management System</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Each receipt book account represents a specific payment category with dedicated financial tracking. 
            Select an account to process payments, generate receipts, and view detailed financial analysis for that category.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Receipt Generation</h4>
            <p className="text-sm text-gray-600">Generate official receipts for each payment category</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Financial Analysis</h4>
            <p className="text-sm text-gray-600">Track revenue and payments by account category</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Multi-Currency Support</h4>
            <p className="text-sm text-gray-600">Process payments in USD, ZAR, and ZiG currencies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAccountSelection;
