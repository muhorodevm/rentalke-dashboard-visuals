const { z } = require('zod');

const estateSchema = z.object({
  name: z.string().min(2, 'Estate name must be at least 2 characters'),
  noOfBuildings: z.number().int().positive('Number of buildings must be positive'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  county: z.string().min(2, 'County name must be at least 2 characters'),
  subcounty: z.string().min(2, 'Subcounty name must be at least 2 characters'),
  estateFeatures: z.array(z.string()).optional(),
  customFeatures: z.array(z.string()).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional()
});

const buildingSchema = z.object({
  estateId: z.string().min(1, 'Estate ID is required'),
  name: z.string().min(2, 'Building name must be at least 2 characters'),
  noOfFloors: z.number().int().positive('Number of floors must be positive'),
  noOfUnits: z.number().int().positive('Number of units must be positive'),
  buildingFeatures: z.array(z.string()).optional(),
  customFeatures: z.array(z.string()).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional()
});

const rentalUnitSchema = z.object({
  estateId: z.string().min(1, 'Estate ID is required'),
  buildingId: z.string().min(1, 'Building ID is required'),
  name: z.string().min(2, 'Unit name must be at least 2 characters'),
  unitType: z.enum(['OFFICE', 'RESIDENTIAL', 'BUSINESS']),
  unitSize: z.enum(['ONE_BED', 'TWO_BED', 'THREE_BED']).optional(),
  unitPrice: z.number().positive('Unit price must be positive'),
  interiorFeatures: z.array(z.string()).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  availability: z.enum(['VACANT', 'OCCUPIED']).optional()
});

module.exports = {
  estateSchema,
  buildingSchema,
  rentalUnitSchema
};
