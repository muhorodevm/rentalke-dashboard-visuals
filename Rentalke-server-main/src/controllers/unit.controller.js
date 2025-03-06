const { PrismaClient } = require('@prisma/client');
const { sendEmailNotification } = require('../utils/email');
const prisma = new PrismaClient();


exports.createRentalUnit = async (req, res) => {
  try {
    const managerId = req.user.id;
    const unitData = { ...req.body, managerId };

    // Verify building ownership and get building/estate details
    const building = await prisma.building.findFirst({
      where: { 
        id: unitData.buildingId,
        managerId
      },
      include: {
        estate: true
      }
    });

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found or you do not have permission to add units to it'
      });
    }

    // Verify estateId matches building's estate
    if (unitData.estateId !== building.estate.id) {
      return res.status(400).json({
        success: false,
        message: 'Estate ID does not match the building\'s estate'
      });
    }

    const rentalUnit = await prisma.rentalUnit.create({
      data: unitData,
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: false,
        building: false
      }
    });

    // Send email notification
    const emailData = {
      to: rentalUnit.manager.email,
      subject: 'New Rental Unit Added',
      html: `
        <h2>Rental Unit Added Successfully</h2>
        <p>Dear ${rentalUnit.manager.firstName},</p>
        <p>A new rental unit has been added with the following details:</p>
        <ul>
          <li>Unit Name: ${rentalUnit.name}</li>
          <li>Building: ${building.name}</li>
          <li>Estate: ${building.estate.name}</li>
          <li>Type: ${rentalUnit.unitType}</li>
          <li>Size: ${rentalUnit.unitSize || 'N/A'}</li>
          <li>Price: ${rentalUnit.unitPrice}</li>
          <li>Location: ${building.estate.county}, ${building.estate.subcounty}</li>
          <li>Interior Features: ${rentalUnit.interiorFeatures.join(', ')}</li>
        </ul>
      `
    };
    await sendEmailNotification(emailData);

    res.status(201).json({
      success: true,
      message: 'Rental unit created successfully',
      rentalUnit
    });
  } catch (error) {
    console.error('Create rental unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rental unit',
      error: error.message
    });
  }
};

exports.createMultipleRentalUnits = async (req, res) => {
  try {
    const { buildingId, unitType, unitSize, interiorFeatures, unitPrice, availability, unitPrefix = "Room", unitCount, images = [] } = req.body;

    if (!unitCount || unitCount < 1) {
      return res.status(400).json({ success: false, message: "Unit count must be at least 1" });
    }

    // Convert prefix to uppercase for case-insensitive comparison
    const upperCasePrefix = unitPrefix.toUpperCase();

    // Fetch building details to get managerId & estateId
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      include: { estate: true }
    });

    if (!building) {
      return res.status(404).json({ success: false, message: "Building not found." });
    }

    const managerId = building.managerId;
    const estateId = building.estate.id;

    // Get last unit with the same prefix (case-insensitive)
    const lastUnit = await prisma.rentalUnit.findFirst({
      where: {
        buildingId,
        name: { startsWith: upperCasePrefix } // Ensures we get the last unit with this prefix
      },
      orderBy: { createdAt: "desc" },
      select: { name: true }
    });

    let lastNumber = 0;
    if (lastUnit && lastUnit.name) {
      const match = lastUnit.name.match(/\d+$/); // Extract last number
      lastNumber = match ? parseInt(match[0], 10) : 0;
    }

    // Insert multiple units
    const createdUnits = [];
    for (let i = 1; i <= unitCount; i++) {
      const unitName = `${upperCasePrefix} ${lastNumber + i}`;
      const createdAt = new Date();

      const newUnit = await prisma.rentalUnit.create({
        data: {
          name: unitName,
          estateId,
          buildingId,
          managerId,
          unitType,
          unitSize,
          interiorFeatures,
          unitPrice,
          availability,
          images, // Store images array
          createdAt
        },
        select: {
          id: true,
          name: true,
          unitType: true,
          unitSize: true,
          interiorFeatures: true,
          unitPrice: true,
          availability: true,
          images: true,
          createdAt: true
        }
      });

      createdUnits.push(newUnit);
    }

    res.status(201).json({
      success: true,
      message: `${unitCount} rental units created successfully`,
      managerId,
      estateId,
      buildingId,
      units: createdUnits
    });

  } catch (error) {
    console.error("Create multiple rental units error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create rental units",
      error: error.message
    });
  }
};





// Function to generate PDF in memory


exports.getRentalUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const rentalUnit = await prisma.rentalUnit.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: false,
        building: false
      }
    });

    if (!rentalUnit) {
      return res.status(404).json({
        success: false,
        message: 'Rental unit not found'
      });
    }

    res.status(200).json({
      success: true,
      rentalUnit
    });
  } catch (error) {
    console.error('Get rental unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rental unit',
      error: error.message
    });
  }
};

exports.getManagerRentalUnits = async (req, res) => {
  try {
    const managerId = req.user.id;
    const rentalUnits = await prisma.rentalUnit.findMany({
      where: { managerId },
      include: {
        estate: false,
        building: false
      }
    });

    res.status(200).json({
      success: true,
      rentalUnits
    });
  } catch (error) {
    console.error('Get rental units error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rental units',
      error: error.message
    });
  }
};

exports.getManagerRentalUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const rentalUnit = await prisma.rentalUnit.findFirst({
      where: { 
        id,
        managerId
      },
      include: {
        estate: false,
        building: false
      }
    });

    if (!rentalUnit) {
      return res.status(404).json({
        success: false,
        message: 'Rental unit not found or you do not have permission to view it'
      });
    }

    res.status(200).json({
      success: true,
      rentalUnit
    });
  } catch (error) {
    console.error('Get manager rental unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rental unit',
      error: error.message
    });
  }
};

exports.getAllRentalUnits = async (req, res) => {
  try {
    const rentalUnits = await prisma.rentalUnit.findMany({
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: false,
        building: false
      }
    });

    res.status(200).json({
      success: true,
      rentalUnits
    });
  } catch (error) {
    console.error('Get all rental units error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rental units',
      error: error.message
    });
  }
};

exports.updateRentalUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;
    
    const existingUnit = await prisma.rentalUnit.findFirst({
      where: { id, managerId }
    });

    if (!existingUnit) {
      return res.status(404).json({
        success: false,
        message: 'Rental unit not found or you do not have permission to update it'
      });
    }

    const rentalUnit = await prisma.rentalUnit.update({
      where: { id },
      data: req.body,
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: false,
        building: false
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rental unit updated successfully',
      rentalUnit
    });
  } catch (error) {
    console.error('Update rental unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rental unit',
      error: error.message
    });
  }
};

exports.deleteRentalUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const existingUnit = await prisma.rentalUnit.findFirst({
      where: { id, managerId }
    });

    if (!existingUnit) {
      return res.status(404).json({
        success: false,
        message: 'Rental unit not found or you do not have permission to delete it'
      });
    }

    await prisma.rentalUnit.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Rental unit deleted successfully'
    });
  } catch (error) {
    console.error('Delete rental unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rental unit',
      error: error.message
    });
  }
};
