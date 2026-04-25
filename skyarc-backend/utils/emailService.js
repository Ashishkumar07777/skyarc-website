const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendConfirmationEmail = async (email, fullName, position, applicationType) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0A0E17; padding: 30px; border-radius: 10px;">
          <h2 style="color: #00D6FF;">✅ Thank You for Applying!</h2>
          
          <p>Hello <strong>${fullName}</strong>,</p>
          
          <p>We have successfully received your application for the <strong>${position}</strong> position.</p>
          
          <p><strong>Application Type:</strong> ${applicationType === 'career' ? '👔 Career Opportunity' : '🎓 Internship Program'}</p>
          
          <p>Our team will review your application and get back to you within 5-7 business days.</p>
          
          <div style="background-color: #111827; padding: 15px; border-left: 4px solid #0066FF; margin: 20px 0;">
            <p><strong>Contact Us:</strong></p>
            <p>📞 +91 9133846685</p>
            <p>✉️ careers@skyarctech.com</p>
            <p>🌐 www.skyarctech.com</p>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #B3B3B3;">
            Best regards,<br>
            <strong>SkyArc Technologies LLP</strong><br>
            Bengaluru, India
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Application Received - SkyArc Technologies',
      html: htmlContent,
    });
    console.log(`✉️ Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
};

const sendAdminNotification = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h3>🆕 New ${application.applicationType.toUpperCase()} Application Received</h3>
        
        <p><strong>Applicant Name:</strong> ${application.fullName}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Position:</strong> ${application.positionApplyingFor}</p>
        <p><strong>Type:</strong> ${application.applicationType}</p>
        <p><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleString()}</p>
        
        <p>View application details in your admin dashboard.</p>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New ${application.applicationType.toUpperCase()} Application - ${application.fullName}`,
      html: htmlContent,
      attachments: application.resume ? [
        {
          filename: application.resume.filename,
          path: application.resume.filepath
        }
      ] : []
    });
    console.log(`📧 Admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error('❌ Error sending admin email:', error);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendAdminNotification,
};