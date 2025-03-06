const { getEmailWrapper } = require('./components');

const getWelcomeTemplate = (firstName, role) => {
  const content = `
    <div style="padding: 20px; background-color: #ffffff; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Welcome to RentalKE!</h2>
      
      <p style="font-size: 16px; color: #333;">Hello ${firstName},</p>
      
      <p style="font-size: 16px; color: #333;">Thank you for joining RentalKE! Your account has been successfully verified and is now ready to use.</p>
      
      ${role === 'MANAGER' ? `
        <div style="margin: 30px 0; text-align: center;">
          <p style="font-size: 16px; color: #333;">As a property manager, you can now:</p>
          <ul style="list-style: none; padding: 0; margin: 20px 0;">
            <li style="margin: 10px 0; color: #28a745;">✓ List your properties</li>
            <li style="margin: 10px 0; color: #28a745;">✓ Manage estates, buildings, and units</li>
            <li style="margin: 10px 0; color: #28a745;">✓ Track property inquiries</li>
            <li style="margin: 10px 0; color: #28a745;">✓ Schedule viewings</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      ` : `
        <div style="margin: 30px 0; text-align: center;">
          <p style="font-size: 16px; color: #333;">As a client, you can now:</p>
          <ul style="list-style: none; padding: 0; margin: 20px 0;">
            <li style="margin: 10px 0; color: #28a745;">✓ Browse available properties</li>
            <li style="margin: 10px 0; color: #28a745;">✓ Contact property managers</li>
            <li style="margin: 10px 0; color: #28a745;">✓ Save favorite properties</li>
            <li style="margin: 10px 0; color: #28a745;">✓ Schedule viewings</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/properties" 
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Browse Properties
          </a>
        </div>
      `}
      
      <div style="margin: 30px 0; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
        <p style="margin: 0; color: #0d47a1; font-size: 14px;">
          Need help getting started? Check out our <a href="${process.env.FRONTEND_URL}/help" style="color: #1976d2; text-decoration: none;">help center</a> 
          or contact our support team at <a href="mailto:support@rentalke.com" style="color: #1976d2; text-decoration: none;">support@rentalke.com</a>
        </p>
      </div>
    </div>
  `;

  return getEmailWrapper(content);
};

module.exports = getWelcomeTemplate;
