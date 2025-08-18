import React, { useState } from 'react';
import { Student, Payment, AttendanceRecord, ExamResult } from '../types';

interface ReportsProps {
  students: Student[];
  payments: Payment[];
  attendanceRecords: AttendanceRecord[];
  examResults: ExamResult[];
}

function toCSV(rows: any[], headers: string[]): string {
  const csvRows = [headers.join(',')];
  for (const row of rows) {
    csvRows.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  }
  return csvRows.join('\n');
}

function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

const Reports: React.FC<ReportsProps> = ({ students, payments, attendanceRecords, examResults }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedYear, setSelectedYear] = useState('2024');
  const classes = Array.from(new Set(students.map(s => s.class)));
  const terms = Array.from(new Set(examResults.map(r => r.term)));

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter payments for today
  const dailyPayments = payments.filter(p => {
    const paymentDate = new Date(p.paymentDate).toISOString().split('T')[0];
    return paymentDate === today;
  });

  // Export daily payments
  const exportDailyPayments = () => {
    const headers = ['id', 'studentName', 'amount', 'currency', 'paymentMethod', 'paymentDate', 'description', 'status'];
    const csv = toCSV(dailyPayments, headers);
    downloadCSV('daily_payments.csv', csv);
  };

  // Student List Export
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClass) : students;
  const exportStudents = () => {
    const headers = ['id', 'firstName', 'lastName', 'class', 'gender', 'status', 'parentName', 'parentPhone', 'address'];
    const csv = toCSV(filteredStudents, headers);
    downloadCSV('students.csv', csv);
  };

  // Fee Collection Export
  const exportPayments = () => {
    const headers = ['id', 'studentName', 'amount', 'paymentMethod', 'paymentDate', 'description', 'status'];
    const csv = toCSV(payments, headers);
    downloadCSV('payments.csv', csv);
  };

  // Defaulters Export
  const defaulters = students.filter(s => (s.outstandingBalance || 0) > 0);
  const exportDefaulters = () => {
    const headers = ['id', 'firstName', 'lastName', 'class', 'outstandingBalance', 'parentName', 'parentPhone'];
    const csv = toCSV(defaulters, headers);
    downloadCSV('defaulters.csv', csv);
  };

  // Attendance Export
  const exportAttendance = () => {
    const headers = ['id', 'studentId', 'date', 'status', 'notes'];
    const csv = toCSV(attendanceRecords, headers);
    downloadCSV('attendance.csv', csv);
  };

  // Academic Results Export
  const filteredResults = selectedTerm ? examResults.filter(r => r.term === selectedTerm) : examResults;
  const exportResults = () => {
    const headers = ['id', 'studentId', 'subject', 'term', 'year', 'score', 'maxScore', 'teacherComment'];
    const csv = toCSV(filteredResults, headers);
    downloadCSV('exam_results.csv', csv);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Data Export</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Student List</h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mb-2 px-3 py-2 border rounded-lg">
            <option value="">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={exportStudents} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Fee Collection</h2>
          <button onClick={exportPayments} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Daily Payments</h2>
          <p className="text-sm text-gray-600 mb-2">Today's payments: {dailyPayments.length}</p>
          <button onClick={exportDailyPayments} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Defaulters</h2>
          <button onClick={exportDefaulters} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Attendance</h2>
          <button onClick={exportAttendance} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Academic Results</h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
          <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="mb-2 px-3 py-2 border rounded-lg">
            <option value="">All Terms</option>
            {terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={exportResults} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>
      </div>
    </div>
  );
};

export default Reports; 