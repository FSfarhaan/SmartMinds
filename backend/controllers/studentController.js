const Student = require('../models/Student');

// ✅ Create a new student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    console.log("barabar to hai");
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ✅ Get all students (with pagination)
exports.getAllStudents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ✅ Get one student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ✅ Update student details
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ✅ Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};
