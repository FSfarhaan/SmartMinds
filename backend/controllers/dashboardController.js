const Student = require('../models/Student');

// Helper to get month name from Date
const getMonthName = (date) => date.toLocaleString('default', { month: 'long' });

// 1. Total students, male/female count
exports.getStats = async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const male = await Student.countDocuments({ gender: 'male' });
    const female = await Student.countDocuments({ gender: 'female' });
    res.json({ total, male, female });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// 2. Fees summary: paid, pending, due (for current month)
exports.getFeesSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = getMonthName(now);
    const dueDay = 10;
    let paid = 0, pending = 0, due = 0;
    const students = await Student.find();
    students.forEach(student => {
      const paidAmount = student.feesPaid.get(month) || 0;
      if (paidAmount >= student.feesTotal) {
        paid++;
      } else if (paidAmount > 0 && paidAmount < student.feesTotal) {
        pending++;
      } else {
        // Not paid
        const today = now.getDate();
        if (today > dueDay) {
          due++;
        } else {
          pending++;
        }
      }
    });
    res.json({ paid, pending, due });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// 3. Monthly fees collected for current year
exports.getFeesCollected = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // Initialize monthly sums
    const monthly = {};
    months.forEach(m => monthly[m] = 0);
    const students = await Student.find();
    students.forEach(student => {
      for (const [month, amount] of student.feesPaid.entries()) {
        // Only count if paid in this year
        // Assume feesPaid is updated for the current year only
        monthly[month] = (monthly[month] || 0) + amount;
      }
    });

    // Convert to array in month order
    const monthlyArray = months.map(month => monthly[month]);

    res.json({ year, monthlyArray });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// 4. One student with exceeded due date and due days
exports.getFeesDue = async (req, res) => {
  try {
    const now = new Date();
    const month = getMonthName(now);
    const dueDay = 10;
    const today = now.getDate();
    if (today <= dueDay) return res.json({}); // No one overdue yet
    const students = await Student.find();
    let result = null;
    for (const student of students) {
      const paidAmount = student.feesPaid.get(month) || 0;
      if (paidAmount < student.feesTotal) {
        // Overdue
        result = {
          name: student.name,
          dueDays: today - dueDay
        };
        break;
      }
    }
    if (!result) return res.json({});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}; 