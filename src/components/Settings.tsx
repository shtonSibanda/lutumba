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
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

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

  const handleResetData = async () => {
    if (resetPassword !== 'ashtechlutumba25@') {
      setResetMessage('❌ Incorrect password!');
      return;
    }

    setIsResetting(true);
    setResetMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/reset-financial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: resetPassword }),
      });

      if (response.ok) {
        setResetMessage('✅ All financial data has been reset to zero!');
        setResetPassword('');
        setTimeout(() => {
          setShowResetModal(false);
          setResetMessage('');
          // Refresh the page to show updated data
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.text();
        setResetMessage(`❌ Reset failed: ${error}`);
      }
    } catch (error) {
      setResetMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsResetting(false);
    }
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

      {/* Reset Data Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Danger Zone</h2>
        <p className="text-red-700 mb-4">
          Reset all financial data including payments, expenses, invoices, and student balances to zero.
          This action cannot be undone!
        </p>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold"
        >
          🗑️ Reset All Financial Data
        </button>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-bold text-red-800 mb-4">🔐 Confirm Reset Action</h3>
            <p className="text-gray-700 mb-4">
              This will permanently delete all financial data and reset balances to zero.
              Enter the admin password to proceed:
            </p>
            <input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              disabled={isResetting}
            />
            {resetMessage && (
              <div className={`mb-4 p-2 rounded ${resetMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {resetMessage}
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={handleResetData}
                disabled={isResetting || !resetPassword}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isResetting ? '🔄 Resetting...' : '✅ Confirm Reset'}
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetPassword('');
                  setResetMessage('');
                }}
                disabled={isResetting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;