import React from 'react';
import { Student } from '../types';

interface DefaultersProps {
  students: Student[];
}

const Defaulters: React.FC<DefaultersProps> = ({ students }) => {
  const defaulters = students.filter(s => (s.outstandingBalance || 0) > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Fee Defaulters</h1>
      <p className="text-gray-600 mb-4">Students with outstanding balances</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaulters.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No defaulters found. All students are up to date.</div>
        )}
        {defaulters.map(student => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{student.firstName} {student.lastName}</h2>
            <p className="text-gray-600">Class: {student.class}</p>
            <p className="text-gray-600">Parent: {student.parentName} ({student.parentPhone})</p>
            <p className="text-gray-600">Outstanding: <span className="text-red-600 font-bold">${student.outstandingBalance?.toFixed(2)}</span></p>
            <p className="text-gray-600 text-sm mt-2">Contact: {student.phone} | {student.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Defaulters; 