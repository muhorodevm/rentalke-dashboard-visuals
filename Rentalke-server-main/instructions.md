
# RentalKE Backend Setup Instructions

## System Requirements

- Node.js v14 or higher
- PostgreSQL v12 or higher
- NPM or Yarn

## Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/rentalke"
   
   # JWT
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="24h"
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Email (SMTP)
   SMTP_HOST="smtp.example.com"
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER="your-email@example.com"
   SMTP_PASS="your-email-password"
   SMTP_FROM="RentalKE <your-email@example.com>"
   
   # Frontend URL
   FRONTEND_URL="http://localhost:3000"
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

## Database Setup and Migration

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE rentalke;
   ```

2. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

4. (Optional) Seed the database with initial data:
   ```bash
   npm run seed
   ```

## Starting the Server

1. Start the server in development mode:
   ```bash
   npm run dev
   ```

2. The API will be available at `http://localhost:5000`

## API Routes

### Authentication

- **Admin Authentication**
  - `POST /api/v1/admin/signup` - Register admin
  - `POST /api/v1/admin/login` - Admin login
  - `POST /api/v1/admin/verify-otp` - Verify registration OTP
  - `POST /api/v1/admin/resend-otp` - Resend OTP
  - `POST /api/v1/admin/forgot-password` - Request password reset
  - `POST /api/v1/admin/reset-password` - Reset password
  - `POST /api/v1/admin/change-password` - Change password (authenticated)

- **Manager Authentication**
  - `POST /api/v1/manager/signup` - Register manager
  - `POST /api/v1/manager/login` - Manager login
  - (Similar endpoints as admin)

- **Client Authentication**
  - `POST /api/v1/client/signup` - Register client
  - `POST /api/v1/client/login` - Client login
  - (Similar endpoints as admin)

### User Management (Admin only)

- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get user by ID
- `PATCH /api/v1/admin/users/:id/role` - Update user role, department, position

### User Profile

- `GET /api/v1/profile` - Get current user profile
- `PATCH /api/v1/profile` - Update profile
- `POST /api/v1/profile/upload-image` - Upload profile image

### Email Templates (Admin only)

- `POST /api/v1/email-templates` - Create email template
- `GET /api/v1/email-templates` - Get all templates
- `GET /api/v1/email-templates/:id` - Get template by ID
- `PUT /api/v1/email-templates/:id` - Update template
- `DELETE /api/v1/email-templates/:id` - Delete template

### Notifications

- `POST /api/v1/notifications/email` - Send email notification (Admin only)
- `POST /api/v1/notifications` - Create system notification (Admin only)
- `GET /api/v1/notifications` - Get user notifications
- `PATCH /api/v1/notifications/:id/read` - Mark notification as read
- `PATCH /api/v1/notifications/read-all` - Mark all notifications as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Messaging

- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/conversations` - Get all conversations
- `GET /api/v1/messages/conversations/:userId` - Get conversation with user
- `DELETE /api/v1/messages/:id` - Delete message

### Properties

- `POST /api/v1/properties/estates` - Create estate
- `GET /api/v1/properties/estates` - Get all estates
- `GET /api/v1/properties/estates/:id` - Get estate by ID
- (Similar endpoints for buildings and rental units)

## WebSocket Events

The system uses WebSockets for real-time messaging. WebSocket server is available at the same URL as the REST API.

### Client Events (Emit to server)

- `private_message` - Send private message
  ```javascript
  {
    receiverId: "user-id",
    message: "Hello, how are you?"
  }
  ```

- `mark_read` - Mark message as read
  ```javascript
  {
    messageId: "message-id"
  }
  ```

- `typing` - Typing indicator
  ```javascript
  {
    receiverId: "user-id",
    isTyping: true/false
  }
  ```

### Server Events (Listen from server)

- `new_message` - Receive new message
  ```javascript
  {
    message: {
      id: "message-id",
      senderId: "sender-id",
      receiverId: "receiver-id",
      message: "Hello, how are you?",
      status: "SENT",
      createdAt: "2023-06-10T14:30:00Z"
    },
    sender: {
      id: "sender-id",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "ADMIN"
    }
  }
  ```

- `message_sent` - Confirmation of sent message
  ```javascript
  {
    message: {
      id: "message-id",
      senderId: "sender-id",
      receiverId: "receiver-id",
      message: "Hello, how are you?",
      status: "SENT",
      createdAt: "2023-06-10T14:30:00Z"
    }
  }
  ```

- `message_read` - Notification that message was read
  ```javascript
  {
    messageId: "message-id"
  }
  ```

- `user_typing` - User is typing
  ```javascript
  {
    userId: "user-id",
    isTyping: true/false
  }
  ```

- `user_status` - User online/offline status
  ```javascript
  {
    userId: "user-id",
    status: "online" | "offline"
  }
  ```

## Database Migration Guidelines

When making changes to the Prisma schema, follow these steps to prevent data loss:

1. Always create a backup of your database before running migrations
   ```bash
   pg_dump -U username -d rentalke > backup_$(date +%Y%m%d).sql
   ```

2. Use Prisma's migration tools to create a migration
   ```bash
   npx prisma migrate dev --name descriptive_name_of_changes
   ```

3. Review the generated migration SQL file in the `prisma/migrations` directory before applying

4. For production environments, use the `prisma migrate deploy` command
   ```bash
   npx prisma migrate deploy
   ```

5. After migration, verify data integrity
   ```bash
   npx prisma studio
   ```

## Troubleshooting

- If you encounter connection issues with PostgreSQL, verify your database credentials and connection string
- For JWT-related issues, check that the JWT_SECRET is correctly set
- For email sending failures, verify SMTP settings
- For file upload issues, ensure the `uploads` directory exists and is writable
