import React, { useState, useEffect } from 'react';
import { BarChart3, Users, CreditCard, FileText, GraduationCap, TrendingDown } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import SchoolLogo from './components/SchoolLogo';
import DashboardSelection from './components/DashboardSelection';
import USDDashboard from './components/USDDashboard';
import ZARDashboard from './components/ZARDashboard';
import ZiGDashboard from './components/ZiGDashboard';
import Students from './components/Students';
import PaymentAccountSelection from './components/PaymentAccountSelection';
import PaymentAccountPanel from './components/PaymentAccountPanel';
import Expenses from './components/Expenses';
import Invoices from './components/Invoices';
import FeeStructures from './components/FeeStructures';
import Defaulters from './components/Defaulters';
import Attendance from './components/Attendance';
import Academics from './components/Academics';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Student, Payment, Invoice, Expense, Currency, Staff, StaffAttendanceRecord } from './types';
import { PaymentAccount } from './components/PaymentAccountSelection';
import { sampleStudents, samplePayments, sampleInvoices, sampleAttendanceRecords, sampleExamResults, sampleStaffAttendanceRecords, sampleSystemSettings, sampleStaff, sampleExpenses } from './utils/sampleData';
import { calculateFinancialSummary, calculateExpenseSummary } from './utils/calculations';
import { studentsApi, paymentsApi, expensesApi } from './services/api';

type ActiveTab = 'dashboard' | 'students' | 'payments' | 'expenses' | 'invoices' | 'feeStructures' | 'defaulters' | 'attendance' | 'academics' | 'staff' | 'staffAttendance' | 'reports' | 'settings';
type DashboardView = 'selection' | 'USD' | 'ZAR' | 'ZiG';
type PaymentView = 'selection' | 'account';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(sampleAttendanceRecords);
  const [examResults, setExamResults] = useState(sampleExamResults);
  const [staffAttendanceRecords, setStaffAttendanceRecords] = useState<StaffAttendanceRecord[]>(sampleStaffAttendanceRecords);
  const [systemSettings, setSystemSettings] = useState(sampleSystemSettings);
  const [staff] = useState<Staff[]>(sampleStaff);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dashboardView, setDashboardView] = useState<DashboardView>('selection');
  const [paymentView, setPaymentView] = useState<PaymentView>('selection');
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useState<PaymentAccount | null>(null);

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, paymentsData, expensesData] = await Promise.all([
          studentsApi.getAll(),
          paymentsApi.getAll(),
          expensesApi.getAll()
        ]);
        setStudents(studentsData);
        setPayments(paymentsData);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to sample data if API fails
        setStudents(sampleStudents);
        setPayments(samplePayments);
        setExpenses(sampleExpenses);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const financialSummary = calculateFinancialSummary(students, payments, expenses);
  const expenseSummary = calculateExpenseSummary(expenses);

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      await studentsApi.update(updatedStudent.id, updatedStudent);
      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    } catch (error) {
      console.error('Failed to update student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await studentsApi.delete(studentId);
      setStudents(students.filter(s => s.id !== studentId));
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    try {
      const createdStudent = await studentsApi.create(newStudent);
      // Update students list without causing a re-render of the entire page
      setStudents(prevStudents => {
        const updatedStudents = [...prevStudents];
        updatedStudents.push(createdStudent);
        return updatedStudents;
      });
      return createdStudent; // Return the created student for the component to handle
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  };

  const handleAddPayment = async (newPayment: Payment) => {
    try {
      const createdPayment = await paymentsApi.create(newPayment);
      setPayments([...payments, createdPayment]);
      
      // Update student balance
      const student = students.find(s => s.id === newPayment.studentId);
      if (student) {
        const newPaidAmount = student.paidAmount + newPayment.amount;
        const updatedStudent = {
          ...student,
          paidAmount: newPaidAmount,
          outstandingBalance: Math.max(0, student.totalFees - newPaidAmount)
        };
        await studentsApi.update(student.id, updatedStudent);
        setStudents(students.map(s => s.id === student.id ? updatedStudent : s));
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
      alert('Failed to add payment. Please try again.');
    }
  };

  const handleUpdateStudentBalance = (studentId: string, newPaidAmount: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, paidAmount: newPaidAmount, outstandingBalance: student.totalFees - newPaidAmount }
        : student
    ));
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices([...invoices, newInvoice]);
  };

  const handleMarkAttendance = (newRecords: import('./types').AttendanceRecord[]) => {
    setAttendanceRecords((prev: import('./types').AttendanceRecord[]) => {
      // Remove existing records for the same students and date, then add new
      const ids = newRecords.map((r: import('./types').AttendanceRecord) => r.studentId + r.date);
      const filtered = prev.filter((r: import('./types').AttendanceRecord) => !ids.includes(r.studentId + r.date));
      return [...filtered, ...newRecords];
    });
  };

  const handleAddResult = (result: any) => {
    setExamResults(prev => [...prev, result]);
  };

  const handleUpdateSettings = (newSettings: any) => {
    setSystemSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleMarkStaffAttendance = (newRecords: any) => {
    setStaffAttendanceRecords(prev => {
      const ids = newRecords.map((r: any) => r.staffId + r.date);
      const filtered = prev.filter((r: any) => !ids.includes(r.staffId + r.date));
      return [...filtered, ...newRecords];
    });
  };

  const handleAddExpense = async (newExpense: Expense) => {
    try {
      const createdExpense = await expensesApi.create(newExpense);
      setExpenses([...expenses, createdExpense]);
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await expensesApi.update(updatedExpense.id, updatedExpense);
      setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    } catch (error) {
      console.error('Failed to update expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await expensesApi.delete(expenseId);
      setExpenses(expenses.filter(e => e.id !== expenseId));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  // Handle deduction from allocation when expense is added
  const handleDeductFromAllocation = async (accountId: string, allocationCategory: string, amount: number, currency: Currency) => {
    // Use the first available student ID to satisfy the foreign key constraint
    const firstStudent = students.length > 0 ? students[0] : null;
    if (!firstStudent) {
      alert('No students found. Cannot create expense deduction.');
      return;
    }

    // Create a deduction record by adding a negative payment to represent the expense deduction
    const deductionPayment: Payment = {
      id: `deduction-${Date.now()}`,
      studentId: firstStudent.id,
      studentName: 'System Deduction',
      amount: -amount, // Negative amount to represent deduction
      currency: currency,
      paymentMethod: 'bank_transfer',
      paymentDate: new Date().toISOString().split('T')[0],
      description: `Expense deduction from ${allocationCategory}`,
      invoiceNumber: `DED-${Date.now()}`,
      status: 'completed',
      accountId: accountId,
      allocations: [{
        category: allocationCategory,
        percentage: 100,
        amount: amount
      }]
    };

    // Add the deduction to payments to reflect the reduced balance
    try {
      const createdDeduction = await paymentsApi.create(deductionPayment);
      setPayments(prevPayments => [...prevPayments, createdDeduction]);
      console.log(`Deducted ${amount} ${currency} from ${allocationCategory} in account ${accountId}`);
    } catch (error) {
      console.error('Failed to save deduction:', error);
      alert('Failed to record expense deduction. Please try again.');
    }
  };

  const handleSelectCurrency = (currency: Currency) => {
    setDashboardView(currency);
  };

  const handleBackToDashboard = () => {
    setDashboardView('selection');
  };

  const handleSelectPaymentAccount = (account: PaymentAccount) => {
    setSelectedPaymentAccount(account);
    setPaymentView('account');
  };

  const handleBackToPaymentSelection = () => {
    setPaymentView('selection');
    setSelectedPaymentAccount(null);
  };

  // Define navigation items with role-based access
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      allowedRoles: ['admin', 'finance', 'teacher', 'parent'] as const
    },
    { 
      id: 'students', 
      label: 'Students', 
      icon: Users,
      allowedRoles: ['admin', 'teacher'] as const
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: CreditCard,
      allowedRoles: ['admin', 'finance'] as const
    },
    { 
      id: 'expenses', 
      label: 'Expenses', 
      icon: TrendingDown,
      allowedRoles: ['admin', 'finance'] as const
    },
    { 
      id: 'invoices', 
      label: 'Invoices', 
      icon: FileText,
      allowedRoles: ['admin', 'finance'] as const
    },
    {
      id: 'feeStructures',
      label: 'Fee Structures',
      icon: FileText, // You can use a different icon if desired
      allowedRoles: ['admin', 'finance'] as const
    },
    {
      id: 'defaulters',
      label: 'Defaulters',
      icon: Users, // You can use a different icon if desired
      allowedRoles: ['admin', 'finance'] as const
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: GraduationCap,
      allowedRoles: ['admin', 'teacher'] as const
    },
    {
      id: 'academics',
      label: 'Academics',
      icon: GraduationCap,
      allowedRoles: ['admin', 'teacher'] as const
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      allowedRoles: ['admin', 'finance'] as const
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Users,
      allowedRoles: ['admin'] as const
    },
  ];

  // Filter navigation items based on user role
  const accessibleNavItems = navItems.filter(item => 
    item.allowedRoles.includes(user?.role as any)
  );

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <SchoolLogo size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lutumba Adventist</h1>
              <p className="text-sm text-gray-600">Secondary School</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          {accessibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">{settings.contactEmail ? `Contact: ${settings.contactEmail}` : 'Educating for Eternity, Welcome Back'}</p>
            </div>
            <UserProfile user={user} />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <ProtectedRoute allowedRoles={['admin', 'finance', 'teacher', 'parent']} user={user}>
              {dashboardView === 'selection' && (
                <DashboardSelection onSelectCurrency={handleSelectCurrency} />
              )}
              {dashboardView === 'USD' && (
                <USDDashboard 
                  financialSummary={financialSummary} 
                  students={students} 
                  payments={payments} 
                  expenses={expenses}
                  onBack={handleBackToDashboard}
                />
              )}
              {dashboardView === 'ZAR' && (
                <ZARDashboard 
                  financialSummary={financialSummary} 
                  students={students} 
                  payments={payments} 
                  expenses={expenses}
                  onBack={handleBackToDashboard}
                />
              )}
              {dashboardView === 'ZiG' && (
                <ZiGDashboard 
                  financialSummary={financialSummary} 
                  students={students} 
                  payments={payments} 
                  expenses={expenses}
                  onBack={handleBackToDashboard}
                />
              )}
            </ProtectedRoute>
          )}
          {activeTab === 'students' && (
            <ProtectedRoute allowedRoles={['admin', 'teacher']} user={user}>
              <Students
                students={students}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onAddStudent={handleAddStudent}
                payments={payments}
              />
            </ProtectedRoute>
          )}
          {activeTab === 'payments' && (
            <ProtectedRoute allowedRoles={['admin', 'finance']} user={user}>
              {paymentView === 'selection' && (
                <PaymentAccountSelection onSelectAccount={handleSelectPaymentAccount} />
              )}
              {paymentView === 'account' && selectedPaymentAccount && (
                <PaymentAccountPanel
                  account={selectedPaymentAccount}
                  payments={payments}
                  students={students}
                  expenses={expenses}
                  onAddPayment={handleAddPayment}
                  onUpdateStudentBalance={handleUpdateStudentBalance}
                  onBack={handleBackToPaymentSelection}
                />
              )}
            </ProtectedRoute>
          )}
          {activeTab === 'expenses' && (
            <ProtectedRoute allowedRoles={['admin', 'finance']} user={user}>
              <Expenses
                expenses={expenses}
                payments={payments}
                expenseSummary={expenseSummary}
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
                onDeductFromAllocation={handleDeductFromAllocation}
              />
            </ProtectedRoute>
          )}
          {activeTab === 'invoices' && (
            <ProtectedRoute allowedRoles={['admin', 'finance']} user={user}>
              <Invoices
                invoices={invoices}
                students={students}
                onAddInvoice={handleAddInvoice}
              />
            </ProtectedRoute>
          )}
          {activeTab === 'feeStructures' && (
            <ProtectedRoute allowedRoles={['admin', 'finance']} user={user}>
              <FeeStructures />
            </ProtectedRoute>
          )}
          {activeTab === 'defaulters' && (
            <ProtectedRoute allowedRoles={['admin', 'finance']} user={user}>
              <Defaulters students={students} payments={payments} />
            </ProtectedRoute>
          )}
          {activeTab === 'attendance' && (
            <ProtectedRoute allowedRoles={['admin', 'teacher']} user={user}>
              <Attendance
                students={students}
                attendanceRecords={attendanceRecords}
                onMarkAttendance={handleMarkAttendance}
                staff={staff}
                staffAttendanceRecords={staffAttendanceRecords}
                onMarkStaffAttendance={handleMarkStaffAttendance}
              />
            </ProtectedRoute>
          )}
          {activeTab === 'academics' && (
            <ProtectedRoute allowedRoles={['admin', 'teacher']} user={user}>
              <Academics
                students={students}
                examResults={examResults}
                onAddResult={handleAddResult}
              />
            </ProtectedRoute>
          )}
          {activeTab === 'reports' && (
            <ProtectedRoute allowedRoles={['admin', 'finance']} user={user}>
              <Reports
                students={students}
                payments={payments}
                attendanceRecords={attendanceRecords}
                examResults={examResults}
              />
            </ProtectedRoute>
          )}
          {activeTab === 'settings' && (
            <ProtectedRoute allowedRoles={['admin']} user={user}>
              <Settings
                settings={systemSettings}
                onUpdateSettings={handleUpdateSettings}
                allData={{
                  students,
                  payments,
                  attendanceRecords,
                  examResults,
                  staffAttendanceRecords
                }}
              />
            </ProtectedRoute>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider initialSettings={sampleSystemSettings}>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;