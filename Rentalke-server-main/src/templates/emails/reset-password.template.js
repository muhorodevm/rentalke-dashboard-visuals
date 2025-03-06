const { getEmailWrapper } = require('./components');

const getResetPasswordTemplate = (otp, firstName = '') => {
  const content = `
    <div style="padding: 20px; background-color: #ffffff; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Password Reset</h2>
      
      <p style="font-size: 16px; color: #333;">Hello ${firstName ? firstName : 'there'},</p>
      
      <p style="font-size: 16px; color: #333;">We received a request to reset your RentalKE account password. Please use the following OTP to reset your password:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${otp}</span>
      </div>
      
      <p style="font-size: 16px; color: #333;">This OTP will expire in 1 hour.</p>
      
      <div style="margin: 30px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    </div>
  `;

  return getEmailWrapper(content);
};

module.exports = getResetPasswordTemplate;
