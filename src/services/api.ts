const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Transform database student to frontend format
const transformStudent = (dbStudent: any) => ({
  id: dbStudent.id.toString(),
  firstName: dbStudent.first_name,
  lastName: dbStudent.last_name,
  email: dbStudent.email,
  phone: dbStudent.phone,
  class: dbStudent.class,
  status: dbStudent.status,
  enrollmentDate: dbStudent.enrollment_date,
  totalFees: parseFloat(dbStudent.total_fees) || 0,
  paidAmount: parseFloat(dbStudent.paid_amount) || 0,
  outstandingBalance: parseFloat(dbStudent.outstanding_balance) || 0,
  address: dbStudent.address,
  parentName: dbStudent.parent_name,
  parentPhone: dbStudent.parent_phone,
  dateOfBirth: dbStudent.date_of_birth,
  gender: dbStudent.gender,
  admissionNumber: dbStudent.admission_number,
  dateOfAdmission: dbStudent.date_of_admission,
  academicYear: dbStudent.academic_year,
  medicalNotes: dbStudent.medical_notes,
  documents: dbStudent.documents || []
});

// Transform frontend student to database format
const transformStudentForDB = (student: any) => ({
  firstName: student.firstName,
  lastName: student.lastName,
  email: student.email,
  phone: student.phone,
  class: student.class,
  status: student.status,
  enrollmentDate: student.enrollmentDate,
  totalFees: student.totalFees,
  paidAmount: student.paidAmount,
  outstandingBalance: student.outstandingBalance,
  address: student.address,
  parentName: student.parentName,
  parentPhone: student.parentPhone,
  dateOfBirth: student.dateOfBirth,
  gender: student.gender,
  admissionNumber: student.admissionNumber,
  dateOfAdmission: student.dateOfAdmission,
  academicYear: student.academicYear,
  medicalNotes: student.medicalNotes,
  documents: student.documents
});

// Transform database payment to frontend format
const transformPayment = (dbPayment: any) => ({
  id: dbPayment.id.toString(),
  studentId: dbPayment.student_id.toString(),
  studentName: dbPayment.student_name,
  amount: parseFloat(dbPayment.amount),
  currency: dbPayment.currency,
  paymentMethod: dbPayment.payment_method,
  paymentDate: dbPayment.payment_date,
  description: dbPayment.description,
  invoiceNumber: dbPayment.invoice_number,
  status: dbPayment.status,
  accountId: dbPayment.account_id,
  allocations: dbPayment.allocations ? JSON.parse(dbPayment.allocations) : null
});

// Transform frontend payment to database format
const transformPaymentForDB = (payment: any) => ({
  studentId: payment.studentId,
  studentName: payment.studentName,
  amount: payment.amount,
  currency: payment.currency,
  paymentMethod: payment.paymentMethod,
  paymentDate: payment.paymentDate,
  description: payment.description,
  invoiceNumber: payment.invoiceNumber,
  status: payment.status,
  accountId: payment.accountId,
  allocations: payment.allocations ? JSON.stringify(payment.allocations) : null
});

// Students API
export const studentsApi = {
  getAll: async () => {
    const students = await apiRequest('/students');
    return students.map(transformStudent);
  },
  getById: async (id: string) => {
    const student = await apiRequest(`/students/${id}`);
    return transformStudent(student);
  },
  create: async (data: any) => {
    const dbData = transformStudentForDB(data);
    const result = await apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(dbData),
    });
    return transformStudent({ id: result.studentId, ...dbData });
  },
  update: async (id: string, data: any) => {
    const dbData = transformStudentForDB(data);
    await apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbData),
    });
    return transformStudent({ id, ...dbData });
  },
  delete: async (id: string) => {
    await apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payments API
export const paymentsApi = {
  getAll: async () => {
    const payments = await apiRequest('/payments');
    return payments.map(transformPayment);
  },
  getByStudentId: async (studentId: string) => {
    const payments = await apiRequest(`/payments/student/${studentId}`);
    return payments.map(transformPayment);
  },
  create: async (data: any) => {
    const dbData = transformPaymentForDB(data);
    const result = await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(dbData),
    });

    // Return a payment object with camelCase fields so the frontend has the paymentDate immediately
    return {
      id: String(result.paymentId),
      studentId: dbData.studentId,
      studentName: dbData.studentName,
      amount: dbData.amount,
      currency: dbData.currency,
      paymentMethod: dbData.paymentMethod,
      paymentDate: dbData.paymentDate,
      description: dbData.description,
      invoiceNumber: dbData.invoiceNumber,
      status: dbData.status || 'completed',
      accountId: dbData.accountId,
      allocations: dbData.allocations ? JSON.parse(dbData.allocations) : null
    } as any;
  },
  update: async (id: string, data: any) => {
    const dbData = transformPaymentForDB(data);
    await apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbData),
    });

    return {
      id,
      studentId: dbData.studentId,
      studentName: dbData.studentName,
      amount: dbData.amount,
      currency: dbData.currency,
      paymentMethod: dbData.paymentMethod,
      paymentDate: dbData.paymentDate,
      description: dbData.description,
      invoiceNumber: dbData.invoiceNumber,
      status: dbData.status,
      accountId: dbData.accountId,
      allocations: dbData.allocations ? JSON.parse(dbData.allocations) : null
    } as any;
  },
  delete: async (id: string) => {
    await apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    });
  },
  getDailyPayments: async () => {
    const payments = await apiRequest('/payments/daily/today');
    return payments.map(transformPayment);
  },
};

// Transform database expense to frontend format
const transformExpense = (dbExpense: any) => ({
  id: dbExpense.id.toString(),
  description: dbExpense.description,
  amount: parseFloat(dbExpense.amount),
  currency: dbExpense.currency,
  category: dbExpense.category,
  date: dbExpense.date,
  paymentMethod: dbExpense.payment_method,
  createdAt: dbExpense.created_at,
  updatedAt: dbExpense.updated_at,
  accountId: dbExpense.account_id,
  allocationCategory: dbExpense.allocation_category
});

// Transform frontend expense to database format
const transformExpenseForDB = (expense: any) => ({
  description: expense.description,
  amount: expense.amount,
  currency: expense.currency,
  category: expense.category,
  date: expense.date,
  paymentMethod: expense.paymentMethod,
  accountId: expense.accountId,
  allocationCategory: expense.allocationCategory
});

// Expenses API
export const expensesApi = {
  getAll: async () => {
    try {
      const expenses = await apiRequest('/expenses');
      return expenses.map(transformExpense);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      return [];
    }
  },
  getById: async (id: string) => {
    const expense = await apiRequest(`/expenses/${id}`);
    return transformExpense(expense);
  },
  create: async (data: any) => {
    const dbData = transformExpenseForDB(data);
    const result = await apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(dbData),
    });
    
    return {
      id: String(result.expenseId),
      description: dbData.description,
      amount: dbData.amount,
      currency: dbData.currency,
      category: dbData.category,
      date: dbData.date,
      paymentMethod: dbData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accountId: dbData.accountId,
      allocationCategory: dbData.allocationCategory
    } as any;
  },
  update: async (id: string, data: any) => {
    const dbData = transformExpenseForDB(data);
    await apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbData),
    });
    
    return {
      id,
      description: dbData.description,
      amount: dbData.amount,
      currency: dbData.currency,
      category: dbData.category,
      date: dbData.date,
      paymentMethod: dbData.paymentMethod,
      createdAt: data.createdAt,
      updatedAt: new Date().toISOString(),
      accountId: dbData.accountId,
      allocationCategory: dbData.allocationCategory
    } as any;
  },
  delete: async (id: string) => {
    await apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = () => apiRequest('/health');

export default {
  students: studentsApi,
  payments: paymentsApi,
  expenses: expensesApi,
  health: healthCheck,
};