const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

// Email transporter (reuses same Gmail credentials as the app)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send booking confirmation to admin
async function sendBookingEmail(booking) {
  const adminEmail = process.env.ADMIN_EMAIL || 'manoj12243301@gmail.com';

  // — Email to Admin / SkyArc team —
  const adminHtml = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0A0E17; padding: 30px; border-radius: 10px; border: 1px solid #1a2035;">
          <h2 style="color: #00D6FF; margin-top: 0;">🚀 New Booking Request</h2>
          
          <div style="background-color: #111827; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #8892a8; width: 120px;">Service:</td><td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${booking.service}</td></tr>
              <tr><td style="padding: 8px 0; color: #8892a8;">Name:</td><td style="padding: 8px 0; color: #ffffff;">${booking.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #8892a8;">Phone:</td><td style="padding: 8px 0; color: #ffffff;"><a href="tel:${booking.phone}" style="color: #00D6FF;">${booking.phone}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #8892a8;">Email:</td><td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${booking.email}" style="color: #00D6FF;">${booking.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #8892a8;">Preferred Date:</td><td style="padding: 8px 0; color: #ffffff;">${booking.date || 'Flexible'}</td></tr>
              <tr><td style="padding: 8px 0; color: #8892a8;">Details:</td><td style="padding: 8px 0; color: #ffffff;">${booking.details || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; color: #8892a8;">Submitted:</td><td style="padding: 8px 0; color: #ffffff;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #8892a8;">Please follow up with the client within 24 hours.</p>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #1a2035; font-size: 11px; color: #555;">
            SkyArc Technologies LLP — Automated Booking System
          </div>
        </div>
      </body>
    </html>
  `;

  // — Confirmation email to Client —
  const clientHtml = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0A0E17; padding: 30px; border-radius: 10px; border: 1px solid #1a2035;">
          <h2 style="color: #00D6FF; margin-top: 0;">✅ Booking Confirmed!</h2>
          
          <p>Hello <strong>${booking.name}</strong>,</p>
          
          <p>Thank you for your interest in SkyArc Technologies! We have received your booking request for <strong style="color: #00D6FF;">${booking.service}</strong>.</p>
          
          <div style="background-color: #111827; padding: 20px; border-radius: 8px; border-left: 4px solid #0066FF; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #00D6FF;">Booking Summary</p>
            <p style="margin: 4px 0;">📋 <strong>Service:</strong> ${booking.service}</p>
            <p style="margin: 4px 0;">📅 <strong>Preferred Date:</strong> ${booking.date || 'Flexible'}</p>
            <p style="margin: 4px 0;">📝 <strong>Details:</strong> ${booking.details || 'N/A'}</p>
          </div>
          
          <p>Our team will contact you within <strong>24 hours</strong> to discuss your requirements and finalize the schedule.</p>
          
          <div style="background-color: #111827; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px; font-weight: bold;">Need immediate assistance?</p>
            <p style="margin: 4px 0;">📞 <a href="tel:+919133846685" style="color: #00D6FF;">+91 9133846685</a></p>
            <p style="margin: 4px 0;">✉️ <a href="mailto:info@skyarctech.com" style="color: #00D6FF;">info@skyarctech.com</a></p>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #8892a8;">
            Best regards,<br>
            <strong>SkyArc Technologies LLP</strong><br>
            Akshayanagar, Bengaluru 560068
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    // Send to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: adminEmail,
      subject: `🚀 New Booking: ${booking.service} — ${booking.name}`,
      html: adminHtml,
    });
    console.log(`📧 Admin booking notification sent to ${adminEmail}`);

    // Send confirmation to client
    if (booking.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: booking.email,
        subject: `Booking Confirmed — ${booking.service} | SkyArc Technologies`,
        html: clientHtml,
      });
      console.log(`✉️ Client confirmation sent to ${booking.email}`);
    }
  } catch (error) {
    console.error('❌ Error sending booking email:', error.message);
  }
}

// POST /api/bookings — Create a new booking
router.post('/', async (req, res) => {
  try {
    const { service, name, phone, email, date, details } = req.body;

    if (!service || !name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Service, name, phone, and email are required.' });
    }

    const booking = new Booking({ service, name, phone, email, date, details });
    await booking.save();

    console.log(`📋 New booking: ${service} — ${name} (${phone})`);

    // Send emails (don't block the response)
    sendBookingEmail(booking);

    res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
  } catch (err) {
    console.error('Booking error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/bookings — List all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
