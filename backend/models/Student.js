const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  std: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  gender: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  leavingDate: {
    type: Date,
    default: null
  },
  feesTotal: {
    type: Number,
    required: true,
  },
  feesPaid: {
    type: Map,
    of: Number, // month name → amount paid
    default: {},
  },
  attendance: [
    {
      date: {
        type: Date
      },
      present: {
        type: Boolean,
        default: true,
      },
    }
  ],
  dueFeeReminderSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shiftNumber: {
    type: Number,
    required: true
  }
});

StudentSchema.index({ std: 1, shiftNumber: 1 });
module.exports = mongoose.model('Student', StudentSchema);