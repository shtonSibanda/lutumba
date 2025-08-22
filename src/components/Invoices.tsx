import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, Calendar, User } from 'lucide-react';
import { Invoice, Student, InvoiceItem } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/calculations';

interface InvoicesProps {
  invoices: Invoice[];
  students: Student[];
  onAddInvoice: (invoice: Invoice) => void;
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, students, onAddInvoice }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
  studentId: '',
  dueDate: '',
  currency: 'USD',
  items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[]
  });
  const [mode, setMode] = useState<'student' | 'class'>('student');
  const [studentQuery, setStudentQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const classes = Array.from(new Set(students.map(s => s.class).filter(Boolean)));

  const filteredInvoices = invoices.filter(invoice =>
    invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const calculateTotal = () => {
  return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'student') {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      if (!selectedStudent) return;

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${Date.now()}`,
        studentId: formData.studentId,
        studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        amount: calculateTotal(),
        dueDate: formData.dueDate,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'unpaid',
        items: formData.items
      };

      onAddInvoice(newInvoice);
    } else {
      // class mode - formData.studentId holds the class name
      const className = formData.studentId;
      if (!className) return;
      const studentsInClass = students.filter(s => s.class === className);

      for (const s of studentsInClass) {
        const newInvoice: Invoice = {
          id: Date.now().toString() + '-' + s.id,
          invoiceNumber: `INV-${Date.now()}-${s.id}`,
          studentId: s.id,
          studentName: `${s.firstName} ${s.lastName}`,
          amount: calculateTotal(),
          dueDate: formData.dueDate,
          issueDate: new Date().toISOString().split('T')[0],
          status: 'unpaid',
          items: formData.items
        };

        onAddInvoice(newInvoice);
      }
    }

    setShowModal(false);
    setFormData({
      studentId: '',
      dueDate: '',
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const handlePrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintModal(true);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Generate and manage student invoices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-600">{invoice.studentName}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Issue Date:</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Due Date:</span>
                <span className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
              <div className="space-y-1">
                {invoice.items.slice(0, 2).map((item, index) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate">{item.description}</span>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                ))}
                {invoice.items.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{invoice.items.length - 2} more items
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handlePrint(invoice)}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        ))}
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Invoice</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="mode" checked={mode === 'student'} onChange={() => setMode('student')} />
                    <span className="text-sm">Single Student</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="mode" checked={mode === 'class'} onChange={() => setMode('class')} />
                    <span className="text-sm">By Class</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{mode === 'student' ? 'Student' : 'Class'}</label>
                    {mode === 'student' ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search student by name, admission # or class"
                          value={studentQuery}
                          onChange={(e) => { setStudentQuery(e.target.value); setShowSuggestions(true); }}
                          onFocus={() => setShowSuggestions(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {showSuggestions && studentQuery.trim().length > 0 && (
                          <ul className="absolute z-40 left-0 right-0 bg-white border border-gray-200 rounded shadow max-h-60 overflow-auto mt-1">
                            {students.filter(s => {
                              const q = studentQuery.toLowerCase();
                              const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                              const admission = (s.admissionNumber || '').toLowerCase();
                              const cls = (s.class || '').toLowerCase();
                              return fullName.includes(q) || admission.includes(q) || cls.includes(q);
                            }).slice(0, 20).map(s => (
                              <li key={s.id} onClick={() => { setFormData({ ...formData, studentId: s.id }); setStudentQuery(`${s.firstName} ${s.lastName} • ${s.class}`); setShowSuggestions(false); }} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
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
                    ) : (
                      <select value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select class</option>
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="ZiG">ZiG (Z)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Description"
                            required
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Unit Price"
                            min="0"
                            step="0.01"
                            required
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{formatCurrency(item.total, formData.currency)}</span>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(calculateTotal(), formData.currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Create Invoice
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

      {/* Print Preview Modal */}
      {showPrintModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
                <div className="space-x-2">
                  <button
                    onClick={printInvoice}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="bg-white border-2 border-gray-200 p-8 print:border-0 print:p-0">
                <div className="mb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-600 mb-2">INVOICE</h1>
                      <p className="text-gray-600">Lutumba Adventist Secondary School</p>
                      <p className="text-gray-600">P O BOX 20 ,  Lutumba, Beitbridge</p>
                      <p className="text-gray-600">Zimbabwe</p>
                      <p className="text-gray-600">Phone: +263 77 362 7813</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{selectedInvoice.invoiceNumber}</p>
                      <p className="text-gray-600">Issue Date: {formatDate(selectedInvoice.issueDate)}</p>
                      <p className="text-gray-600">Due Date: {formatDate(selectedInvoice.dueDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{selectedInvoice.studentName}</p>
                    <p className="text-gray-600">Student ID: {selectedInvoice.studentId}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 font-semibold">Description</th>
                        <th className="text-center py-3 font-semibold">Quantity</th>
                        <th className="text-right py-3 font-semibold">Unit Price</th>
                        <th className="text-right py-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3">{item.description}</td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 text-right font-semibold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(selectedInvoice.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Instructions:</h4>
                      <p className="text-sm text-gray-600 mb-1">Bank: Excellence Bank</p>
                      <p className="text-sm text-gray-600 mb-1">Account: 123-456-789</p>
                      <p className="text-sm text-gray-600">Reference: {selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Thank you for choosing Lutumba Adventist Secondary School!</p>
                      <p className="text-sm text-gray-600">For questions, contact us at lutumba@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;