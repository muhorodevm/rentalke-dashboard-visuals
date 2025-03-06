const { PrismaClient } = require('@prisma/client');
const { sendEmailNotification } = require('../utils/email');
const { uploadToCloudinary } = require('../utils/cloudinary');
const prisma = new PrismaClient();

exports.createEstate = async (req, res) => {
  try {
    const managerId = req.user.id;
    const estateData = { ...req.body, managerId };

    // Handle image upload if present
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      estateData.imageUrl = imageUrl;
    }

    const estate = await prisma.estate.create({
      data: estateData,
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone:true
          }
        }
      }
    });

    // Send email notification
    const emailData = {
      to: estate.manager.email,
      subject: 'New Estate Created',
      html: `
        <h2>Estate Created Successfully</h2>
        <p>Dear ${estate.manager.firstName},</p>
        <p>Your estate has been created with the following details:</p>
        <ul>
          <li>Estate Name: ${estate.name}</li>
          <li>Location: ${estate.county}, ${estate.subcounty}</li>
          <li>Number of Buildings: ${estate.noOfBuildings}</li>
          <li>Coordinates: ${estate.latitude}, ${estate.longitude}</li>
        </ul>
        <p>You can now add buildings and units to your estate.</p>
      `
    };
    await sendEmailNotification(emailData);

    res.status(201).json({
      success: true,
      message: 'Estate created successfully',
      estate
    });
  } catch (error) {
    console.error('Create estate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create estate',
      error: error.message
    });
  }
};

exports.getEstateById = async (req, res) => {
  try {
    const { id } = req.params;
    const estate = await prisma.estate.findUnique({
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
        buildings: {
          include: {
            rentalUnits: true
          }
        }
      }
    });

    if (!estate) {
      return res.status(404).json({
        success: false,
        message: 'Estate not found'
      });
    }

    res.status(200).json({
      success: true,
      estate
    });
  } catch (error) {
    console.error('Get estate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get estate',
      error: error.message
    });
  }
};

exports.getManagerEstates = async (req, res) => {
  try {
    const managerId = req.user.id;
    const estates = await prisma.estate.findMany({
      where: { managerId },
      include: {
        buildings: {
          include: {
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
        }
      }
    });

    res.status(200).json({
      success: true,
      estates
    });
  } catch (error) {
    console.error('Get estates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get estates',
      error: error.message
    });
  }
};

exports.getAllEstates = async (req, res) => {
  try {
    const estates = await prisma.estate.findMany({
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        buildings: {
          include: {
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
        }
      }
    });

    res.status(200).json({
      success: true,
      estates
    });
  } catch (error) {
    console.error('Get all estates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get estates',
      error: error.message
    });
  }
};

exports.getManagerEstateById = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const estate = await prisma.estate.findFirst({
      where: { 
        id,
        managerId
      },
      include: {
        buildings: {
          include: {
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
        }
      }
    });

    if (!estate) {
      return res.status(404).json({
        success: false,
        message: 'Estate not found or you do not have permission to view it'
      });
    }

    res.status(200).json({
      success: true,
      estate
    });
  } catch (error) {
    console.error('Get manager estate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get estate',
      error: error.message
    });
  }
};

exports.updateEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;
    
    const existingEstate = await prisma.estate.findFirst({
      where: { id, managerId }
    });

    if (!existingEstate) {
      return res.status(404).json({
        success: false,
        message: 'Estate not found or you do not have permission to update it'
      });
    }

    // Handle image upload if present
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      req.body.imageUrl = imageUrl;
    }

    const estate = await prisma.estate.update({
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
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Estate updated successfully',
      estate
    });
  } catch (error) {
    console.error('Update estate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update estate',
      error: error.message
    });
  }
};

exports.deleteEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const existingEstate = await prisma.estate.findFirst({
      where: { id, managerId }
    });

    if (!existingEstate) {
      return res.status(404).json({
        success: false,
        message: 'Estate not found or you do not have permission to delete it'
      });
    }

    await prisma.estate.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Estate deleted successfully'
    });
  } catch (error) {
    console.error('Delete estate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete estate',
      error: error.message
    });
  }
};
