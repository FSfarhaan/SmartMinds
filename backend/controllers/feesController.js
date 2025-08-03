const Student = require('../models/Student');

// Helper to get month name from Date
const getMonthName = (date) => date.toLocaleString('default', { month: 'long' });

// 1. Fetch all students' feesTotal sum, feesPaid sum, feesPending sum, feesDue sum (for pie chart)
exports.getFeesSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month || getMonthName(now);
    const dueDay = 10;
    let total = 0, paid = 0, pending = 0, due = 0;
    const students = await Student.find();
    students.forEach(student => {
      total += student.feesTotal;
      const paidAmount = student.feesPaid.get(month) || 0;
      if (paidAmount >= student.feesTotal) {
        paid += student.feesTotal;
      } else if (paidAmount > 0 && paidAmount < student.feesTotal) {
        paid += paidAmount;
        pending += (student.feesTotal - paidAmount);
      } else {
        // Not paid
        const today = now.getDate();
        if (today > dueDay) {
          due += student.feesTotal;
        } else {
          pending += student.feesTotal;
        }
      }
    });
    res.json({ total, paid, pending, due });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// 2. Fetch students by fee status (paid, pending, due) for a month, paginated
// Query: ?status=paid|pending|due&month=August&limit=5&skip=0
exports.getStudentsByFeeStatus = async (req, res) => {
  try {
    const { status = 'paid', month } = req.query;
    const now = new Date();
    const monthName = month || getMonthName(now);
    const dueDay = 30;
    const today = now.getDate();
    const students = await Student.find();
    let filtered = [];
    students.forEach(student => {
      const paidAmount = student.feesPaid.get(monthName) || 0;
      
      if (status === 'paid' && paidAmount >= student.feesTotal) {
        filtered.push(student);
      } else if (status === 'pending' && paidAmount > 0 && paidAmount < student.feesTotal && today <= dueDay) {
        filtered.push(student);
      } else if (status === 'due') {
        if (paidAmount < student.feesTotal && today > dueDay) {
          filtered.push(student);
        }
      }
    });
    
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}; 

exports.updateStudentFeeStatus = async (req, res) => {
  try {
    const { studentId, month, status } = req.body;

    if (!studentId || !month || !status) {
      return res.status(400).json({ message: 'studentId, month, and status are required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (status === 'paid') {
      // Set or update feesPaid for the month
      student.feesPaid.set(month, student.feesTotal);
    } else if (status === 'pending') {
      // Remove the month from feesPaid
      student.feesPaid.delete(month);
    } else {
      return res.status(400).json({ message: 'Invalid status. Use "paid" or "pending"' });
    }

    await student.save();
    res.status(200).json({ message: 'Fee status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};
