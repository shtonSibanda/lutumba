export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  classSection?: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  enrollmentDate: string;
  totalFees: number;
  paidAmount: number;
  totalFeesCurrency?: Currency;
  paidAmountCurrency?: Currency;
  outstandingBalance: number;
  address: string;
  parentName: string;
  parentPhone: string;
  // New fields
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  admissionNumber?: string;
  dateOfAdmission?: string;
  academicYear?: string;
  medicalNotes?: string;
  documents?: StudentDocument[];
}

export type Currency = 'USD' | 'ZAR' | 'ZiG';

export interface ExchangeRate {
  USD: number;
  ZAR: number;
  ZiG: number;
}

export interface PaymentAllocation {
  category: string;
  percentage: number;
  amount: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: Currency;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  paymentDate: string;
  description: string;
  invoiceNumber: string;
  status: 'completed' | 'pending' | 'failed';
  accountId?: string;
  allocations?: PaymentAllocation[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CurrencyBreakdown {
  USD: number;
  ZAR: number;
  ZiG: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  outstandingAmount: number;
  totalStudents: number;
  activeStudents: number;
  recentPayments: Payment[];
  totalRevenueByCurrency: CurrencyBreakdown;
  monthlyRevenueByCurrency: CurrencyBreakdown;
  dailyRevenueByCurrency: CurrencyBreakdown;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'finance' | 'parent';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: User['role'];
}

export interface StudentDocument {
  id: string;
  type: 'id' | 'birth_certificate' | 'transfer_letter' | 'other';
  name: string;
  url: string;
}

export interface FeeStructure {
  id: string;
  name: string;
  class: string;
  academicYear: string;
  items: FeeItem[];
}

export interface FeeItem {
  id: string;
  description: string;
  amount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  subject: string;
  term: string;
  year: string;
  score: number;
  maxScore: number;
  teacherComment?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'teacher' | 'finance' | 'bursar' | 'other';
  position?: string;
  status: 'active' | 'inactive';
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  category: string;
  date: string;
  paymentMethod: 'cash' | 'check' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
  accountId?: string;
  allocationCategory?: string;
}

export interface ExpenseSummary {
  categorySummary: { [key: string]: number };
  totalExpensesByCurrency: CurrencyBreakdown;
  monthlyExpensesByCurrency: CurrencyBreakdown;
}

export interface SystemSettings {
  schoolName: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  academicYear: string;
  currentTerm: string;
}