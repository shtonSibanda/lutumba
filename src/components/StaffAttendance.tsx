import React, { useState } from 'react';
import { Staff, StaffAttendanceRecord } from '../types';

interface StaffAttendanceProps {
  staff: Staff[];
  staffAttendanceRecords: StaffAttendanceRecord[];
  onMarkStaffAttendance: (records: StaffAttendanceRecord[]) => void;
}

const StaffAttendance: React.FC<StaffAttendanceProps> = ({ staff, staffAttendanceRecords, onMarkStaffAttendance }) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [marking, setMarking] = useState(false);
  const [markData, setMarkData] = useState<{ [staffId: string]: StaffAttendanceRecord['status'] }>({});
  const [notesData, setNotesData] = useState<{ [staffId: string]: string }>({});

  const recordsForDate = staffAttendanceRecords.filter(r => r.date === selectedDate);
  const getStatus = (staffId: string) => {
    const rec = recordsForDate.find(r => r.staffId === staffId);
    return rec ? rec.status : '';
  };
  const getNotes = (staffId: string) => {
    const rec = recordsForDate.find(r => r.staffId === staffId);
    return rec ? rec.notes : '';
  };

  const handleMark = () => {
    const newRecords: StaffAttendanceRecord[] = staff.map(s => ({
      id: Date.now().toString() + s.id,
      staffId: s.id,
      date: selectedDate,
      status: markData[s.id] || 'present',
      notes: notesData[s.id] || undefined
    }));
    onMarkStaffAttendance(newRecords);
    setMarking(false);
  };

  // Attendance summary
  const summary = { present: 0, absent: 0, late: 0 };
  recordsForDate.forEach(r => { summary[r.status] += 1; });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Staff Attendance</h1>
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
        </div>
        <button onClick={() => setMarking(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Mark Attendance</button>
      </div>
      <div className="mb-2 flex gap-4">
        <span className="text-green-700">Present: {summary.present}</span>
        <span className="text-red-700">Absent: {summary.absent}</span>
        <span className="text-yellow-700">Late: {summary.late}</span>
      </div>
      <table className="min-w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Staff</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s.id}>
              <td className="py-2 px-4 border-b">{s.name}</td>
              <td className="py-2 px-4 border-b">{s.role}</td>
              <td className="py-2 px-4 border-b">
                {getStatus(s.id) ? (
                  <span className={
                    getStatus(s.id) === 'present' ? 'text-green-700' : getStatus(s.id) === 'absent' ? 'text-red-700' : 'text-yellow-700'
                  }>{getStatus(s.id)}</span>
                ) : <span className="text-gray-400">Not marked</span>}
              </td>
              <td className="py-2 px-4 border-b text-xs text-gray-600">{getNotes(s.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {marking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mark Staff Attendance for {selectedDate}</h2>
              <table className="min-w-full bg-white rounded-lg mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Staff</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(s => (
                    <tr key={s.id}>
                      <td className="py-2 px-4 border-b">{s.name}</td>
                      <td className="py-2 px-4 border-b">
                        <select
                          value={markData[s.id] || 'present'}
                          onChange={e => setMarkData({ ...markData, [s.id]: e.target.value as StaffAttendanceRecord['status'] })}
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
                          value={notesData[s.id] || ''}
                          onChange={e => setNotesData({ ...notesData, [s.id]: e.target.value })}
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
    </div>
  );
};

export default StaffAttendance; 