import { Student, Payment, Invoice, AttendanceRecord, Expense, Staff, StaffAttendanceRecord } from '../types';

export const sampleStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    class: 'Grade 10A',
    status: 'active',
    enrollmentDate: '2024-09-01',
    totalFees: 0,
    paidAmount: 0,
    outstandingBalance: 0,
    address: '123 Main St, Cityville, ST 12345',
    parentName: 'Michael Smith',
    parentPhone: '+1 (555) 123-4568'
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1 (555) 234-5678',
    class: 'Grade 9B',
    status: 'active',
    enrollmentDate: '2024-08-28',
    totalFees: 0,
    paidAmount: 0,
    outstandingBalance: 0,
    address: '456 Oak Ave, Townsburg, ST 23456',
    parentName: 'Sarah Johnson',
    parentPhone: '+1 (555) 234-5679'
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Williams',
    email: 'david.williams@email.com',
    phone: '+1 (555) 345-6789',
    class: 'Grade 11C',
    status: 'suspended',
    enrollmentDate: '2024-09-03',
    totalFees: 0,
    paidAmount: 0,
    outstandingBalance: 0,
    address: '789 Pine Rd, Villageton, ST 34567',
    parentName: 'Robert Williams',
    parentPhone: '+1 (555) 345-6790'
  },
  {
    id: '4',
    firstName: 'Sophia',
    lastName: 'Brown',
    email: 'sophia.brown@email.com',
    phone: '+1 (555) 456-7890',
    class: 'Grade 8A',
    status: 'active',
    enrollmentDate: '2024-08-30',
    totalFees: 0,
    paidAmount: 0,
    outstandingBalance: 0,
    address: '321 Elm St, Hamlet City, ST 45678',
    parentName: 'Lisa Brown',
    parentPhone: '+1 (555) 456-7891'
  }
];

export const samplePayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    amount: 5000,
    currency: 'ZAR',
    paymentMethod: 'bank_transfer',
    paymentDate: '2024-01-15',
    description: 'Tuition payment',
    invoiceNumber: 'INV-001',
    status: 'completed',
    accountId: '406'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Emma Johnson',
    amount: 3000,
    currency: 'ZAR',
    paymentMethod: 'cash',
    paymentDate: '2024-01-20',
    description: 'Tuition payment',
    invoiceNumber: 'INV-002',
    status: 'completed',
    accountId: '406'
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'John Smith',
    amount: 1000,
    currency: 'USD',
    paymentMethod: 'card',
    paymentDate: '2024-01-25',
    description: 'Project fee',
    invoiceNumber: 'INV-003',
    status: 'completed',
    accountId: '408'
  },
  {
    id: '4',
    studentId: '3',
    studentName: 'David Williams',
    amount: 2500,
    currency: 'ZAR',
    paymentMethod: 'bank_transfer',
    paymentDate: '2024-01-30',
    description: 'Project funding',
    invoiceNumber: 'INV-004',
    status: 'completed',
    accountId: '408'
  }
];

export const sampleInvoices: Invoice[] = [];

export const sampleFeeStructures = [
  {
    id: '1',
    name: 'Primary School Fees',
    class: 'Grade 1',
    academicYear: '2024',
    items: [
      { id: '1', description: 'Tuition', amount: 200 },
      { id: '2', description: 'Books', amount: 50 },
      { id: '3', description: 'Uniform', amount: 30 }
    ]
  },
  {
    id: '2',
    name: 'Primary School Fees',
    class: 'Grade 2',
    academicYear: '2024',
    items: [
      { id: '1', description: 'Tuition', amount: 220 },
      { id: '2', description: 'Books', amount: 55 },
      { id: '3', description: 'Uniform', amount: 35 }
    ]
  }
];

export const sampleAttendanceRecords: AttendanceRecord[] = [
  { id: '1', studentId: '1', date: '2024-05-01', status: 'present' },
  { id: '2', studentId: '2', date: '2024-05-01', status: 'absent', notes: 'Sick' },
  { id: '3', studentId: '1', date: '2024-05-02', status: 'late', notes: 'Arrived late' },
  { id: '4', studentId: '2', date: '2024-05-02', status: 'present' }
];

export const sampleExamResults = [
  { id: '1', studentId: '1', subject: 'Mathematics', term: 'Term 1', year: '2024', score: 85, maxScore: 100, teacherComment: 'Good progress' },
  { id: '2', studentId: '1', subject: 'English', term: 'Term 1', year: '2024', score: 78, maxScore: 100 },
  { id: '3', studentId: '2', subject: 'Mathematics', term: 'Term 1', year: '2024', score: 92, maxScore: 100, teacherComment: 'Excellent' },
  { id: '4', studentId: '2', subject: 'English', term: 'Term 1', year: '2024', score: 88, maxScore: 100 }
];

export const sampleStaff: Staff[] = [
  { id: '1', name: 'Alice Admin', email: 'alice@school.com', phone: '+1 (555) 111-2222', role: 'admin', position: 'Principal', status: 'active' },
  { id: '2', name: 'Bob Teacher', email: 'bob@school.com', phone: '+1 (555) 222-3333', role: 'teacher', position: 'Math Teacher', status: 'active' },
  { id: '3', name: 'Carol Bursar', email: 'carol@school.com', phone: '+1 (555) 333-4444', role: 'bursar', position: 'Bursar', status: 'active' }
];

export const sampleStaffAttendanceRecords: StaffAttendanceRecord[] = [
  { id: '2', staffId: '2', date: '2024-05-01', status: 'late', notes: 'Traffic' },
  { id: '3', staffId: '3', date: '2024-05-01', status: 'absent', notes: 'Sick' },
  { id: '4', staffId: '1', date: '2024-05-02', status: 'present' }
];

export const sampleExpenses: Expense[] = [
  {
    id: '1',
    description: 'School bus fuel',
    amount: 150.00,
    currency: 'USD',
    category: 'Transportation',
    date: '2024-01-15',
    paymentMethod: 'cash',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    description: 'Office supplies - paper and stationery',
    amount: 1320.25,
    currency: 'ZAR',
    category: 'Supplies',
    date: '2024-01-10',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    description: 'Electricity bill',
    amount: 10880.00,
    currency: 'ZiG',
    category: 'Utilities',
    date: '2024-01-05',
    paymentMethod: 'check',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-05T09:00:00Z'
  }
];

export const sampleSystemSettings = {
  schoolName: 'Lutumba Adventist Secondary School',
  logoUrl: '/src/assets/WhatsApp Image 2025-08-19 at 12.04.32_594ea3b2.jpg',
  contactEmail: 'lutumba@gmail.com',
  contactPhone: '+263 77 362 7813',
  address: 'P O BOX 20 ,  Lutumba, Beitbridge , Zimbabwe',
  academicYear: '2025',
  currentTerm: 'Term 1'
};