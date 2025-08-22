import React, { useState } from 'react';
import { CreditCard, Calendar, User, DollarSign, Plus, Search, Filter, Printer, Receipt } from 'lucide-react';
import { Payment, Student, Currency } from '../types';
import { formatCurrency, formatDate, getStatusColor, suggestCurrency } from '../utils/calculations';

interface PaymentsProps {
  payments: Payment[];
  students: Student[];
  onAddPayment: (payment: Payment) => void;
  onUpdateStudentBalance: (studentId: string, paidAmount: number) => void;
}

const Payments: React.FC<PaymentsProps> = ({ payments, students, onAddPayment, onUpdateStudentBalance }) => {
  const [showModal, setShowModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    studentId: '',
    amount: 0,
    currency: 'USD' as Currency,
    paymentMethod: 'cash' as Payment['paymentMethod'],
    description: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [studentQuery, setStudentQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (!selectedStudent) return;

    const newPayment: Payment = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      amount: formData.amount,
      currency: formData.currency,
      paymentMethod: formData.paymentMethod,
      paymentDate: formData.paymentDate,
      description: formData.description,
      invoiceNumber: `INV-${Date.now()}`,
      status: 'completed'
    };

    onAddPayment(newPayment);
    onUpdateStudentBalance(formData.studentId, selectedStudent.paidAmount + formData.amount);

    // Show receipt after payment is added
    setSelectedPayment(newPayment);
    setShowReceiptModal(true);
    setShowModal(false);
    setFormData({
      studentId: '',
      amount: 0,
      currency: 'USD',
      paymentMethod: 'cash',
      description: '',
      paymentDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const suggestedCurrency = suggestCurrency(amount);
    setFormData({
      ...formData,
      amount,
      currency: suggestedCurrency as Currency
    });
  };

  const handlePrintReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const printReceipt = () => {
    window.print();
  };

  const getSelectedStudent = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  const totalPaymentsByCurrency = payments
    .filter(payment => payment.status === 'completed')
    .reduce((acc, payment) => {
      acc[payment.currency] = (acc[payment.currency] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyPaymentsByCurrency = payments
    .filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      const currentMonth = new Date().getMonth();
      return paymentDate.getMonth() === currentMonth;
    })
    .reduce((acc, payment) => {
      acc[payment.currency] = (acc[payment.currency] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Analysis</h1>
            <p className="text-gray-600">Process payments and track transaction history</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Pay</span>
          </button>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(totalPaymentsByCurrency).map(([currency, amount]) => (
                <div key={currency} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{currency}:</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(amount, currency as Currency)}</span>
                </div>
              ))}
              {Object.keys(totalPaymentsByCurrency).length === 0 && (
                <p className="text-lg font-bold text-gray-900">{formatCurrency(0)}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">This Month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(monthlyPaymentsByCurrency).map(([currency, amount]) => (
                <div key={currency} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{currency}:</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(amount, currency as Currency)}</span>
                </div>
              ))}
              {Object.keys(monthlyPaymentsByCurrency).length === 0 && (
                <p className="text-lg font-bold text-gray-900">{formatCurrency(0)}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
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
                placeholder="Search payments..."
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-blue-600" />
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
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.invoiceNumber}
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Payment</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                    <input
                      type="text"
                      placeholder="Search student by name, admission # or class"
                      value={studentQuery}
                      onChange={(e) => {
                        setStudentQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {/* Suggestions dropdown */}
                    {showSuggestions && studentQuery.trim().length > 0 && (
                      <ul className="absolute z-40 left-0 right-0 bg-white border border-gray-200 rounded shadow max-h-60 overflow-auto mt-1">
                        {students
                          .filter(s => {
                            const q = studentQuery.toLowerCase();
                            const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                            const admission = (s.admissionNumber || '').toLowerCase();
                            const cls = (s.class || '').toLowerCase();
                            return fullName.includes(q) || admission.includes(q) || cls.includes(q);
                          })
                          .slice(0, 20)
                          .map(s => (
                            <li
                              key={s.id}
                              onClick={() => {
                                setFormData({ ...formData, studentId: s.id });
                                setStudentQuery(`${s.firstName} ${s.lastName} • ${s.class}`);
                                setShowSuggestions(false);
                              }}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            >
                              <div className="font-medium">{s.firstName} {s.lastName}</div>
                              <div className="text-xs text-gray-500">{s.admissionNumber || ''} • {s.class}</div>
                            </li>
                          ))}
                        {students.filter(s => {
                          const q = studentQuery.toLowerCase();
                          const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                          const admission = (s.admissionNumber || '').toLowerCase();
                          const cls = (s.class || '').toLowerCase();
                          return fullName.includes(q) || admission.includes(q) || cls.includes(q);
                        }).length === 0 && (
                          <li className="px-3 py-2 text-sm text-gray-500">No students found</li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formData.amount || ''}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="ZAR">ZAR (R)</option>
                        <option value="ZiG">ZiG (Z)</option>
                      </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      required
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Tuition Fee - January"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
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
      </div>
      {/* Payment Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
                <div className="space-x-2">
                  <button
                    onClick={printReceipt}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Receipt Content */}
              <div className="bg-white border-2 border-gray-200 p-8 print:border-0 print:p-0">
                <div className="text-center mb-8">
                  <div className="bg-blue-600 p-3 rounded-full inline-block mb-4">
                    <Receipt className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">PAYMENT RECEIPT</h1>
                  <p className="text-gray-600">Lutumba Adventist Secondary School</p>
                  <p className="text-gray-600">P O BOX 20 ,  Lutumba, Beitbridge , Zimbabwe</p>
                  <p className="text-gray-600">Phone: +263 77 362 7813</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Receipt Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Receipt No:</span>
                        <span className="font-semibold">RCP-{selectedPayment.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="font-semibold">{formatDate(selectedPayment.paymentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-semibold capitalize">{selectedPayment.paymentMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                          {selectedPayment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student Name:</span>
                        <span className="font-semibold">{selectedPayment.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student ID:</span>
                        <span className="font-semibold">{selectedPayment.studentId}</span>
                      </div>
                      {getSelectedStudent(selectedPayment.studentId) && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Class:</span>
                            <span className="font-semibold">{getSelectedStudent(selectedPayment.studentId)?.class}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-semibold text-sm">{getSelectedStudent(selectedPayment.studentId)?.email}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-semibold">{selectedPayment.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-semibold">{selectedPayment.invoiceNumber}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-gray-900">Amount Paid:</span>
                        <span className="text-3xl font-bold text-green-600">{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {getSelectedStudent(selectedPayment.studentId) && (
                  <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Fees</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(getSelectedStudent(selectedPayment.studentId)!.totalFees)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Paid</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(getSelectedStudent(selectedPayment.studentId)!.paidAmount)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Outstanding Balance</p>
                        <p className={`text-lg font-bold ${getSelectedStudent(selectedPayment.studentId)!.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(getSelectedStudent(selectedPayment.studentId)!.outstandingBalance)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Thank you for your payment!</p>
                  <p className="text-sm text-gray-600">For questions about this receipt, please contact our finance office.</p>
                  <p className="text-sm text-gray-600">Email: lutumba@gmail.com | Phone: +263 77 362 7813</p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>This is an official receipt generated on {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;