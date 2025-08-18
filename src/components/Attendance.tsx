import React, { useState } from 'react';
import { Student, AttendanceRecord, Staff, StaffAttendanceRecord } from '../types';

interface AttendanceProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (records: AttendanceRecord[]) => void;
  staff: Staff[];
  staffAttendanceRecords: StaffAttendanceRecord[];
  onMarkStaffAttendance: (records: StaffAttendanceRecord[]) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ students, attendanceRecords, onMarkAttendance, staff, staffAttendanceRecords, onMarkStaffAttendance }) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [marking, setMarking] = useState(false);
  const classes = Array.from(new Set(students.map(s => s.class)));

  const studentsInClass = selectedClass ? students.filter(s => s.class === selectedClass) : [];
  const recordsForDate = attendanceRecords.filter(r => r.date === selectedDate);

  const getStatus = (studentId: string) => {
    const rec = recordsForDate.find(r => r.studentId === studentId);
    return rec ? rec.status : '';
  };

  const [markData, setMarkData] = useState<{ [studentId: string]: AttendanceRecord['status'] }>({});

  const handleMark = () => {
    const newRecords: AttendanceRecord[] = studentsInClass.map(s => ({
      id: Date.now().toString() + s.id,
      studentId: s.id,
      date: selectedDate,
      status: markData[s.id] || 'present',
    }));
    onMarkAttendance(newRecords);
    setMarking(false);
  };

  // Attendance summary
  const summary = { present: 0, absent: 0, late: 0 };
  recordsForDate.forEach(r => { summary[r.status] += 1; });

  const [markingStaff, setMarkingStaff] = useState(false);
  const [staffMarkData, setStaffMarkData] = useState<{ [staffId: string]: StaffAttendanceRecord['status'] }>({});
  const [staffNotesData, setStaffNotesData] = useState<{ [staffId: string]: string }>({});

  const staffRecordsForDate = staffAttendanceRecords.filter(r => r.date === selectedDate);
  const getStaffStatus = (staffId: string) => {
    const rec = staffRecordsForDate.find(r => r.staffId === staffId);
    return rec ? rec.status : '';
  };
  const getStaffNotes = (staffId: string) => {
    const rec = staffRecordsForDate.find(r => r.staffId === staffId);
    return rec ? rec.notes : '';
  };
  const handleMarkStaff = () => {
    const newRecords: StaffAttendanceRecord[] = staff.map(s => ({
      id: Date.now().toString() + s.id,
      staffId: s.id,
      date: selectedDate,
      status: staffMarkData[s.id] || 'present',
      notes: staffNotesData[s.id] || undefined
    }));
    onMarkStaffAttendance(newRecords);
    setMarkingStaff(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="">Select class</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {selectedClass && (
          <button onClick={() => setMarking(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Mark Attendance</button>
        )}
      </div>
      {selectedClass && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Attendance for {selectedClass} on {selectedDate}</h2>
          <div className="mb-2 flex gap-4">
            <span className="text-green-700">Present: {summary.present}</span>
            <span className="text-red-700">Absent: {summary.absent}</span>
            <span className="text-yellow-700">Late: {summary.late}</span>
          </div>
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentsInClass.map(s => {
                const status = getStatus(s.id);
                return (
                  <tr key={s.id}>
                    <td className="py-2 px-4 border-b">{s.firstName} {s.lastName}</td>
                    <td className="py-2 px-4 border-b">
                      {status ? (
                        <span className={
                          status === 'present' ? 'text-green-700' : status === 'absent' ? 'text-red-700' : 'text-yellow-700'
                        }>{status}</span>
                      ) : <span className="text-gray-400">Not marked</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {marking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mark Attendance for {selectedClass} on {selectedDate}</h2>
              <table className="min-w-full bg-white rounded-lg mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Student</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsInClass.map(s => (
                    <tr key={s.id}>
                      <td className="py-2 px-4 border-b">{s.firstName} {s.lastName}</td>
                      <td className="py-2 px-4 border-b">
                        <select
                          value={markData[s.id] || 'present'}
                          onChange={e => setMarkData({ ...markData, [s.id]: e.target.value as AttendanceRecord['status'] })}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleMark}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Save Attendance
                </button>
                <button
                  onClick={() => setMarking(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Teacher Attendance Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Teacher Attendance for {selectedDate}</h2>
        <button onClick={() => setMarkingStaff(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-2">Mark Teacher Attendance</button>
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Teacher</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Notes</th>
            </tr>
          </thead>
          <tbody>
            {staff.filter(s => s.role === 'teacher').map(s => (
              <tr key={s.id}>
                <td className="py-2 px-4 border-b">{s.name}</td>
                <td className="py-2 px-4 border-b">{s.position}</td>
                <td className="py-2 px-4 border-b">
                  {getStaffStatus(s.id) ? (
                    <span className={
                      getStaffStatus(s.id) === 'present' ? 'text-green-700' : getStaffStatus(s.id) === 'absent' ? 'text-red-700' : 'text-yellow-700'
                    }>{getStaffStatus(s.id)}</span>
                  ) : <span className="text-gray-400">Not marked</span>}
                </td>
                <td className="py-2 px-4 border-b text-xs text-gray-600">{getStaffNotes(s.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {markingStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Mark Teacher Attendance for {selectedDate}</h2>
                <table className="min-w-full bg-white rounded-lg mb-4">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Teacher</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.filter(s => s.role === 'teacher').map(s => (
                      <tr key={s.id}>
                        <td className="py-2 px-4 border-b">{s.name}</td>
                        <td className="py-2 px-4 border-b">
                          <select
                            value={staffMarkData[s.id] || 'present'}
                            onChange={e => setStaffMarkData({ ...staffMarkData, [s.id]: e.target.value as StaffAttendanceRecord['status'] })}
                            className="px-2 py-1 border rounded"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                          </select>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="text"
                            value={staffNotesData[s.id] || ''}
                            onChange={e => setStaffNotesData({ ...staffNotesData, [s.id]: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                            placeholder="Notes (optional)"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleMarkStaff}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Attendance
                  </button>
                  <button
                    onClick={() => setMarkingStaff(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance; 