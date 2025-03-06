# RentalKE API Documentation

## Base URL
```
https://api.rentalke.com/api/v1
```

## Authentication

### Client Registration
```http
POST /auth/client/register
Content-Type: application/json

Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "StrongPass123!",
  "phone": "+254712345678"
}

Response (201 Created):
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "pendingUser": {
    "id": "cuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Manager Registration
```http
POST /auth/manager/register
Content-Type: application/json

Request:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "StrongPass123!",
  "phone": "+254712345678"
}

Response (201 Created):
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "pendingUser": {
    "id": "cuid",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

### Email Verification
```http
POST /auth/client/verify-otp
POST /auth/manager/verify-otp
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200 OK):
{
  "success": true,
  "message": "Email verified successfully",
  "token": "jwt_token",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "firstName": "User",
    "lastName": "Name",
    "role": "CLIENT"
  }
}
```

### Login
```http
POST /auth/client/login
POST /auth/manager/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "firstName": "User",
    "lastName": "Name",
    "role": "CLIENT"
  }
}
```

### Password Reset Request
```http
POST /auth/client/forgot-password
POST /auth/manager/forgot-password
Content-Type: application/json

Request:
{
  "email": "user@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

### Password Reset
```http
POST /auth/client/reset-password
POST /auth/manager/reset-password
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewStrongPass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset successful"
}
```

## Property Management

### Estates

#### Create Estate (Manager)
```http
POST /properties/manager/estate
Authorization: Bearer jwt_token
Content-Type: application/json

Request:
{
  "name": "Green Park Estate",
  "noOfBuildings": 5,
  "latitude": -1.2921,
  "longitude": 36.8219,
  "county": "Nairobi",
  "subcounty": "Westlands",
  "description": "Modern estate with excellent amenities",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}

Response (201 Created):
{
  "success": true,
  "message": "Estate created successfully",
  "estate": {
    "id": "cuid",
    "name": "Green Park Estate",
    "noOfBuildings": 5,
    "latitude": -1.2921,
    "longitude": 36.8219,
    "county": "Nairobi",
    "subcounty": "Westlands",
    "description": "Modern estate with excellent amenities",
    "images": [...],
    "createdAt": "2025-02-20T02:03:22+03:00",
    "updatedAt": "2025-02-20T02:03:22+03:00"
  }
}
```

#### Get Manager's Estates
```http
GET /properties/manager/estates
Authorization: Bearer jwt_token

Response (200 OK):
{
  "success": true,
  "estates": [
    {
      "id": "cuid",
      "name": "Green Park Estate",
      "buildings": [
        {
          "id": "cuid",
          "name": "Block A",
          "rentalUnits": [...]
        }
      ],
      ...
    }
  ]
}
```

#### Get Manager's Estate by ID
```http
GET /properties/manager/estate/:id
Authorization: Bearer jwt_token

Response (200 OK):
{
  "success": true,
  "estate": {
    "id": "cuid",
    "name": "Green Park Estate",
    "buildings": [...],
    ...
  }
}
```

#### Get All Estates (Public)
```http
GET /properties/estates/all

Response (200 OK):
{
  "success": true,
  "estates": [
    {
      "id": "cuid",
      "name": "Green Park Estate",
      "manager": {
        "id": "cuid",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com"
      },
      ...
    }
  ]
}
```

### Buildings

#### Create Building (Manager)
```http
POST /properties/manager/building
Authorization: Bearer jwt_token
Content-Type: application/json

Request:
{
  "estateId": "estate_cuid",
  "name": "Block A",
  "noOfFloors": 4,
  "noOfUnits": 16,
  "buildingFeatures": ["Elevator", "CCTV", "Parking"],
  "customFeatures": ["Rooftop Garden"],
  "images": [
    "https://example.com/building1.jpg"
  ]
}

Response (201 Created):
{
  "success": true,
  "message": "Building created successfully",
  "building": {
    "id": "cuid",
    "name": "Block A",
    "noOfFloors": 4,
    "noOfUnits": 16,
    "buildingFeatures": ["Elevator", "CCTV", "Parking"],
    "customFeatures": ["Rooftop Garden"],
    "images": [...],
    "createdAt": "2025-02-20T02:03:22+03:00",
    "updatedAt": "2025-02-20T02:03:22+03:00"
  }
}
```

#### Get Manager's Buildings
```http
GET /properties/manager/buildings
Authorization: Bearer jwt_token

Response (200 OK):
{
  "success": true,
  "buildings": [
    {
      "id": "cuid",
      "name": "Block A",
      "rentalUnits": [...],
      ...
    }
  ]
}
```

#### Get Manager's Building by ID
```http
GET /properties/manager/building/:id
Authorization: Bearer jwt_token

Response (200 OK):
{
  "success": true,
  "building": {
    "id": "cuid",
    "name": "Block A",
    "rentalUnits": [...],
    ...
  }
}
```

### Rental Units

#### Create Rental Unit (Manager)
```http
POST /properties/manager/rental-unit
Authorization: Bearer jwt_token
Content-Type: application/json

Request:
{
  "estateId": "estate_cuid",
  "buildingId": "building_cuid",
  "name": "Unit 101",
  "unitType": "RESIDENTIAL",
  "unitSize": "TWO_BED",
  "unitPrice": 25000,
  "interiorFeatures": [
    "Built-in Wardrobe",
    "Modern Kitchen",
    "Balcony"
  ],
  "images": [
    "https://example.com/unit1.jpg"
  ],
  "availability": "VACANT"
}

Response (201 Created):
{
  "success": true,
  "message": "Rental unit created successfully",
  "rentalUnit": {
    "id": "cuid",
    "name": "Unit 101",
    "unitType": "RESIDENTIAL",
    "unitSize": "TWO_BED",
    "unitPrice": 25000,
    "interiorFeatures": [...],
    "images": [...],
    "availability": "VACANT",
    "createdAt": "2025-02-20T02:03:22+03:00",
    "updatedAt": "2025-02-20T02:03:22+03:00"
  }
}
```

#### Get Manager's Rental Units
```http
GET /properties/manager/rental-units
Authorization: Bearer jwt_token

Response (200 OK):
{
  "success": true,
  "rentalUnits": [
    {
      "id": "cuid",
      "name": "Unit 101",
      ...
    }
  ]
}
```

#### Get Manager's Rental Unit by ID
```http
GET /properties/manager/rental-unit/:id
Authorization: Bearer jwt_token

Response (200 OK):
{
  "success": true,
  "rentalUnit": {
    "id": "cuid",
    "name": "Unit 101",
    ...
  }
}
```

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "message": "Unauthorized. Please login"
}
```

### Permission Error (403 Forbidden)
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### Not Found Error (404 Not Found)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (in development only)"
}
```

## Data Types

### Unit Types
- `RESIDENTIAL`
- `COMMERCIAL`

### Unit Sizes
- `BEDSITTER`
- `ONE_BED`
- `TWO_BED`
- `THREE_BED`
- `FOUR_BED`
- `PENTHOUSE`
- `SHOP`
- `OFFICE`

### Availability Status
- `VACANT`
- `OCCUPIED`
- `MAINTENANCE`
- `RESERVED`

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Applies to all endpoints
- Rate limit headers included in responses
