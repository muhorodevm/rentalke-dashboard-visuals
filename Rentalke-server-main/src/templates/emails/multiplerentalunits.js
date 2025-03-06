module.exports = function rentalUnitsTemplate(manager, building, unitCount) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #007bff; padding: 20px; text-align: center;">
          <img src="https://logo.com" alt="Company Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #2c3e50;">Rental Units Successfully Added</h2>
          <p style="font-size: 16px;">Dear ${manager.firstName},</p>
          <p>Rental units have been added to your property:</p>
          <p><strong>Estate:</strong> ${building.estate.name}</p>
          <p><strong>Building:</strong> ${building.name}</p>
          <p><strong>Total Units:</strong> ${unitCount}</p>
          <p><strong>Attached Report:</strong> See attached PDF for full details.</p>
          <p>Thank you for using our platform.</p>
          <p>Best Regards,<br><strong>Your Rental Management Team</strong></p>
        </div>
      </div>
    `;
  };
  