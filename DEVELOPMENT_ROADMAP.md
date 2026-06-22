# Urban Services App - Complete Development Roadmap
## Node.js + React + React Native Stack

---

## 1. Project Structure Overview

```
urban-services/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database, environment
│   │   ├── controllers/        # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # Database schemas
│   │   ├── middleware/        # Auth, validation
│   │   ├── services/          # Utilities, external APIs
│   │   └── app.js             # Main app file
│   ├── package.json
│   └── .env                   # Secrets
│
├── web/                        # React Web App
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── context/           # State management
│   │   ├── styles/            # CSS/Tailwind
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── mobile/                     # React Native App
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API calls
│   │   ├── context/           # State management
│   │   └── App.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 2. Tech Stack Details

### Backend: Node.js + Express
```
Node.js 18+
├── Express 4.x           - Web framework
├── PostgreSQL           - Database
├── Sequelize            - ORM
├── JWT                  - Authentication
├── Razorpay SDK         - Payments
├── Nodemailer           - Email
└── Winston              - Logging
```

### Frontend (Web): React 18
```
React 18+
├── React Router         - Navigation
├── Axios               - API calls
├── Context API         - State management
├── Tailwind CSS        - Styling
├── React Hook Form     - Forms
└── React Query         - Data fetching
```

### Mobile: React Native
```
React Native 0.73+
├── React Navigation    - Navigation
├── Axios              - API calls
├── Context API        - State management
├── NativeWind         - Tailwind for RN
├── Async Storage      - Local storage
└── React Native Maps  - Maps integration
```

---

## 3. Database Schema (PostgreSQL)

### Core Tables

#### 1. Users (Customers)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_bookings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Service Providers
```sql
CREATE TABLE service_providers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  profile_picture VARCHAR(255),
  bio TEXT,
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  service_categories VARCHAR(255), -- JSON: ["cleaning", "plumbing"]
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_services INT DEFAULT 0,
  bank_account VARCHAR(20),
  ifsc_code VARCHAR(20),
  aadhar_number VARCHAR(20),
  verification_status ENUM('pending', 'verified', 'rejected'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Services (Offered)
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- "Home Cleaning", "Plumbing"
  category VARCHAR(50) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Provider Services (Service Provider's Offerings)
```sql
CREATE TABLE provider_services (
  id SERIAL PRIMARY KEY,
  provider_id INT NOT NULL REFERENCES service_providers(id),
  service_id INT NOT NULL REFERENCES services(id),
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider_id, service_id)
);
```

#### 5. Bookings
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES users(id),
  provider_id INT NOT NULL REFERENCES service_providers(id),
  service_id INT NOT NULL REFERENCES services(id),
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  service_address TEXT NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  platform_commission DECIMAL(10,2) NOT NULL, -- 25% of price
  provider_earning DECIMAL(10,2) NOT NULL,    -- 75% of price
  status ENUM('pending', 'accepted', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  customer_rating INT, -- 1-5 stars
  customer_feedback TEXT,
  provider_rating INT,
  provider_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Payments
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  customer_id INT NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('razorpay', 'wallet') DEFAULT 'razorpay',
  razorpay_payment_id VARCHAR(255) UNIQUE,
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Provider Payouts
```sql
CREATE TABLE provider_payouts (
  id SERIAL PRIMARY KEY,
  provider_id INT NOT NULL REFERENCES service_providers(id),
  booking_id INT NOT NULL REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  payout_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  payout_method VARCHAR(50), -- bank transfer
  payout_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. Reviews & Ratings
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  reviewer_type ENUM('customer', 'provider'),
  reviewer_id INT NOT NULL,
  rating INT NOT NULL, -- 1-5
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. API Endpoints (REST)

### Authentication
```
POST   /api/auth/register-customer      - Register customer
POST   /api/auth/register-provider      - Register provider
POST   /api/auth/login                  - Login (returns JWT)
POST   /api/auth/logout                 - Logout
POST   /api/auth/refresh-token          - Refresh JWT
```

### Services
```
GET    /api/services                    - List all services
GET    /api/services/:id                - Get service details
GET    /api/providers/:id/services      - Get provider's services
```

### Bookings (Customer)
```
POST   /api/bookings                    - Create booking
GET    /api/bookings                    - Get my bookings
GET    /api/bookings/:id                - Get booking details
PUT    /api/bookings/:id/cancel         - Cancel booking
POST   /api/bookings/:id/rate           - Rate service & provider
```

### Bookings (Provider)
```
GET    /api/provider/bookings           - Get my bookings
PUT    /api/provider/bookings/:id/accept    - Accept booking
PUT    /api/provider/bookings/:id/reject    - Reject booking
PUT    /api/provider/bookings/:id/complete - Mark complete
```

### Payments
```
POST   /api/payments/create-order       - Create Razorpay order
POST   /api/payments/verify             - Verify payment
GET    /api/payments/history            - Payment history
```

### Providers (Admin/Verification)
```
GET    /api/providers                   - List all providers
GET    /api/providers/:id               - Provider profile
PUT    /api/providers/:id/verify        - Admin verify provider
GET    /api/providers/:id/ratings       - Provider ratings
```

---

## 5. Development Timeline (Weekly)

### Week 1: Backend Setup & Database
**Days 1-2:**
- [ ] Initialize Node.js project
- [ ] Set up Express server
- [ ] Connect PostgreSQL database
- [ ] Create database schema (all tables)
- [ ] Set up environment variables

**Days 3-4:**
- [ ] Create Sequelize models for all tables
- [ ] Set up authentication (JWT)
- [ ] Create user registration & login endpoints

**Days 5-7:**
- [ ] Create service endpoints
- [ ] Create booking creation endpoints
- [ ] Set up payment gateway (Razorpay) integration
- [ ] Create error handling & middleware

**Deliverable:** Working Node.js API with authentication & core endpoints

---

### Week 2: Customer Web App (React)
**Days 1-2:**
- [ ] Set up React project with Vite
- [ ] Create routing structure (pages)
- [ ] Set up API client (Axios)
- [ ] Create authentication pages (login/register)

**Days 3-5:**
- [ ] Create service listing page
- [ ] Create service detail & booking form
- [ ] Create booking history page
- [ ] Integrate payment (Razorpay)

**Days 6-7:**
- [ ] Create rating/review system
- [ ] Add user profile page
- [ ] Polish UI & make responsive

**Deliverable:** Working customer web app where users can book services

---

### Week 3: Provider Web App (React)
**Days 1-3:**
- [ ] Provider login/registration
- [ ] Provider profile setup
- [ ] Service offerings management

**Days 4-5:**
- [ ] Booking notifications page
- [ ] Accept/reject bookings
- [ ] Booking history & earnings

**Days 6-7:**
- [ ] Provider rating dashboard
- [ ] Bank account setup for payouts
- [ ] Polish UI

**Deliverable:** Working provider dashboard

---

### Week 4: Mobile App (React Native)
**Days 1-3:**
- [ ] Set up React Native project
- [ ] Create navigation structure
- [ ] Implement authentication screens

**Days 4-6:**
- [ ] Customer home screen (service listing)
- [ ] Booking flow
- [ ] My bookings page

**Days 7:**
- [ ] Deploy to test device/emulator
- [ ] Test functionality

**Deliverable:** Working mobile app (MVP version)

---

### Week 5: Admin Panel & Polish
**Days 1-2:**
- [ ] Create basic admin dashboard
- [ ] Provider verification system
- [ ] User management

**Days 3-5:**
- [ ] Bug fixes & improvements
- [ ] Testing (manual & automated)
- [ ] Performance optimization

**Days 6-7:**
- [ ] Deploy to production
- [ ] Set up monitoring
- [ ] Documentation

**Deliverable:** Live production app!

---

## 6. Development Steps (Detailed)

### Step 1: Backend Setup (Day 1-2)

#### Initialize Project
```bash
mkdir urban-services-backend
cd urban-services-backend
npm init -y
npm install express cors dotenv nodemon
npm install --save-dev nodemon
```

#### Basic Express Server
Create `src/app.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

#### Database Connection
Install dependencies:
```bash
npm install pg sequelize
```

Create `src/config/database.js`:
```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
```

### Step 2: Database Models (Day 3)

Create `src/models/User.js`:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.0,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = User;
```

### Step 3: Authentication (Day 4)

Install JWT:
```bash
npm install jsonwebtoken bcryptjs
```

Create `src/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

Create `src/controllers/authController.js`:
```javascript
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerCustomer = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      phone,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

Create `src/routes/auth.js`:
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register-customer', authController.registerCustomer);
router.post('/login', authController.login);

module.exports = router;
```

### Step 4: Web App Setup (Day 1)

```bash
npm create vite@latest web -- --template react
cd web
npm install
npm install axios react-router-dom
```

Create `src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Create `src/pages/Login.jsx`:
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Login</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Step 5: Mobile App Setup (Day 1)

```bash
npx create-expo-app mobile
cd mobile
npm install axios @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-async-storage
```

Create `src/services/api.js`:
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://your-backend-url/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 7. Deployment Plan

### Backend (Node.js)
**Option 1: Heroku (Easy)**
```bash
npm install -g heroku-cli
heroku login
heroku create your-app-name
git push heroku main
```

**Option 2: AWS (Scalable)**
- Use EC2 or Elastic Beanstalk
- Set up RDS for PostgreSQL
- Configure security groups

**Option 3: DigitalOcean (Budget-friendly)**
- Deploy on DigitalOcean App Platform
- PostgreSQL managed database

### Web App (React)
- Deploy to Vercel: `npm install -g vercel && vercel`
- Or Netlify: Drag & drop build folder

### Mobile App (React Native)
- Build APK for Android: `eas build --platform android`
- Build IPA for iOS: `eas build --platform ios`
- Publish to stores (later)

---

## 8. Environment Variables

Create `.env` files:

**Backend `.env`:**
```
PORT=5000
DB_HOST=localhost
DB_NAME=urban_services
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Web `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

**Mobile `.env`:**
```
API_URL=http://your-backend-url/api
```

---

## 9. Key Features Checklist

### MVP (Minimum for Month 1 Launch)
- [x] User authentication (customer + provider)
- [x] Service listing
- [x] Booking creation
- [x] Payment integration (Razorpay)
- [x] Basic ratings
- [x] Provider dashboard (accept/reject)
- [x] Web app for customers
- [x] Mobile app basic version

### Phase 2 (Month 2)
- [ ] Advanced search & filters
- [ ] Chat system
- [ ] Better ratings & reviews
- [ ] Provider analytics
- [ ] Admin dashboard

### Phase 3 (Month 3+)
- [ ] Loyalty program
- [ ] Advanced scheduling
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Analytics

---

## 10. Testing & Launch Checklist

### Before Launch
- [ ] Test all auth flows (signup, login, logout)
- [ ] Test booking flow (create, pay, complete)
- [ ] Test provider acceptance/rejection
- [ ] Test payment with Razorpay test mode
- [ ] Test on real devices (web + mobile)
- [ ] Security audit (SQL injection, XSS prevention)
- [ ] Performance test (load testing)

### Launch Day
- [ ] Switch Razorpay to live mode
- [ ] Deploy backend to production
- [ ] Deploy web app to production
- [ ] Deploy mobile app to stores
- [ ] Monitor for errors
- [ ] Have support ready

---

## 11. Starting Today

### Right Now:
1. Create GitHub repo for project
2. Set up backend folder with Express
3. Create database schema in PostgreSQL
4. Create User model in Sequelize

### Tomorrow:
1. Create authentication endpoints
2. Test with Postman
3. Start React web app setup

### This Week:
1. Complete backend core APIs
2. Complete customer web app
3. Test both together

### Next Week:
1. Build provider web app
2. Build mobile app
3. Deploy to production

---

## 12. Next Steps

**What do you want me to help you with first?**

1. **Backend Setup** - I'll give you complete backend code
2. **Database Setup** - Full SQL schema + Sequelize models
3. **Web App Setup** - Complete customer app code
4. **Mobile App Setup** - Complete mobile code
5. **Full Project Scaffold** - Everything at once

**I can:**
- ✅ Write complete code files
- ✅ Explain architecture decisions
- ✅ Debug issues
- ✅ Optimize performance
- ✅ Help with deployment

**You:** Let me know which part you want to tackle first, and I'll provide complete, production-ready code! 🚀

---

**Document Version:** 1.0  
**Status:** Development Ready  
**Created:** June 2026
