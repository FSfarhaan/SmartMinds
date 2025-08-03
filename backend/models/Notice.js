const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
    default: '',
  },
  content: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notice', NoticeSchema); 