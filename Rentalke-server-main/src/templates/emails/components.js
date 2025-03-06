exports.getEmailHeader = () => `
  <div style="text-align: center; margin-bottom: 30px; background-color: #ffffff; padding: 20px;">
    <img src="https://res.cloudinary.com/dyzssa40e/image/upload/v1739030444/5852517438091020422_ei4dkm.jpg" 
         alt="RentalKE Logo" 
         style="max-width: 200px; height: auto;">
  </div>
`;

exports.getEmailFooter = () => `
  <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #eee;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} RentalKE. All rights reserved.</p>
    <p style="margin: 5px 0;">For support, contact us at support@rentalke.com</p>
    <div style="margin-top: 10px;">
      <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    </div>
  </div>
`;

exports.getEmailWrapper = (content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RentalKE</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        ${exports.getEmailHeader()}
        <div style="padding: 20px;">
          ${content}
        </div>
        ${exports.getEmailFooter()}
      </div>
    </body>
  </html>
`;
