
# RentalKE API Testing Guide

This document provides instructions for testing all API endpoints in the RentalKE system. It includes the required request details (endpoint, method, headers, and request body) and example responses.

## Table of Contents

- [Authentication](#authentication)
  - [Admin Registration](#admin-registration)
  - [Admin Login](#admin-login)
  - [Manager Registration](#manager-registration)
  - [Manager Login](#manager-login)
  - [Client Registration](#client-registration)
  - [Client Login](#client-login)
  - [Email Verification](#email-verification)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
- [User Management](#user-management)
  - [Get All Users](#get-all-users)
  - [Get User by ID](#get-user-by-id)
  - [Update User Role](#update-user-role)
  - [User Profile](#user-profile)
  - [Update Profile](#update-profile)
  - [Upload Profile Image](#upload-profile-image)
- [Email Templates](#email-templates)
  - [Create Template](#create-template)
  - [Get All Templates](#get-all-templates)
  - [Get Template by ID](#get-template-by-id)
  - [Update Template](#update-template)
  - [Delete Template](#delete-template)
- [Notifications](#notifications)
  - [Send Email Notification](#send-email-notification)
  - [Create System Notification](#create-system-notification)
  - [Get User Notifications](#get-user-notifications)
  - [Mark Notification as Read](#mark-notification-as-read)
  - [Mark All Notifications as Read](#mark-all-notifications-as-read)
- [Messaging](#messaging)
  - [Send Message](#send-message)
  - [Get Conversations](#get-conversations)
  - [Get Conversation with User](#get-conversation-with-user)
  - [Delete Message](#delete-message)
- [Properties](#properties)
  - [Create Estate](#create-estate)
  - [Get All Estates](#get-all-estates)
  - [Get Estate by ID](#get-estate-by-id)
  - [Create Building](#create-building)
  - [Get All Buildings](#get-all-buildings)
  - [Get Building by ID](#get-building-by-id)
  - [Create Rental Unit](#create-rental-unit)
  - [Get All Rental Units](#get-all-rental-units)
  - [Get Rental Unit by ID](#get-rental-unit-by-id)

## Authentication

### Admin Registration

- **Endpoint**: `POST /api/v1/admin/signup`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "StrongPass123!",
  "phone": "+254712345678"
}
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "pendingUser": {
    "id": "cuid",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

### Admin Login

- **Endpoint**: `POST /api/v1/admin/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "cuid",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "department": "Executive",
    "position": "CEO"
  }
}
```

### Manager Registration

- **Endpoint**: `POST /api/v1/auth/manager/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "firstName": "Manager",
  "lastName": "User",
  "email": "manager@example.com",
  "password": "StrongPass123!",
  "phone": "+254712345678"
}
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "pendingUser": {
    "id": "cuid",
    "email": "manager@example.com",
    "firstName": "Manager",
    "lastName": "User"
  }
}
```

### Manager Login

- **Endpoint**: `POST /api/v1/auth/manager/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "manager@example.com",
  "password": "StrongPass123!"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "cuid",
    "email": "manager@example.com",
    "firstName": "Manager",
    "lastName": "User",
    "role": "MANAGER"
  }
}
```

### Client Registration

- **Endpoint**: `POST /api/v1/auth/client/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "firstName": "Client",
  "lastName": "User",
  "email": "client@example.com",
  "password": "StrongPass123!",
  "phone": "+254712345678"
}
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "pendingUser": {
    "id": "cuid",
    "email": "client@example.com",
    "firstName": "Client",
    "lastName": "User"
  }
}
```

### Client Login

- **Endpoint**: `POST /api/v1/auth/client/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "client@example.com",
  "password": "StrongPass123!"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "cuid",
    "email": "client@example.com",
    "firstName": "Client",
    "lastName": "User",
    "role": "CLIENT"
  }
}
```

### Email Verification

- **Endpoint**: `POST /api/v1/admin/verify-otp` (similar endpoints for client and manager)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "jwt_token",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "firstName": "User",
    "lastName": "Name",
    "role": "ADMIN"
  }
}
```

### Forgot Password

- **Endpoint**: `POST /api/v1/admin/forgot-password` (similar endpoints for client and manager)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

### Reset Password

- **Endpoint**: `POST /api/v1/admin/reset-password` (similar endpoints for client and manager)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewStrongPass123!"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## User Management

### Get All Users

- **Endpoint**: `GET /api/v1/admin/users`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "users": [
    {
      "id": "cuid",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "department": "Executive",
      "position": "CEO",
      "createdAt": "2023-06-10T14:30:00Z"
    },
    {
      "id": "cuid",
      "firstName": "Manager",
      "lastName": "User",
      "email": "manager@example.com",
      "role": "MANAGER",
      "department": "Properties",
      "position": null,
      "createdAt": "2023-06-11T10:15:00Z"
    }
  ]
}
```

### Get User by ID

- **Endpoint**: `GET /api/v1/admin/users/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "phone": "+254712345678",
    "role": "ADMIN",
    "department": "Executive",
    "position": "CEO",
    "profileImage": "https://example.com/profile.jpg",
    "createdAt": "2023-06-10T14:30:00Z",
    "updatedAt": "2023-06-12T09:45:00Z"
  }
}
```

### Update User Role

- **Endpoint**: `PATCH /api/v1/admin/users/:id/role`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "role": "MANAGER",
  "department": "Marketing",
  "position": "Director"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "id": "cuid",
    "firstName": "User",
    "lastName": "Name",
    "email": "user@example.com",
    "role": "MANAGER",
    "department": "Marketing",
    "position": "Director"
  }
}
```

### User Profile

- **Endpoint**: `GET /api/v1/profile`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "profile": {
    "id": "cuid",
    "firstName": "User",
    "lastName": "Name",
    "email": "user@example.com",
    "phone": "+254712345678",
    "role": "ADMIN",
    "department": "Executive",
    "position": "CEO",
    "profileImage": "https://example.com/profile.jpg",
    "createdAt": "2023-06-10T14:30:00Z",
    "updatedAt": "2023-06-12T09:45:00Z"
  }
}
```

### Update Profile

- **Endpoint**: `PATCH /api/v1/profile`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "+254712345679"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": "cuid",
    "firstName": "Updated",
    "lastName": "Name",
    "email": "user@example.com",
    "phone": "+254712345679",
    "role": "ADMIN",
    "department": "Executive",
    "position": "CEO"
  }
}
```

### Upload Profile Image

- **Endpoint**: `POST /api/v1/profile/upload-image`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: multipart/form-data`
- **Request Body**: Form data with key `profileImage` containing the image file
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "profileImage": "https://res.cloudinary.com/example/image/upload/v1623501234/profile_images/abcdef123456.jpg"
}
```

## Email Templates

### Create Template

- **Endpoint**: `POST /api/v1/email-templates`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Welcome Email",
  "subject": "Welcome to RentalKE!",
  "htmlContent": "<h1>Welcome to RentalKE, {{firstName}}!</h1><p>Your account has been created successfully.</p>",
  "variables": ["firstName", "lastName", "email"],
  "description": "Email sent to new users after registration"
}
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Email template created successfully",
  "template": {
    "id": "cuid",
    "name": "Welcome Email",
    "subject": "Welcome to RentalKE!",
    "htmlContent": "<h1>Welcome to RentalKE, {{firstName}}!</h1><p>Your account has been created successfully.</p>",
    "variables": ["firstName", "lastName", "email"],
    "description": "Email sent to new users after registration",
    "createdAt": "2023-06-10T14:30:00Z",
    "updatedAt": "2023-06-10T14:30:00Z"
  }
}
```

### Get All Templates

- **Endpoint**: `GET /api/v1/email-templates`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "templates": [
    {
      "id": "cuid",
      "name": "Welcome Email",
      "subject": "Welcome to RentalKE!",
      "htmlContent": "<h1>Welcome to RentalKE, {{firstName}}!</h1><p>Your account has been created successfully.</p>",
      "variables": ["firstName", "lastName", "email"],
      "description": "Email sent to new users after registration",
      "createdAt": "2023-06-10T14:30:00Z",
      "updatedAt": "2023-06-10T14:30:00Z"
    },
    {
      "id": "cuid2",
      "name": "Password Reset",
      "subject": "Reset Your Password",
      "htmlContent": "<h1>Hello, {{firstName}}!</h1><p>Your OTP code is: {{otp}}</p>",
      "variables": ["firstName", "otp"],
      "description": "Email sent when user requests password reset",
      "createdAt": "2023-06-11T10:15:00Z",
      "updatedAt": "2023-06-11T10:15:00Z"
    }
  ]
}
```

### Get Template by ID

- **Endpoint**: `GET /api/v1/email-templates/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "template": {
    "id": "cuid",
    "name": "Welcome Email",
    "subject": "Welcome to RentalKE!",
    "htmlContent": "<h1>Welcome to RentalKE, {{firstName}}!</h1><p>Your account has been created successfully.</p>",
    "variables": ["firstName", "lastName", "email"],
    "description": "Email sent to new users after registration",
    "createdAt": "2023-06-10T14:30:00Z",
    "updatedAt": "2023-06-10T14:30:00Z"
  }
}
```

### Update Template

- **Endpoint**: `PUT /api/v1/email-templates/:id`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "subject": "Welcome to RentalKE - Your Account is Ready!",
  "htmlContent": "<h1>Hello, {{firstName}} {{lastName}}!</h1><p>Your account has been successfully created.</p>",
  "description": "Updated welcome email for new users"
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Email template updated successfully",
  "template": {
    "id": "cuid",
    "name": "Welcome Email",
    "subject": "Welcome to RentalKE - Your Account is Ready!",
    "htmlContent": "<h1>Hello, {{firstName}} {{lastName}}!</h1><p>Your account has been successfully created.</p>",
    "variables": ["firstName", "lastName", "email"],
    "description": "Updated welcome email for new users",
    "createdAt": "2023-06-10T14:30:00Z",
    "updatedAt": "2023-06-12T09:45:00Z"
  }
}
```

### Delete Template

- **Endpoint**: `DELETE /api/v1/email-templates/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Email template deleted successfully"
}
```

## Notifications

### Send Email Notification

- **Endpoint**: `POST /api/v1/notifications/email`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "templateId": "template_cuid",
  "recipientEmail": "user@example.com",
  "variables": {
    "firstName": "John",
    "lastName": "Doe",
    "otp": "123456"
  }
}
```
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Email notification sent successfully",
  "notification": {
    "id": "cuid",
    "recipient": "user@example.com",
    "status": "sent",
    "sentAt": "2023-06-12T09:45:00Z"
  }
}
```

### Create System Notification

- **Endpoint**: `POST /api/v1/notifications`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "userId": "user_cuid",
  "message": "Your account has been upgraded to manager level"
}
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Notification created successfully",
  "notification": {
    "id": "cuid",
    "userId": "user_cuid",
    "message": "Your account has been upgraded to manager level",
    "isRead": false,
    "createdAt": "2023-06-12T09:45:00Z",
    "updatedAt": "2023-06-12T09:45:00Z"
  }
}
```

### Get User Notifications

- **Endpoint**: `GET /api/v1/notifications`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "notifications": [
    {
      "id": "cuid",
      "message": "Your account has been upgraded to manager level",
      "isRead": false,
      "createdAt": "2023-06-12T09:45:00Z",
      "updatedAt": "2023-06-12T09:45:00Z"
    },
    {
      "id": "cuid2",
      "message": "New message from Admin User",
      "isRead": true,
      "createdAt": "2023-06-11T14:30:00Z",
      "updatedAt": "2023-06-11T14:35:00Z"
    }
  ]
}
```

### Mark Notification as Read

- **Endpoint**: `PATCH /api/v1/notifications/:id/read`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "id": "cuid",
    "message": "Your account has been upgraded to manager level",
    "isRead": true,
    "updatedAt": "2023-06-12T10:00:00Z"
  }
}
```

### Mark All Notifications as Read

- **Endpoint**: `PATCH /api/v1/notifications/read-all`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 3
}
```

## Messaging

### Send Message

- **Endpoint**: `POST /api/v1/messages`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "receiverId": "user_cuid",
  "message": "Hello, how are you today?"
}
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Message sent successfully",
  "sentMessage": {
    "id": "cuid",
    "senderId": "current_user_cuid",
    "receiverId": "user_cuid",
    "message": "Hello, how are you today?",
    "status": "SENT",
    "isRead": false,
    "createdAt": "2023-06-12T10:15:00Z",
    "updatedAt": "2023-06-12T10:15:00Z"
  }
}
```

### Get Conversations

- **Endpoint**: `GET /api/v1/messages/conversations`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "conversations": [
    {
      "user": {
        "id": "user_cuid1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "profileImage": "https://example.com/john.jpg"
      },
      "lastMessage": {
        "id": "message_cuid1",
        "message": "Hello, how are you today?",
        "senderId": "current_user_cuid",
        "createdAt": "2023-06-12T10:15:00Z",
        "isRead": false
      },
      "unreadCount": 0
    },
    {
      "user": {
        "id": "user_cuid2",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "profileImage": "https://example.com/jane.jpg"
      },
      "lastMessage": {
        "id": "message_cuid2",
        "message": "Can we meet tomorrow?",
        "senderId": "user_cuid2",
        "createdAt": "2023-06-12T09:45:00Z",
        "isRead": false
      },
      "unreadCount": 3
    }
  ]
}
```

### Get Conversation with User

- **Endpoint**: `GET /api/v1/messages/conversations/:userId`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "messages": [
    {
      "id": "message_cuid1",
      "senderId": "current_user_cuid",
      "receiverId": "user_cuid",
      "message": "Hello, how are you?",
      "status": "READ",
      "isRead": true,
      "createdAt": "2023-06-11T14:30:00Z",
      "updatedAt": "2023-06-11T14:35:00Z"
    },
    {
      "id": "message_cuid2",
      "senderId": "user_cuid",
      "receiverId": "current_user_cuid",
      "message": "I'm good, thanks! How about you?",
      "status": "DELIVERED",
      "isRead": true,
      "createdAt": "2023-06-11T14:40:00Z",
      "updatedAt": "2023-06-11T14:45:00Z"
    },
    {
      "id": "message_cuid3",
      "senderId": "current_user_cuid",
      "receiverId": "user_cuid",
      "message": "Doing well! Let's meet tomorrow.",
      "status": "SENT",
      "isRead": false,
      "createdAt": "2023-06-12T10:15:00Z",
      "updatedAt": "2023-06-12T10:15:00Z"
    }
  ],
  "user": {
    "id": "user_cuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profileImage": "https://example.com/john.jpg"
  }
}
```

### Delete Message

- **Endpoint**: `DELETE /api/v1/messages/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

## Properties

### Create Estate

- **Endpoint**: `POST /api/v1/properties/manager/estate`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Green Park Estate",
  "noOfBuildings": 5,
  "latitude": -1.2921,
  "longitude": 36.8219,
  "county": "Nairobi",
  "subcounty": "Westlands",
  "description": "Modern estate with excellent amenities",
  "estateFeatures": ["Gated Community", "24/7 Security", "Swimming Pool"],
  "customFeatures": ["Playground", "Jogging Track"],
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```
- **Expected Response** (201 Created):
```json
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
    "estateFeatures": ["Gated Community", "24/7 Security", "Swimming Pool"],
    "customFeatures": ["Playground", "Jogging Track"],
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "createdAt": "2023-06-12T10:30:00Z",
    "updatedAt": "2023-06-12T10:30:00Z"
  }
}
```

### Get All Estates

- **Endpoint**: `GET /api/v1/properties/manager/estates`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "estates": [
    {
      "id": "cuid",
      "name": "Green Park Estate",
      "noOfBuildings": 5,
      "latitude": -1.2921,
      "longitude": 36.8219,
      "county": "Nairobi",
      "subcounty": "Westlands",
      "description": "Modern estate with excellent amenities",
      "estateFeatures": ["Gated Community", "24/7 Security", "Swimming Pool"],
      "customFeatures": ["Playground", "Jogging Track"],
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "buildings": [
        {
          "id": "building_cuid",
          "name": "Block A",
          "noOfUnits": 16
        }
      ],
      "createdAt": "2023-06-12T10:30:00Z",
      "updatedAt": "2023-06-12T10:30:00Z"
    }
  ]
}
```

### Get Estate by ID

- **Endpoint**: `GET /api/v1/properties/manager/estate/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "estate": {
    "id": "cuid",
    "name": "Green Park Estate",
    "noOfBuildings": 5,
    "latitude": -1.2921,
    "longitude": 36.8219,
    "county": "Nairobi",
    "subcounty": "Westlands",
    "description": "Modern estate with excellent amenities",
    "estateFeatures": ["Gated Community", "24/7 Security", "Swimming Pool"],
    "customFeatures": ["Playground", "Jogging Track"],
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "buildings": [
      {
        "id": "building_cuid",
        "name": "Block A",
        "noOfFloors": 4,
        "noOfUnits": 16,
        "images": ["https://example.com/blockA.jpg"],
        "rentalUnits": [
          {
            "id": "unit_cuid",
            "name": "A1",
            "unitType": "RESIDENTIAL",
            "unitSize": "TWO_BED",
            "unitPrice": 25000,
            "availability": "VACANT"
          }
        ]
      }
    ],
    "createdAt": "2023-06-12T10:30:00Z",
    "updatedAt": "2023-06-12T10:30:00Z"
  }
}
```

### Create Building

- **Endpoint**: `POST /api/v1/properties/manager/building`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
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
```
- **Expected Response** (201 Created):
```json
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
    "images": ["https://example.com/building1.jpg"],
    "createdAt": "2023-06-12T11:00:00Z",
    "updatedAt": "2023-06-12T11:00:00Z"
  }
}
```

### Get All Buildings

- **Endpoint**: `GET /api/v1/properties/manager/buildings`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "buildings": [
    {
      "id": "cuid",
      "name": "Block A",
      "estateId": "estate_cuid",
      "estateName": "Green Park Estate",
      "noOfFloors": 4,
      "noOfUnits": 16,
      "buildingFeatures": ["Elevator", "CCTV", "Parking"],
      "customFeatures": ["Rooftop Garden"],
      "images": ["https://example.com/building1.jpg"],
      "rentalUnits": [
        {
          "id": "unit_cuid",
          "name": "A1",
          "unitType": "RESIDENTIAL",
          "unitSize": "TWO_BED",
          "unitPrice": 25000
        }
      ],
      "createdAt": "2023-06-12T11:00:00Z",
      "updatedAt": "2023-06-12T11:00:00Z"
    }
  ]
}
```

### Get Building by ID

- **Endpoint**: `GET /api/v1/properties/manager/building/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "building": {
    "id": "cuid",
    "name": "Block A",
    "estateId": "estate_cuid",
    "estateName": "Green Park Estate",
    "noOfFloors": 4,
    "noOfUnits": 16,
    "buildingFeatures": ["Elevator", "CCTV", "Parking"],
    "customFeatures": ["Rooftop Garden"],
    "images": ["https://example.com/building1.jpg"],
    "rentalUnits": [
      {
        "id": "unit_cuid",
        "name": "A1",
        "unitType": "RESIDENTIAL",
        "unitSize": "TWO_BED",
        "unitPrice": 25000,
        "interiorFeatures": ["Built-in Wardrobe", "Modern Kitchen"],
        "images": ["https://example.com/unitA1.jpg"],
        "availability": "VACANT"
      }
    ],
    "createdAt": "2023-06-12T11:00:00Z",
    "updatedAt": "2023-06-12T11:00:00Z"
  }
}
```

### Create Rental Unit

- **Endpoint**: `POST /api/v1/properties/manager/rental-unit`
- **Headers**: 
  - `Authorization: Bearer jwt_token`
  - `Content-Type: application/json`
- **Request Body**:
```json
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
```
- **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Rental unit created successfully",
  "rentalUnit": {
    "id": "cuid",
    "name": "Unit 101",
    "unitType": "RESIDENTIAL",
    "unitSize": "TWO_BED",
    "unitPrice": 25000,
    "interiorFeatures": ["Built-in Wardrobe", "Modern Kitchen", "Balcony"],
    "images": ["https://example.com/unit1.jpg"],
    "availability": "VACANT",
    "createdAt": "2023-06-12T11:30:00Z",
    "updatedAt": "2023-06-12T11:30:00Z"
  }
}
```

### Get All Rental Units

- **Endpoint**: `GET /api/v1/properties/manager/rental-units`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "rentalUnits": [
    {
      "id": "cuid",
      "name": "Unit 101",
      "estateId": "estate_cuid",
      "estateName": "Green Park Estate",
      "buildingId": "building_cuid",
      "buildingName": "Block A",
      "unitType": "RESIDENTIAL",
      "unitSize": "TWO_BED",
      "unitPrice": 25000,
      "interiorFeatures": ["Built-in Wardrobe", "Modern Kitchen", "Balcony"],
      "images": ["https://example.com/unit1.jpg"],
      "availability": "VACANT",
      "createdAt": "2023-06-12T11:30:00Z",
      "updatedAt": "2023-06-12T11:30:00Z"
    }
  ]
}
```

### Get Rental Unit by ID

- **Endpoint**: `GET /api/v1/properties/manager/rental-unit/:id`
- **Headers**: `Authorization: Bearer jwt_token`
- **Expected Response** (200 OK):
```json
{
  "success": true,
  "rentalUnit": {
    "id": "cuid",
    "name": "Unit 101",
    "estateId": "estate_cuid",
    "estateName": "Green Park Estate",
    "buildingId": "building_cuid",
    "buildingName": "Block A",
    "unitType": "RESIDENTIAL",
    "unitSize": "TWO_BED",
    "unitPrice": 25000,
    "interiorFeatures": ["Built-in Wardrobe", "Modern Kitchen", "Balcony"],
    "images": ["https://example.com/unit1.jpg"],
    "availability": "VACANT",
    "bookings": [],
    "reviews": [],
    "createdAt": "2023-06-12T11:30:00Z",
    "updatedAt": "2023-06-12T11:30:00Z"
  }
}
```

## Error Handling

When testing API endpoints, you may encounter various error responses. Here are common error patterns to expect:

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
  "message": "Internal server error"
}
```

## Testing Tips

1. Use a tool like Postman or Insomnia for testing API endpoints
2. Save your JWT token after login for subsequent authenticated requests
3. Test both successful and error scenarios
4. Verify response formats match the documentation
5. Check rate limiting headers in responses
6. Use the development environment for testing
7. Monitor the server logs for detailed error information

