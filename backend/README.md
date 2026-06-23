# Ghar Pahuch Seva Backend API

Complete Node.js + Express + PostgreSQL backend for Ghar Pahuch Seva marketplace.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb ghar_pahuch_seva

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your_password
```

**Option B: Cloud Database (AWS RDS / Heroku PostgreSQL)**
```bash
# Update .env with cloud database credentials
```

### 3. Set Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env file and fill in:
# - PORT=5000
# - DB credentials
# - JWT_SECRET (generate a random key)
# - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
```
POST   /api/auth/register-customer   - Register as customer
POST   /api/auth/login-customer      - Login as customer
POST   /api/auth/register-provider   - Register as provider
POST   /api/auth/login-provider      - Login as provider
```

### Services
```
GET    /api/services                 - List all services
GET    /api/services/categories      - Get service categories
GET    /api/services/:serviceId      - Get service details
POST   /api/services                 - Create service (admin)
```

### Bookings
```
POST   /api/bookings                 - Create booking (customer)
GET    /api/bookings/my-bookings     - Get my bookings (customer)
GET    /api/bookings/provider/bookings - Get bookings (provider)
PUT    /api/bookings/:bookingId/accept    - Accept booking (provider)
PUT    /api/bookings/:bookingId/reject    - Reject booking (provider)
PUT    /api/bookings/:bookingId/complete  - Complete booking (provider)
POST   /api/bookings/:bookingId/rate      - Rate booking
```

### Payments
```
POST   /api/payments/create-order    - Create Razorpay order
POST   /api/payments/verify          - Verify payment
GET    /api/payments/history         - Get payment history
```

## Testing with Postman

### 1. Register Customer
```
POST /api/auth/register-customer
Body (JSON):
{
  "email": "customer@example.com",
  "phone": "9999999999",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login Customer
```
POST /api/auth/login-customer
Body (JSON):
{
  "email": "customer@example.com",
  "password": "Password123!"
}
```

### 3. Get Services
```
GET /api/services
```

### 4. Create Booking
```
POST /api/bookings
Headers: Authorization: Bearer {token}
Body (JSON):
{
  "providerId": 1,
  "serviceId": 1,
  "serviceDate": "2026-07-15",
  "serviceTime": "10:00",
  "serviceAddress": "123 Main St, City",
  "servicePrice": 500
}
```

## Database Schema

### Tables
- **users** - Customer accounts
- **service_providers** - Provider accounts
- **services** - Available services
- **bookings** - Service bookings
- **payments** - Payment records

## Environment Variables

```
PORT=5000                          # Server port
NODE_ENV=development               # Environment
DB_HOST=localhost                  # Database host
DB_PORT=5432                       # Database port
DB_NAME=ghar_pahuch_seva             # Database name
DB_USER=postgres                   # Database user
DB_PASSWORD=password               # Database password
JWT_SECRET=your_secret_key         # JWT signing key
RAZORPAY_KEY_ID=your_key_id        # Razorpay key ID
RAZORPAY_KEY_SECRET=your_secret    # Razorpay secret
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js             # Database configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── bookingController.js    # Booking logic
│   │   ├── serviceController.js    # Service logic
│   │   └── paymentController.js    # Payment logic
│   ├── models/
│   │   ├── User.js                 # Customer model
│   │   ├── ServiceProvider.js       # Provider model
│   │   ├── Service.js              # Service model
│   │   └── Booking.js              # Booking model
│   ├── routes/
│   │   ├── auth.js                 # Auth routes
│   │   ├── services.js             # Service routes
│   │   ├── bookings.js             # Booking routes
│   │   └── payments.js             # Payment routes
│   ├── middleware/
│   │   └── auth.js                 # Authentication middleware
│   └── app.js                      # Main app file
├── package.json
├── .env.example
└── README.md
```

## Common Issues

### 1. Database Connection Error
```
Solution: Check DB credentials in .env file
```

### 2. Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### 3. JWT Token Errors
```
Solution: Regenerate JWT_SECRET and restart server
```

## Next Steps

1. ✅ Backend API running
2. ⬜ Build React web app (in `/web` folder)
3. ⬜ Build React Native mobile app (in `/mobile` folder)
4. ⬜ Add more features (chat, analytics, etc.)
5. ⬜ Deploy to production

## Deployment

### Heroku
```bash
npm install -g heroku-cli
heroku login
heroku create your-app-name
git push heroku main
```

### DigitalOcean
```bash
# Push to DigitalOcean App Platform
# Set environment variables in dashboard
```

### AWS
```bash
# Deploy to EC2 or Elastic Beanstalk
# Use RDS for database
```

## Support

For issues or questions, check the main README.md
