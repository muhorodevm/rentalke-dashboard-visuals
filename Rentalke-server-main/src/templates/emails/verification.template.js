const { getEmailWrapper } = require('./components');

const getVerificationEmailTemplate = (otp, firstName = '') => {
  const content = `
    <div style="padding: 20px; background-color: #ffffff; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Verify Your Email</h2>
      
      <p style="font-size: 16px; color: #333;">Hello ${firstName ? firstName : 'there'},</p>
      
      <p style="font-size: 16px; color: #333;">Welcome to RentalKE! Please use the following OTP to verify your email address:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${otp}</span>
      </div>
      
      <p style="font-size: 16px; color: #333;">This OTP will expire in 1 hour.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <p style="font-size: 16px; color: #333;">After verification, you'll have access to:</p>
        <ul style="list-style: none; padding: 0; margin: 20px 0;">
          <li style="margin: 10px 0; color: #28a745;">✓ Browse available properties</li>
          <li style="margin: 10px 0; color: #28a745;">✓ Contact property managers</li>
          <li style="margin: 10px 0; color: #28a745;">✓ Save favorite properties</li>
          <li style="margin: 10px 0; color: #28a745;">✓ Schedule property viewings</li>
        </ul>
      </div>
      
      <div style="margin: 30px 0; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
        <p style="margin: 0; color: #1b5e20; font-size: 14px;">
          For security reasons, this OTP will expire in 1 hour. If you need a new OTP, you can request it from the verification page.
        </p>
      </div>
    </div>
  `;

  return getEmailWrapper(content);
};

module.exports = getVerificationEmailTemplate;
