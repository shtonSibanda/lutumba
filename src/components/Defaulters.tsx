import React, { useMemo, useState } from 'react';
import { Student, Payment } from '../types';
import { formatCurrency } from '../utils/calculations';
import { AlertTriangle, User, Phone, Mail, Filter, Search } from 'lucide-react';

interface DefaultersProps {
  students: Student[];
  payments: Payment[];
}

interface AccountOutstanding {
  accountId: string;
  accountName: string;
  currency: string;
  maxAmount: number;
  outstandingAmount: number;
}

const Defaulters: React.FC<DefaultersProps> = ({ students, payments }) => {
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Account configurations with maximum amounts (only 405 and 406)
  const accountConfigs = {
    '405': { name: 'Tuition Receipt Book', currency: 'ZAR', maxAmount: 1000 },
    '406': { name: 'Projects Receipt Book', currency: 'ZAR', maxAmount: 300 }
  };


  // Calculate defaulters with outstanding fees per account
  const defaultersData = useMemo(() => {
    const studentDefaulters: { [studentId: string]: { student: Student; accounts: AccountOutstanding[] } } = {};

    students.forEach(student => {
      const studentPayments = payments.filter(p => p.studentId === student.id && p.status === 'completed');
      const studentAccounts: AccountOutstanding[] = [];

      // Check each account for outstanding amounts
      Object.entries(accountConfigs).forEach(([accountId, config]) => {
        const accountPayments = studentPayments.filter(p => p.accountId === accountId);
        const totalPaid = accountPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const outstandingAmount = Math.max(0, config.maxAmount - totalPaid);

        // Debug logging for Ashton
        if (student.firstName === 'Ashton') {
          console.log(`Ashton - Account ${accountId}:`, {
            accountPayments: accountPayments.length,
            totalPaid,
            maxAmount: config.maxAmount,
            outstandingAmount,
            payments: accountPayments.map(p => ({ amount: p.amount, accountId: p.accountId, description: p.description }))
          });
        }

        // Only include accounts where student hasn't paid the full maximum amount
        if (totalPaid < config.maxAmount) {
          studentAccounts.push({
            accountId,
            accountName: config.name,
            currency: config.currency,
            maxAmount: config.maxAmount,
            outstandingAmount
          });
        }
      });

      if (studentAccounts.length > 0) {
        studentDefaulters[student.id] = { student, accounts: studentAccounts };
      }
    });

    return Object.values(studentDefaulters);
  }, [students, payments]);

  // Filter defaulters based on search and account selection
  const filteredDefaulters = defaultersData.filter(({ student, accounts }) => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = selectedAccount === 'all' || 
      accounts.some(account => account.accountId === selectedAccount);
    
    return matchesSearch && matchesAccount;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <span>Fee Defaulters</span>
          </h1>
          <p className="text-gray-600">Students who haven't paid the maximum required amount for each account</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-800">
            <div className="font-semibold">Total Defaulters: {filteredDefaulters.length}</div>
            <div className="text-xs mt-1">Across all payment accounts</div>
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Accounts</option>
              <option value="405">405 - Tuition Receipt Book</option>
              <option value="406">406 - Projects Receipt Book</option>
            </select>
          </div>
        </div>
      </div>

      {/* Defaulters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDefaulters.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <AlertTriangle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Defaulters Found</h3>
            <p className="text-gray-600">
              {selectedAccount === 'all' 
                ? 'All students have paid the maximum required amount for all accounts.' 
                : `All students have paid the maximum required amount for ${accountConfigs[selectedAccount as keyof typeof accountConfigs]?.name}.`
              }
            </p>
          </div>
        ) : (
          filteredDefaulters.map(({ student, accounts }) => (
            <div key={student.id} className="bg-white rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Student Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Class: {student.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Outstanding Accounts</div>
                    <div className="text-lg font-bold text-red-600">
                      {accounts.length}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                  {student.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  {student.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{student.email}</span>
                    </div>
                  )}
                  {student.parentName && (
                    <div className="text-gray-600">
                      <span className="font-medium">Parent:</span> {student.parentName}
                    </div>
                  )}
                  {student.parentPhone && (
                    <div className="text-gray-600">
                      <span className="font-medium">Parent Phone:</span> {student.parentPhone}
                    </div>
                  )}
                </div>

                {/* Outstanding Accounts */}
                <div className="space-y-4">
                  {accounts
                    .filter(account => selectedAccount === 'all' || account.accountId === selectedAccount)
                    .map((account) => (
                    <div key={account.accountId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                          <p className="text-xs text-gray-600">Account {account.accountId}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-600">
                            {formatCurrency(account.outstandingAmount, account.currency)}
                          </div>
                          <div className="text-xs text-gray-500">
                            of {formatCurrency(account.maxAmount, account.currency)} max
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Defaulters;