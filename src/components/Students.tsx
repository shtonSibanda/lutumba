import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Student, StudentDocument } from '../types';
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
    classSection: '',
    status: 'active',
    totalFees: 0,
    paidAmount: 0,
    totalFeesCurrency: 'USD',
    paidAmountCurrency: 'USD',
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
  const [showEmailField, setShowEmailField] = useState<boolean>(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
  (student.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (student.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (student.class || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (`${student.class} ${student.classSection || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate only required fields: firstName, lastName, and class
    if (!formData.firstName?.trim()) {
      toast.error('First name is required!');
      return;
    }
    if (!formData.lastName?.trim()) {
      toast.error('Last name is required!');
      return;
    }
    if (!formData.class?.trim()) {
      toast.error('Form/Class is required!');
      return;
    }
    if (formData.class && !formData.classSection) {
      toast.error('Class Section is required!');
      return;
    }
    
    try {
      // If email field is hidden, ensure email is empty
      const normalizedForm = { ...formData } as any;
      if (!showEmailField) {
        normalizedForm.email = '';
      }

      const studentData: Student = {
        ...normalizedForm,
        id: editingStudent?.id || Date.now().toString(),
        class: `${formData.class} ${formData.classSection}`,
        enrollmentDate: editingStudent?.enrollmentDate || new Date().toISOString().split('T')[0],
        outstandingBalance: (normalizedForm.totalFees || 0) - (normalizedForm.paidAmount || 0)
      } as Student;

      if (editingStudent) {
        await onUpdateStudent(studentData);
        toast.success('Student updated successfully!');
      } else {
        await onAddStudent(studentData);
        toast.success('New student added successfully!');
      }
      
      // Reset the form and close modal after successful save
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        class: '',
        classSection: '',
        status: 'active',
        totalFees: 0,
        paidAmount: 0,
        totalFeesCurrency: 'USD',
        paidAmountCurrency: 'USD',
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
  };

  const handleEdit = (student: Student) => {
    const classParts = student.class.split(' ');
    const studentFormState = {
      ...student,
      class: classParts[0] ? `${classParts[0]} ${classParts[1]}` : '',
      classSection: classParts[2] || '',
    };

    setEditingStudent(student);
    setFormData(studentFormState);
    // show email input if the student already has an email
    setShowEmailField(!!student.email);
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
      classSection: '',
      status: 'active',
      totalFees: 0,
      paidAmount: 0,
      totalFeesCurrency: 'USD',
      paidAmountCurrency: 'USD',
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
  // default: don't show email input for new students
  setShowEmailField(false);
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
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-105 hover:bg-blue-50 transition-all duration-300 transform cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                  <User className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">{student.class}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {student.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <Mail className="h-4 w-4 group-hover:text-blue-500" />
                  <span>{student.email}</span>
                </div>
              )}
              {student.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <Phone className="h-4 w-4 group-hover:text-blue-500" />
                  <span>{student.phone}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <MapPin className="h-4 w-4 group-hover:text-blue-500" />
                  <span className="truncate">{student.address}</span>
                </div>
              )}
              {/* New fields */}
              {student.dateOfBirth && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="font-medium">DOB:</span>
                  <span>{student.dateOfBirth}</span>
                </div>
              )}
              {student.gender && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="font-medium">Gender:</span>
                  <span>{student.gender}</span>
                </div>
              )}
              {student.admissionNumber && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="font-medium">Admission #:</span>
                  <span>{student.admissionNumber}</span>
                </div>
              )}
              {student.dateOfAdmission && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="font-medium">Admission Date:</span>
                  <span>{student.dateOfAdmission}</span>
                </div>
              )}
              {student.academicYear && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="font-medium">Academic Year:</span>
                  <span>{student.academicYear}</span>
                </div>
              )}
              {student.medicalNotes && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
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


            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(student)}
                className="flex-1 bg-blue-100 hover:bg-blue-200 hover:scale-105 text-blue-700 hover:text-blue-800 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-300 transform hover:shadow-md"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDeleteStudent(student.id)}
                className="flex-1 bg-red-100 hover:bg-red-200 hover:scale-105 text-red-700 hover:text-red-800 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-300 transform hover:shadow-md"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Form/Class *</label>
                    <select
                      value={formData.class || ''}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value, classSection: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select form/class</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                      <option value="Form 5">Form 5</option>
                      <option value="Form 6">Form 6</option>
                    </select>
                  </div>
                  {formData.class && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class Section *</label>
                      <select
                        value={formData.classSection || ''}
                        onChange={(e) => setFormData({ ...formData, classSection: e.target.value as 'A1' | 'A2' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select section</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                      </select>
                    </div>
                  )}
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
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address (optional)</label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name (optional)</label>
                    <input
                      type="text"
                      value={formData.parentName || ''}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Enter parent name (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone (optional)</label>
                    <input
                      type="tel"
                      value={formData.parentPhone || ''}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="Enter parent phone (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (optional)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number (optional)</label>
                    <input
                      type="text"
                      value={formData.admissionNumber || ''}
                      onChange={e => setFormData({ ...formData, admissionNumber: e.target.value })}
                      placeholder="Enter admission number (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Admission (optional)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year (optional)</label>
                    <input
                      type="text"
                      value={formData.academicYear || ''}
                      onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="e.g., 2024-2025 (optional)"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents (optional)</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => {
                      const files = e.target.files;
                      if (!files) return;
                      const docs: StudentDocument[] = Array.from(files).map(file => ({
                        id: Date.now().toString() + Math.random(),
                        type: 'other' as const,
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