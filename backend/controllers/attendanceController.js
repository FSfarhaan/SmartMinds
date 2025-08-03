const Student = require('../models/Student');

// Helper to get month and year from Date
const getMonthYear = (date) => {
  const d = new Date(date);
  return {
    month: d.toLocaleString('default', { month: 'long' }),
    year: d.getFullYear()
  };
};

// 1. Get shift-wise, paginated, month-wise attendance
// Query: ?shift=1&month=August&year=2024&limit=5&skip=0
exports.getAttendance = async (req, res) => {
  try {
    const { shift, month, year } = req.query;
    const students = await Student.find({ shiftNumber: Number(shift) });
    const monthName = month || (new Date()).toLocaleString('default', { month: 'long' });
    const yearNum = year ? Number(year) : (new Date()).getFullYear();
    // Filter attendance for the given month/year
    const result = students.map(student => {
      const monthAttendance = student.attendance.filter(a => {
        const d = new Date(a.date);
        return d.getFullYear() === yearNum && d.toLocaleString('default', { month: 'long' }) === monthName;
      });
      const totalPresent = monthAttendance.filter(a => a.present).length;
      return {
        _id: student._id,
        name: student.name,
        std: student.std,
        shiftNumber: student.shiftNumber,
        attendance: monthAttendance,
        totalPresent,
        totalDays: monthAttendance.length
      };
    });
    // Pagination
    // const paginated = result.slice(Number(skip), Number(skip) + Number(limit));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// 2. Mark attendance for a student for a given date
// Body: { studentId, date, present }
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, present } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Check if attendance for the date exists
    const dateStr = new Date(date).toISOString().split('T')[0];
    let found = false;
    student.attendance = student.attendance.map(a => {
      const aDateStr = new Date(a.date).toISOString().split('T')[0];
      if (aDateStr === dateStr) {
        found = true;
        return { ...a.toObject(), present };
      }
      return a;
    });
    if (!found) {
      student.attendance.push({ date, present });
    }
    await student.save();
    res.json({ message: 'Attendance updated', student });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}; 

exports.deleteAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const isoDate = new Date(date); // "2025-07-03" -> Date object

    const result = await Student.updateOne(
      { _id: studentId },
      {
        $pull: {
          attendance: {
            date: {
              $eq: isoDate,
            },
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Attendance entry not found or already deleted' });
    }

    res.json({ message: 'Attendance entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}