const nodemailer = require('nodemailer');
const getVerificationEmailTemplate = require('../templates/emails/verification.template');
const getResetPasswordTemplate = require('../templates/emails/reset-password.template');
const getWelcomeEmailTemplate = require('../templates/emails/welcome.template');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sendVerificationEmail = async (email, otp, firstName) => {
  const html = getVerificationEmailTemplate(otp, firstName);
  return await sendEmail(email, 'Email Verification - RentalKE', html);
};

const sendResetPasswordEmail = async (email, otp, firstName) => {
  const html = getResetPasswordTemplate(otp, firstName);
  return await sendEmail(email, 'Password Reset - RentalKE', html);
};

const sendWelcomeEmail = async (email, firstName) => {
  const html = getWelcomeEmailTemplate(firstName);
  return await sendEmail(email, 'Welcome to RentalKE!', html);
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail
};
