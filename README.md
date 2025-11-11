# Ecotrack - Carbon Footprint Tracking Application

A full-stack web application for tracking and managing personal carbon footprint. Built with React, Node.js, Express, and PostgreSQL.

## Features

- **Public Landing Page**: Accessible homepage with information about the platform (no login required)
- **User Authentication**: Secure registration and login system with JWT tokens
- **Activity Tracking**: Log various activities that contribute to carbon emissions
- **Carbon Footprint Calculator**: Calculate your environmental impact based on lifestyle choices
- **Dashboard Analytics**: Visualize your carbon footprint with charts and statistics
- **Category Management**: Pre-defined categories for different types of activities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback on your environmental impact

## Tech Stack

### Frontend
- React 19.1.1
- React Router 7.9.4 (using 'react-router' imports)
- Axios 1.6.7 (HTTP client)
- Tailwind CSS 4.1.15
- Chart.js 4.5.1
- Vite (build tool)

### Backend
- Node.js
- Express 5.1.0
- PostgreSQL (via Neon Database)
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon Database account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecotrack
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Or use the convenience script (Windows):
   ```bash
   install-axios.bat
   ```

4. **Database Setup**
   
   If using a local PostgreSQL database:
   ```bash
   # Create a new database
   createdb ecotrack
   
   # Run the schema file
   psql -d ecotrack -f database_schema.sql
   ```
   
   If using Neon Database (recommended):
   - Create a new project at [neon.tech](https://neon.tech)
   - Copy your connection string
   - Run the provided `database_schema.sql` in the Neon console to create tables
   - The backend will only test the connection, not create tables

5. **Environment Configuration**
   
   Backend (`backend/.env`):
   ```env
   CLIENT_URL=http://localhost:5173
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   PORT=3001
   NODE_ENV=development
   ```
   
   Frontend (`frontend/.env`):
   ```env
   VITE_BASE_URL=http://localhost:3001
   ```

6. **Test Database Connection (Optional)**
   ```bash
   cd backend
   npm run test:db
   ```

7. **Start the Development Servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run start:dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   
   Or use the convenience script (Windows):
   ```bash
   start-dev.bat
   ```

8. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Landing Page: http://localhost:5173/ (accessible without login)
   - Login: http://localhost:5173/login
   - Register: http://localhost:5173/register

## API Endpoints

### Authentication (Public)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Authentication (Protected)
- `GET /api/auth/me` - Get current authenticated user

### Users (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Activities (Protected)
- `GET /api/activities` - Get user activities (with pagination and filters)
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/categories` - Get all activity categories

### Carbon Footprint (Protected)
- `POST /api/carbon-footprint/calculate` - Calculate carbon footprint
- `GET /api/carbon-footprint/history` - Get calculation history
- `GET /api/carbon-footprint/latest` - Get latest calculation
- `DELETE /api/carbon-footprint/:id` - Delete calculation

> **Note:** All protected endpoints require a valid JWT token in cookies or Authorization header.

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `first_name` - User's first name
- `last_name` - User's last name
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Activity Categories Table
- `id` - Primary key
- `name` - Category name
- `description` - Category description
- `emission_factor` - CO2 emission factor per unit
- `unit` - Unit of measurement
- `created_at` - Creation timestamp

### Activities Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `category_id` - Foreign key to activity_categories table
- `description` - Optional activity description
- `quantity` - Amount/quantity of the activity
- `co2_emissions` - Calculated CO2 emissions
- `activity_date` - Date of the activity
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Default Activity Categories

The application comes with pre-configured activity categories:

1. **Transportation**
   - Car (0.2 kg CO2/km)
   - Flight (0.25 kg CO2/km)
   - Public Transport (0.05 kg CO2/km)

2. **Energy**
   - Electricity (0.5 kg CO2/kWh)
   - Gas (2.0 kg CO2/m³)

3. **Food**
   - Meat (6.0 kg CO2/kg)
   - Dairy (3.2 kg CO2/kg)
   - Vegetables (0.4 kg CO2/kg)

4. **Waste**
   - General Waste (0.5 kg CO2/kg)
   - Recycling (0.1 kg CO2/kg)

## Application Routes

### Public Routes (No Login Required)
- `/` - Landing page with platform information and features
- `/about` - About page with mission and values
- `/contact` - Contact information and support
- `/login` - User login page
- `/register` - New user registration page

### Protected Routes (Login Required)
- `/dashboard` - Main dashboard with analytics and statistics
- `/activities` - Activity tracking and management
- `/calculate` - Carbon footprint calculator
- `/profile` - User profile management

> **Note:** If you're already logged in and try to access `/login` or `/register`, you'll be automatically redirected to the dashboard. The landing page (`/`) is always accessible regardless of authentication status.

## Usage

1. **Visit Landing Page**: Browse the public landing page to learn about Ecotrack
2. **Register/Login**: Create an account or sign in to access tracking features
3. **Calculate Footprint**: Use the calculator to assess your carbon impact
4. **Add Activities**: Log your daily activities that contribute to carbon emissions
5. **View Dashboard**: Monitor your carbon footprint with visual analytics
6. **Track Progress**: See your emissions over time and by category
7. **Manage Profile**: Update your personal information

## API Service Layer

The frontend uses a centralized API service layer (`frontend/src/services/api.js`) built with Axios:

### Features
- **Centralized Configuration**: Base URL from environment variables
- **Request/Response Interceptors**: Automatic error handling and logging
- **Cookie-based Authentication**: Automatic credential handling
- **Organized API Calls**: Separated by feature (auth, users, activities)

### API Services
- `authAPI`: Login, register, logout, getCurrentUser
- `usersAPI`: Profile management, statistics
- `activitiesAPI`: CRUD operations, categories

### Usage Example
```javascript
import { authAPI, activitiesAPI } from '../services/api';

// Login user
const result = await authAPI.login(email, password);

// Get activities with filters
const activities = await activitiesAPI.getActivities({
  category: 1,
  startDate: '2025-01-01',
  limit: 10
});
```

## Development

### Project Structure
```
ecotrack/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
├── database_schema.sql
└── README.md
```

### Available Scripts

Backend:
- `npm start` - Start production server
- `npm run start:dev` - Start development server with nodemon

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Security Features

### JWT Authentication
- **HTTP-only Cookies**: Tokens stored in secure, HTTP-only cookies
- **7-Day Expiration**: Automatic token expiration for security
- **Environment-Aware**: Different cookie settings for development and production
- **Token Verification**: Middleware validates tokens on every protected request

### Password Security
- **Bcrypt Hashing**: Passwords hashed with 10 rounds
- **Strong Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **Never Exposed**: Passwords never returned in API responses

### API Security
- **CORS Protection**: Configured allowed origins
- **Input Validation**: All inputs validated before processing
- **SQL Injection Prevention**: Parameterized queries
- **Error Handling**: Secure error messages without sensitive data

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick setup guide for local development
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide for production
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Recent changes and improvements

## Deployment

The application is configured for deployment on Vercel:

### Backend Deployment
```bash
cd backend
vercel --prod
```

### Frontend Deployment
```bash
cd frontend
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Support

For support, email support@ecotrack.com or create an issue in the repository.

---

**Ecotrack** - Making the world greener, one track at a time. 🌱