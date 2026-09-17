import nodemailer from 'nodemailer';

// Lazy transporter — created on first use to avoid module-load crashes
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
}

export const sendOfferLetterEmail = async (
  email: string,
  fullName: string,
  rollNumber: string,
  track: string,
  pdfBuffer: Buffer
) => {
  const mailOptions = {
    from: `"SAMStack Tech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Internship Offer Letter - ${track}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #06b6d4;">Welcome to SAMStack Tech!</h2>
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Congratulations! We are thrilled to offer you an internship position in our <strong>${track}</strong> program.</p>
        <p>Your unique Roll Number is: <strong style="color: #06b6d4;">${rollNumber}</strong></p>
        <p>Please find your official Offer Letter attached to this email.</p>
        <p>We look forward to seeing your growth and contributions.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>SAMStack Tech Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Offer_Letter_${rollNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await getTransporter().sendMail(mailOptions);
};

export const sendCertificateEmail = async (
  email: string,
  fullName: string,
  certificateNumber: string,
  track: string,
  pdfBuffer: Buffer
) => {
  const mailOptions = {
    from: `"SAMStack Tech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Internship Certificate - ${track}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #06b6d4;">Congratulations on your successful completion!</h2>
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>We are proud to announce that you have successfully completed your internship in the <strong>${track}</strong> program.</p>
        <p>Your Certificate ID is: <strong style="color: #06b6d4;">${certificateNumber}</strong></p>
        <p>Please find your official Internship Certificate attached to this email. You can share this certificate with your professional network.</p>
        <p>We wish you the best in your future endeavors!</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>SAMStack Tech Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Certificate_${certificateNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await getTransporter().sendMail(mailOptions);
};

export const sendWelcomeEmailWithPassword = async (
  email: string,
  fullName: string,
  password: string,
  role: string
) => {
  const mailOptions = {
    from: `"SAMStack Tech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to SAMStack Tech - Your Credentials`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #06b6d4;">Welcome, ${fullName}!</h2>
        <p>An administrator has created a <strong>${role}</strong> account for you on the SAMStack Tech platform.</p>
        <p>You can log in using the following credentials:</p>
        <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0; margin-top: 8px;"><strong>Temporary Password:</strong> ${password}</p>
        </div>
        <p>Please log in and update your profile.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>SAMStack Tech Team</strong></p>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};

export const sendWelcomeEmailGoogle = async (
  email: string,
  fullName: string,
  role: string
) => {
  const mailOptions = {
    from: `"SAMStack Tech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to SAMStack Tech - Action Required`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #06b6d4;">Welcome, ${fullName}!</h2>
        <p>An administrator has created a <strong>${role}</strong> account for you on the SAMStack Tech platform.</p>
        <p>Your account is configured to use Google Sign-In for enhanced security. To access your account, please go to the login page and click <strong>"Continue with Google"</strong> using this email address.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>SAMStack Tech Team</strong></p>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};
