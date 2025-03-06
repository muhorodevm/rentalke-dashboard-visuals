const getEmailHeader = () => `
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://res.cloudinary.com/dyzssa40e/image/upload/v1739030444/5852517438091020442_ei4dkm.jpg" 
         alt="RentalKE Logo" 
         style="max-width: 200px; height: auto;">
  </div>
`;

const getEmailFooter = () => `
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center;">
    <p>This is an automated message from RentalKE. Please do not reply to this email.</p>
    <p>© ${new Date().getFullYear()} RentalKE. All rights reserved.</p>
  </div>
`;

const getEmailWrapper = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    ${getEmailHeader()}
    ${content}
    ${getEmailFooter()}
  </div>
`;

exports.getEstateCreatedEmail = (estate, managerName) => {
  const content = `
    <div style="color: #333;">
      <h2 style="color: #2c3e50; text-align: center;">Estate Created Successfully</h2>
      <p style="font-size: 16px;">Dear ${managerName},</p>
      <p style="font-size: 16px;">Your estate has been created with the following details:</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Estate Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;"><strong>Estate Name:</strong> ${estate.name}</li>
          <li style="margin: 10px 0;"><strong>Location:</strong> ${estate.county}, ${estate.subcounty}</li>
          <li style="margin: 10px 0;"><strong>Number of Buildings:</strong> ${estate.noOfBuildings}</li>
          <li style="margin: 10px 0;"><strong>Coordinates:</strong> ${estate.latitude}, ${estate.longitude}</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #28a745;">You can now add buildings and units to your estate.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Go to Dashboard
        </a>
      </div>
    </div>
  `;
  return {
    subject: 'Estate Created Successfully | RentalKE',
    html: getEmailWrapper(content)
  };
};

exports.getBuildingCreatedEmail = (building, estate, managerName) => {
  const content = `
    <div style="color: #333;">
      <h2 style="color: #2c3e50; text-align: center;">Building Added Successfully</h2>
      <p style="font-size: 16px;">Dear ${managerName},</p>
      <p style="font-size: 16px;">A new building has been added to ${estate.name} with the following details:</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Building Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;"><strong>Building Name:</strong> ${building.name}</li>
          <li style="margin: 10px 0;"><strong>Number of Floors:</strong> ${building.noOfFloors}</li>
          <li style="margin: 10px 0;"><strong>Number of Units:</strong> ${building.noOfUnits}</li>
          <li style="margin: 10px 0;"><strong>Location:</strong> ${estate.county}, ${estate.subcounty}</li>
          <li style="margin: 10px 0;"><strong>Features:</strong> ${building.buildingFeatures.join(', ')}</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #28a745;">You can now add rental units to this building.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/dashboard/buildings/${building.id}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Manage Building
        </a>
      </div>
    </div>
  `;
  return {
    subject: 'Building Added Successfully | RentalKE',
    html: getEmailWrapper(content)
  };
};

exports.getUnitCreatedEmail = (unit, building, estate, managerName) => {
  const content = `
    <div style="color: #333;">
      <h2 style="color: #2c3e50; text-align: center;">Rental Unit Added Successfully</h2>
      <p style="font-size: 16px;">Dear ${managerName},</p>
      <p style="font-size: 16px;">A new rental unit has been added with the following details:</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Unit Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;"><strong>Unit Name:</strong> ${unit.name}</li>
          <li style="margin: 10px 0;"><strong>Building:</strong> ${building.name}</li>
          <li style="margin: 10px 0;"><strong>Estate:</strong> ${estate.name}</li>
          <li style="margin: 10px 0;"><strong>Type:</strong> ${unit.unitType}</li>
          <li style="margin: 10px 0;"><strong>Size:</strong> ${unit.unitSize || 'N/A'}</li>
          <li style="margin: 10px 0;"><strong>Price:</strong> KES ${unit.unitPrice.toLocaleString()}</li>
          <li style="margin: 10px 0;"><strong>Location:</strong> ${estate.county}, ${estate.subcounty}</li>
          <li style="margin: 10px 0;"><strong>Interior Features:</strong> ${unit.interiorFeatures.join(', ')}</li>
        </ul>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/dashboard/units/${unit.id}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Manage Unit
        </a>
      </div>
    </div>
  `;
  return {
    subject: 'Rental Unit Added Successfully | RentalKE',
    html: getEmailWrapper(content)
  };
};

exports.getWelcomeEmail = (firstName, email) => {
  const content = `
    <div style="color: #333;">
      <h2 style="color: #2c3e50; text-align: center;">Welcome to RentalKE!</h2>
      <p style="font-size: 16px;">Dear ${firstName},</p>
      <p style="font-size: 16px;">Thank you for joining RentalKE! Your account has been successfully created and verified.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Account Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;"><strong>Email:</strong> ${email}</li>
        </ul>
      </div>
      <p style="font-size: 16px;">You can now:</p>
      <ul style="list-style: none; padding: 0;">
        <li style="margin: 10px 0;">✓ Browse available properties</li>
        <li style="margin: 10px 0;">✓ Book viewings</li>
        <li style="margin: 10px 0;">✓ Contact property managers</li>
        <li style="margin: 10px 0;">✓ Save your favorite properties</li>
      </ul>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/login" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Get Started
        </a>
      </div>
    </div>
  `;
  return {
    subject: 'Welcome to RentalKE!',
    html: getEmailWrapper(content)
  };
};
