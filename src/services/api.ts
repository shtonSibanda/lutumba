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
  status: dbPayment.status
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
  status: payment.status
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
    return transformPayment({ id: result.paymentId, ...dbData });
  },
  update: async (id: string, data: any) => {
    const dbData = transformPaymentForDB(data);
    await apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbData),
    });
    return transformPayment({ id, ...dbData });
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

// Health check
export const healthCheck = () => apiRequest('/health');

export default {
  students: studentsApi,
  payments: paymentsApi,
  health: healthCheck,
}; 