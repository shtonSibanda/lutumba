import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
             GROUP_CONCAT(DISTINCT sd.type, ':', sd.name, ':', sd.url) as documents
      FROM students s
      LEFT JOIN student_documents sd ON s.id = sd.student_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);
    
    // Parse documents string into array
    const students = rows.map(row => ({
      ...row,
      documents: row.documents ? row.documents.split(',').map(doc => {
        const [type, name, url] = doc.split(':');
        return { type, name, url };
      }) : []
    }));
    
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
             GROUP_CONCAT(DISTINCT sd.type, ':', sd.name, ':', sd.url) as documents
      FROM students s
      LEFT JOIN student_documents sd ON s.id = sd.student_id
      WHERE s.id = ?
      GROUP BY s.id
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const student = {
      ...rows[0],
      documents: rows[0].documents ? rows[0].documents.split(',').map(doc => {
        const [type, name, url] = doc.split(':');
        return { type, name, url };
      }) : []
    };
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, class: studentClass, status,
      enrollmentDate, totalFees, paidAmount, outstandingBalance,
      address, parentName, parentPhone, dateOfBirth, gender,
      admissionNumber, dateOfAdmission, academicYear, medicalNotes, documents
    } = req.body;

    // Convert ISO date strings to MySQL date format (YYYY-MM-DD)
    const formatDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString).toISOString().split('T')[0];
    };

    // Set default enrollment date if not provided
    const defaultEnrollmentDate = enrollmentDate && enrollmentDate.trim() !== '' ? formatDate(enrollmentDate) : new Date().toISOString().split('T')[0];

    const [result] = await pool.query(`
      INSERT INTO students (
        first_name, last_name, email, phone, class, status, enrollment_date,
        total_fees, paid_amount, outstanding_balance, address, parent_name,
        parent_phone, date_of_birth, gender, admission_number, date_of_admission,
        academic_year, medical_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      firstName || null, lastName || null, email || null, phone || null, 
      studentClass || null, status || 'active', defaultEnrollmentDate,
      totalFees || 0, paidAmount || 0, outstandingBalance || 0, address || null,
      parentName || null, parentPhone || null, formatDate(dateOfBirth), 
      gender || null, admissionNumber || null, formatDate(dateOfAdmission), 
      academicYear || null, medicalNotes || null
    ].map(val => val === '' ? null : val));

    const studentId = result.insertId;

    // Insert documents if provided
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        await pool.query(`
          INSERT INTO student_documents (student_id, type, name, url)
          VALUES (?, ?, ?, ?)
        `, [studentId, doc.type, doc.name, doc.url]);
      }
    }

    res.status(201).json({ 
      message: 'Student created successfully',
      studentId 
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, class: studentClass, status,
      enrollmentDate, totalFees, paidAmount, outstandingBalance,
      address, parentName, parentPhone, dateOfBirth, gender,
      admissionNumber, dateOfAdmission, academicYear, medicalNotes, documents
    } = req.body;

    // Convert ISO date strings to MySQL date format (YYYY-MM-DD)
    const formatDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString).toISOString().split('T')[0];
    };

    await pool.query(`
      UPDATE students SET
        first_name = ?, last_name = ?, email = ?, phone = ?, class = ?,
        status = ?, enrollment_date = ?, total_fees = ?, paid_amount = ?,
        outstanding_balance = ?, address = ?, parent_name = ?, parent_phone = ?,
        date_of_birth = ?, gender = ?, admission_number = ?, date_of_admission = ?,
        academic_year = ?, medical_notes = ?
      WHERE id = ?
    `, [
      firstName, lastName, email, phone, studentClass, status, formatDate(enrollmentDate),
      totalFees || 0, paidAmount || 0, outstandingBalance || 0, address,
      parentName, parentPhone, formatDate(dateOfBirth), gender, admissionNumber,
      formatDate(dateOfAdmission), academicYear, medicalNotes, req.params.id
    ]);

    // Update documents
    if (documents) {
      // Delete existing documents
      await pool.query('DELETE FROM student_documents WHERE student_id = ?', [req.params.id]);
      
      // Insert new documents
      for (const doc of documents) {
        await pool.query(`
          INSERT INTO student_documents (student_id, type, name, url)
          VALUES (?, ?, ?, ?)
        `, [req.params.id, doc.type, doc.name, doc.url]);
      }
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router; 