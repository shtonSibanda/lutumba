import React, { useState } from 'react';
import { SystemSettings, Student, Payment, AttendanceRecord, ExamResult, Staff, StaffAttendanceRecord } from '../types';

interface SettingsProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  allData: {
    students: Student[];
    payments: Payment[];
    attendanceRecords: AttendanceRecord[];
    examResults: ExamResult[];
    staff: Staff[];
    staffAttendanceRecords: StaffAttendanceRecord[];
  };
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, allData }) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
  };

  const handleBackup = () => {
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school_backup.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
          <input
            type="text"
            value={formData.schoolName}
            onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input
            type="text"
            value={formData.logoUrl || ''}
            onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input
            type="email"
            value={formData.contactEmail || ''}
            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <input
            type="text"
            value={formData.contactPhone || ''}
            onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Term</label>
            <input
              type="text"
              value={formData.currentTerm}
              onChange={e => setFormData({ ...formData, currentTerm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={handleBackup}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Download Data Backup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 