const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const { sendConfirmationEmail, sendAdminNotification } = require('../utils/emailService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST - Submit application
router.post('/submit', upload.single('resume'), async (req, res) => {
  try {
    const { fullName, email, phone, applicationType, positionApplyingFor, coverLetter } = req.body;

    // Validation
    if (!fullName || !email || !phone || !applicationType || !positionApplyingFor || !req.file) {
      return res.status(400).json({ success: false, message: 'All fields, except the cover letter, are required (including resume).' });
    }
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Phone number must be 10 digits.' });
    }

    // Save to database
    const application = new Application({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      applicationType,
      positionApplyingFor: positionApplyingFor.trim(),
      coverLetter: coverLetter ? coverLetter.trim() : '',
      resume: {
        filename: req.file.filename,
        filepath: req.file.path,
        size: req.file.size,
      },
    });
    const savedApplication = await application.save();

    // Send emails
    await sendConfirmationEmail(email, fullName, positionApplyingFor, applicationType);
    await sendAdminNotification(savedApplication);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review it shortly.',
      applicationId: savedApplication._id,
    });

  } catch (error) {
    console.error('Error in /submit:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error. Please try again later.',
    });
  }
});

// GET - All applications
router.get('/list', async (req, res) => {
  try {
    const applications = await Application.find().sort({ submittedAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching applications' });
  }
});

// Add other routes like GET by ID, PATCH status, etc. here later

module.exports = router;