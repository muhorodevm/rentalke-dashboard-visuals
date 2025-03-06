# RentalKE API

RentalKE is a comprehensive property management system that enables property managers to list and manage their estates, buildings, and rental units, while allowing clients to browse and book properties.

## Features

- **Authentication & Authorization**
  - Role-based access control (Client, Manager, Admin)
  - JWT-based authentication
  - OTP verification for account security
  - Password reset functionality

- **Property Management**
  - Hierarchical property structure (Estate → Building → Unit)
  - Location tracking with coordinates
  - Detailed property features and amenities
  - Image management
  - Availability status tracking

- **Email Notifications**
  - Branded email templates
  - Welcome emails
  - Property creation confirmations
  - OTP verifications
  - Password reset instructions

## Tech Stack

- Node.js & Express.js
- PostgreSQL with Prisma ORM
- JWT for authentication
- Nodemailer for emails
- Zod for validation
- Cloudinary for image storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- SMTP server for emails

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MuhoroDev-tony/Rentalke-server.git
   cd rentalkeserver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rentalke"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

# Email
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
SMTP_FROM="noreply@rentalke.com"

# Frontend
FRONTEND_URL="http://localhost:8080"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## API Documentation

See [API.md](API.md) for detailed API documentation.

## Project Structure

```
rentalkeserver/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares
│   ├── routes/          # API routes
│   ├── templates/       # Email templates
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   └── index.js         # App 
|   |__app.js
├── prisma/
│   └── schema.prisma    # Database schema
└── tests/               # Test files
|___server.js            #App entry
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email anthonymuhoro7@gmail.com  or create an issue in the repository.
