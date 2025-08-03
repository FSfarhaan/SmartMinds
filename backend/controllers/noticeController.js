const Notice = require('../models/Notice');

// Fetch all notices, sorted by date descending
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    const notice = new Notice({ title, subtitle, content });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Update a notice by ID
exports.updateNotice = async (req, res) => {
  try {
    const { title, subtitle, date } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, subtitle, date },
      { new: true }
    );
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Delete a notice by ID
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}; 