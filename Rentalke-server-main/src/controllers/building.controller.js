const { PrismaClient } = require('@prisma/client');
const { sendEmailNotification } = require('../utils/email');
const prisma = new PrismaClient();

exports.createBuilding = async (req, res) => {
  try {
    const managerId = req.user.id;
    const buildingData = { ...req.body, managerId };

    // Verify estate ownership and get estate details
    const estate = await prisma.estate.findFirst({
      where: { 
        id: buildingData.estateId,
        managerId
      }
    });

    if (!estate) {
      return res.status(404).json({
        success: false,
        message: 'Estate not found or you do not have permission to add buildings to it'
      });
    }

    const building = await prisma.building.create({
      data: buildingData,
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: true
      }
    });

    // Send email notification
    const emailData = {
      to: building.manager.email,
      subject: 'New Building Added',
      html: `
        <h2>Building Added Successfully</h2>
        <p>Dear ${building.manager.firstName},</p>
        <p>A new building has been added to ${estate.name} with the following details:</p>
        <ul>
          <li>Building Name: ${building.name}</li>
          <li>Number of Floors: ${building.noOfFloors}</li>
          <li>Number of Units: ${building.noOfUnits}</li>
          <li>Location: ${estate.county}, ${estate.subcounty}</li>
          <li>Features: ${building.buildingFeatures.join(', ')}</li>
        </ul>
        <p>You can now add rental units to this building.</p>
      `
    };
    await sendEmailNotification(emailData);

    res.status(201).json({
      success: true,
      message: 'Building created successfully',
      building
    });
  } catch (error) {
    console.error('Create building error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create building',
      error: error.message
    });
  }
};

exports.getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await prisma.building.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        noOfFloors: true,
        noOfUnits: true,
        buildingFeatures: true,
        location: true,
        managerId: true,
        estateId: true,
        createdAt: true,
        updatedAt: true
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: true,
        rentalUnits: {
          select: {
            id: true,
            name: true,
            unitType: true,
            unitSize: true,
            unitPrice: true,
            interiorFeatures: true,
            images: true,
            availability: true
          }
        }
      }
    });

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    res.status(200).json({
      success: true,
      building
    });
  } catch (error) {
    console.error('Get building error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get building',
      error: error.message
    });
  }
};

exports.getManagerBuildings = async (req, res) => {
  try {
    const managerId = req.user.id;
    const buildings = await prisma.building.findMany({
      where: { managerId },
      include: {
        estate: true,
        rentalUnits: {
          select: {
            id: true,
            name: true,
            unitType: true,
            unitSize: true,
            unitPrice: true,
            interiorFeatures: true,
            images: true,
            availability: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      buildings
    });
  } catch (error) {
    console.error('Get buildings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get buildings',
      error: error.message
    });
  }
};

exports.getManagerBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const building = await prisma.building.findFirst({
      where: { 
        id,
        managerId
      },
      include: {
        estate: true,
        rentalUnits: {
          select: {
            id: true,
            name: true,
            unitType: true,
            unitSize: true,
            unitPrice: true,
            interiorFeatures: true,
            images: true,
            availability: true
          }
        }
      }
    });

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found or you do not have permission to view it'
      });
    }

    res.status(200).json({
      success: true,
      building
    });
  } catch (error) {
    console.error('Get manager building error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get building',
      error: error.message
    });
  }
};

exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        estate: true,
        rentalUnits: {
          select: {
            id: true,
            name: true,
            unitType: true,
            unitSize: true,
            unitPrice: true,
            interiorFeatures: true,
            images: true,
            availability: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      buildings
    });
  } catch (error) {
    console.error('Get all buildings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get buildings',
      error: error.message
    });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;
    
    const existingBuilding = await prisma.building.findFirst({
      where: { id, managerId }
    });

    if (!existingBuilding) {
      return res.status(404).json({
        success: false,
        message: 'Building not found or you do not have permission to update it'
      });
    }

    const building = await prisma.building.update({
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
        estate: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Building updated successfully',
      building
    });
  } catch (error) {
    console.error('Update building error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update building',
      error: error.message
    });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const existingBuilding = await prisma.building.findFirst({
      where: { id, managerId }
    });

    if (!existingBuilding) {
      return res.status(404).json({
        success: false,
        message: 'Building not found or you do not have permission to delete it'
      });
    }

    await prisma.building.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Building deleted successfully'
    });
  } catch (error) {
    console.error('Delete building error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete building',
      error: error.message
    });
  }
};
