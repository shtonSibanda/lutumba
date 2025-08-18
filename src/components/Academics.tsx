import React, { useState } from 'react';
import { Student, ExamResult } from '../types';

interface AcademicsProps {
  students: Student[];
  examResults: ExamResult[];
  onAddResult: (result: ExamResult) => void;
}

const terms = ['Term 1', 'Term 2', 'Term 3'];
const subjects = ['Mathematics', 'English', 'Science', 'History'];

const Academics: React.FC<AcademicsProps> = ({ students, examResults, onAddResult }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ExamResult>>({
    studentId: '',
    subject: subjects[0],
    term: selectedTerm,
    year: selectedYear,
    score: 0,
    maxScore: 100,
    teacherComment: ''
  });

  const classes = Array.from(new Set(students.map(s => s.class)));
  const studentsInClass = selectedClass ? students.filter(s => s.class === selectedClass) : [];

  const resultsForClassTerm = examResults.filter(r => {
    const student = students.find(s => s.id === r.studentId);
    return student && student.class === selectedClass && r.term === selectedTerm && r.year === selectedYear;
  });

  const handleAddResult = () => {
    setFormData({
      studentId: '',
      subject: subjects[0],
      term: selectedTerm,
      year: selectedYear,
      score: 0,
      maxScore: 100,
      teacherComment: ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.subject) return;
    onAddResult({
      ...formData,
      id: Date.now().toString(),
      term: selectedTerm,
      year: selectedYear
    } as ExamResult);
    setShowModal(false);
  };

  // Group results by student for report card
  const reportCards = studentsInClass.map(student => {
    const results = resultsForClassTerm.filter(r => r.studentId === student.id);
    return { student, results };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Academic Management</h1>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="">Select class</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
          <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="px-3 py-2 border rounded-lg">
            {terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input type="text" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="px-3 py-2 border rounded-lg" />
        </div>
        {selectedClass && (
          <button onClick={handleAddResult} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Add Result</button>
        )}
      </div>
      {selectedClass && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Report Cards for {selectedClass}, {selectedTerm} {selectedYear}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCards.map(({ student, results }) => (
              <div key={student.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{student.firstName} {student.lastName}</h3>
                <ul className="mb-2">
                  {results.length === 0 && <li className="text-gray-500 text-sm">No results</li>}
                  {results.map(r => (
                    <li key={r.id} className="flex justify-between text-sm">
                      <span>{r.subject}</span>
                      <span>{r.score}/{r.maxScore}</span>
                    </li>
                  ))}
                </ul>
                {results.some(r => r.teacherComment) && (
                  <div className="text-xs text-gray-600 mt-2">
                    <span className="font-medium">Teacher Comments:</span>
                    <ul className="list-disc ml-4">
                      {results.filter(r => r.teacherComment).map(r => (
                        <li key={r.id}>{r.subject}: {r.teacherComment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add Exam Result</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    required
                    value={formData.studentId || ''}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select student</option>
                    {studentsInClass.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    required
                    value={formData.subject || subjects[0]}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                    <input
                      type="number"
                      min="0"
                      max={formData.maxScore || 100}
                      value={formData.score || 0}
                      onChange={e => setFormData({ ...formData, score: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxScore || 100}
                      onChange={e => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Comment</label>
                  <textarea
                    value={formData.teacherComment || ''}
                    onChange={e => setFormData({ ...formData, teacherComment: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Result
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

export default Academics; 