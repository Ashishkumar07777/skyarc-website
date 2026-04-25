const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    applicationType: {
      type: String,
      enum: ['career', 'internship'],
      required: true,
    },
    positionApplyingFor: {
      type: String,
      required: [true, 'Position is required'],
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
    },
    resume: {
      filename: String,
      filepath: String,
      size: Number,
    },
    status: {
      type: String,
      enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'accepted'],
      default: 'submitted',
    },
    adminNotes: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);