import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Student } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/calculations';
import { Payment } from '../types';
import toast, { Toaster } from 'react-hot-toast';

interface StudentsProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddStudent: (student: Student) => void;
  payments: Payment[];
}

const Students: React.FC<StudentsProps> = ({ students, onUpdateStudent, onDeleteStudent, onAddStudent, payments }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    class: '',
    status: 'active',
    totalFees: 0,
    paidAmount: 0,
    address: '',
    parentName: '',
    parentPhone: '',
    dateOfBirth: '',
    gender: 'male',
    admissionNumber: '',
    dateOfAdmission: '',
    academicYear: '',
    medicalNotes: '',
    documents: []
  });
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentData: Student = {
        ...formData,
        id: editingStudent?.id || Date.now().toString(),
        enrollmentDate: editingStudent?.enrollmentDate || new Date().toISOString().split('T')[0],
        outstandingBalance: (formData.totalFees || 0) - (formData.paidAmount || 0)
      } as Student;

      if (editingStudent) {
        await onUpdateStudent(studentData);
        toast.success('Student updated successfully!');
      } else {
        await onAddStudent(studentData);
        toast.success('New student added successfully!');
      }
      
      // Only reset the form and close modal after successful save
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        class: '',
        status: 'active',
        totalFees: 0,
        paidAmount: 0,
        address: '',
        parentName: '',
        parentPhone: '',
        dateOfBirth: '',
        gender: 'male',
        admissionNumber: '',
        dateOfAdmission: '',
        academicYear: '',
        medicalNotes: '',
        documents: []
      });
      setEditingStudent(null);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save student:', error);
      toast.error('Failed to save student. Please try again.');
    }
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      class: '',
      status: 'active',
      totalFees: 0,
      paidAmount: 0,
      address: '',
      parentName: '',
      parentPhone: '',
      dateOfBirth: '',
      gender: 'male',
      admissionNumber: '',
      dateOfAdmission: '',
      academicYear: '',
      medicalNotes: '',
      documents: []
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      class: '',
      status: 'active',
      totalFees: 0,
      paidAmount: 0,
      address: '',
      parentName: '',
      parentPhone: '',
      dateOfBirth: '',
      gender: 'male',
      admissionNumber: '',
      dateOfAdmission: '',
      academicYear: '',
      medicalNotes: '',
      documents: []
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student information and track their status</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-gray-600">{student.class}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{student.address}</span>
              </div>
              {/* New fields */}
              {student.dateOfBirth && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">DOB:</span>
                  <span>{student.dateOfBirth}</span>
                </div>
              )}
              {student.gender && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Gender:</span>
                  <span>{student.gender}</span>
                </div>
              )}
              {student.admissionNumber && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Admission #:</span>
                  <span>{student.admissionNumber}</span>
                </div>
              )}
              {student.dateOfAdmission && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Admission Date:</span>
                  <span>{student.dateOfAdmission}</span>
                </div>
              )}
              {student.academicYear && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Academic Year:</span>
                  <span>{student.academicYear}</span>
                </div>
              )}
              {student.medicalNotes && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Medical Notes:</span>
                  <span>{student.medicalNotes}</span>
                </div>
              )}
              {student.documents && student.documents.length > 0 && (
                <div className="flex flex-col text-sm text-gray-600">
                  <span className="font-medium">Documents:</span>
                  <ul className="ml-4 list-disc">
                    {student.documents.map(doc => (
                      <li key={doc.id}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{doc.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Fees</p>
                  <p className="font-semibold">{formatCurrency(student.totalFees)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Paid Amount</p>
                  <p className="font-semibold text-green-600">{formatCurrency(student.paidAmount)}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-600 text-sm">Outstanding Balance</p>
                <p className={`font-semibold ${student.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(student.outstandingBalance)}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(student)}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDeleteStudent(student.id)}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <input
                      type="text"
                      required
                      value={formData.class || ''}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                    <input
                      type="text"
                      value={formData.parentName || ''}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                    <input
                      type="tel"
                      value={formData.parentPhone || ''}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.totalFees || 0}
                      onChange={(e) => setFormData({ ...formData, totalFees: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.paidAmount || 0}
                      onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Add new fields to the form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth || ''}
                      onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender || 'male'}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                    <input
                      type="text"
                      value={formData.admissionNumber || ''}
                      onChange={e => setFormData({ ...formData, admissionNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Admission</label>
                    <input
                      type="date"
                      value={formData.dateOfAdmission || ''}
                      onChange={e => setFormData({ ...formData, dateOfAdmission: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={formData.academicYear || ''}
                      onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes (optional)</label>
                    <textarea
                      value={formData.medicalNotes || ''}
                      onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {/* Document upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => {
                      const files = e.target.files;
                      if (!files) return;
                      const docs = Array.from(files).map(file => ({
                        id: Date.now().toString() + Math.random(),
                        type: 'other',
                        name: file.name,
                        url: URL.createObjectURL(file)
                      }));
                      setFormData({ ...formData, documents: [...(formData.documents || []), ...docs] });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.documents && formData.documents.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {formData.documents.map(doc => (
                        <li key={doc.id} className="flex items-center space-x-2">
                          <span>{doc.name}</span>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;