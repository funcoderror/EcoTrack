# Ecotrack - Carbon Footprint Tracking Application

A modern full-stack web application for tracking and managing personal carbon footprint. Built with React 19, Node.js, Express, and PostgreSQL (Neon Database).

## Features

- **Public Landing Page**: Accessible homepage with information about the platform (no login required)
- **User Authentication**: Secure registration and login system with JWT tokens and HTTP-only cookies
- **Carbon Footprint Calculator**: Interactive calculator with visual breakdown and global comparisons
- **Goals Tracking**: Set and track carbon reduction goals with detailed activity logging
- **Dashboard Analytics**: Comprehensive dashboard with statistics, charts, and recent activity
- **Visual Comparisons**: Chart.js powered visualizations comparing your footprint to global averages
- **Personalized Recommendations**: AI-driven tips based on your carbon footprint breakdown
- **Category Management**: Pre-defined activity categories with emission factors
- **Responsive Design**: Modern dark theme with smooth animations and mobile-friendly interface
- **Real-time Updates**: Instant feedback on your environmental impact

## Tech Stack

### Frontend
- React 19.1.1
- React Router 7.9.4 (using 'react-router' imports)
- Axios 1.13.1 (HTTP client)
- Tailwind CSS 4.1.15 with @tailwindcss/vite
- Chart.js 4.5.1 (for data visualization)
- Lucide React 0.548.0 (icon library)
- Vite 7.1.7 (build tool)

### Backend
- Node.js
- Express 5.1.0
- PostgreSQL (via Neon Database with @neondatabase/serverless)
- JWT Authentication (jsonwebtoken 9.0.2)
- bcrypt 6.0.0 (password hashing)
- cookie-parser 1.4.7 (cookie management)
- CORS enabled with credentials support

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
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Authentication (Protected)
- `GET /api/auth/me` - Get current authenticated user

### Users (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile (firstName, lastName)
- `GET /api/users/stats` - Get user statisticsthly, categories)

### Goals (Protected)
- `GET /api/goals` - Get user goals (with pagination and filters)
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/goals/categories` - Get all activity categories

### Carbon Footprint (Protected)
- `POST /api/carbon-footprint/calculate` - Calculate carbon footprint
  - Body: `{ transport, electricitry` - Get cights, waste }`
  - Returns: Total CO₂ and breakdown by category
- `GET /api/carbon-footprint/history`- Delete calculaon history (with pagination)
- `GET /api/carbon-footprint/latest` - Get latest calculation
- `DELETE /api/carbon-footprint/:id` - Delete calculation

> **Note:** All protected endpoints require a valid JWT

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

### Activities Table (Goals)
- `id` - Primary key
- `user_id` - Foreign key to users table
- `category_id` - Foreign key to activity_categories table
- `description` - Optional activity description
- `quantity` - Amount/quantity of the activity
- `co2_emissions` - Calculated CO2 emissions
- `activity_date` - Date of the activity
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Carbon Footprint Calculations Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `transport_km_daily` - Daily transport distance in km
- `electricity_kwh_monthly` - Monthly electricity usage in kWh
- `diet_type` - Diet type (1.0=Vegan, 1.5=Vegetarian, 2.5=Mixed, 3.5=High Meat)
- `flights_yearly` - Number of flights per year
- `waste_kg_weekly` - Weekly waste in kg
- `transport_co2` - Calculated transport CO2 emissions
- `electricity_co2` - Calculated electricity CO2 emissions
- `diet_co2` - Diet-related CO2 emissions
- `flights_co2` - Flight-related CO2 emissions
- `waste_co2` - Waste-related CO2 emissions
- `total_co2_tons` - Total annual CO2 emissions in tons
- `calculation_date` - Timestamp of calculation

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
- `/dashboard` - Main dashboard with analytics, statistics, and recent goals
  - Total emissions, goal count, averages
  - Emissions by category breakdown
  - Recent goals list
  - Quick action buttons
- `/calculate` - Interactive carbon footprint calculator
  - Input fields for transport, electricity, diet, flights, waste
  - Visual breakdown with Chart.js comparison charts
  - Global average comparisons
  - Personalized reduction recommendations
- `/goals` - Goals tracking and management
  - Create, edit, delete goals
  - Filter by category and date range
  - Pagination support
  - Real-time CO2 calculations
- `/profile` - User profile management
  - Update first name and last name
  - View account information

> **Note:** If you're already logged in and try to access `/login` or `/register`, you'll be automatically redirected to the dashboard. The landing page (`/`) is always accessible regardless of authentication status.

## Usage

1. **Visit Landing Page**: Browse the public landing page to learn about Ecotrack
2. **Register/Login**: Create an account or sign in to access tracking features
3. **Calculate Footprint**: Use the interactive calculator to assess your carbon impact
   - Enter daily transport distance (km)
   - Input monthly electricity usage (kWh)
   - Select your diet type (Vegan, Vegetarian, Mixed, High Meat)
   - Add number of flights taken last year
   - Estimate weekly waste generation (kg)
   - View detailed breakdown with visual charts
   - Compare against global averages
   - Get personalized reduction tips
4. **Set Goals**: Track carbon reduction goals
   - Add goals with specific categories
   - Monitor CO2 emissions per goal
   - Filter and search your goals
   - Edit or delete goals as needed
5. **View Dashboard**: Monitor your carbon footprint with visual analytics
   - See total emissions and goal statistics
   - View emissions breakdown by category
   - Check recent goals
   - Access quick actions
6. **Track Progress**: See your emissions over time and by category
7. **Manage Profile**: Update your personal information

## API Service Layer

The frontend uses a centralized API service layer (`frontend/src/services/api.js`) built with Axios:

### Features
- **Centralized Configuration**: Base URL from environment variables (`VITE_BASE_URL`)
- **Request/Response Interceptors**: Automatic error handling and logging
- **Cookie-based Authentication**: Automatic credential handling with `withCredentials: true`
- **Token Backup**: LocalStorage fallback for Authorization header
- **Automatic Redirects**: Unauthorized (401) requests redirect to login
- **Organized API Calls**: Separated by feature (auth, users, goals, carbon footprint)

### API Services
- `authAPI`: Login, register, logout, getCurrentUser
- `usersAPI`: Profile management (get/update), statistics
- `goalsAPI`: CRUD operations, categories, filtering with pagination
- `carbonFootprintAPI`: Calculate, history, latest, delete calculations

### Usage Example
```javascript
import { authAPI, goalsAPI, carbonFootprintAPI } from '../services/api';

// Login user
const result = await authAPI.login(email, password);

// Get goals with filters
const goals = await goalsAPI.getGoals({
  category: 1,
  startDate: '2025-01-01',
  limit: 10
});

// Calculate carbon footprint
const result = await carbonFootprintAPI.calculate(
  transport, electricity, diet, flights, waste
);
```

## Development

### Project Structure
```
ecotrack/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authControllers.js
│   │   │   └── carbonFootprintController.js
│   │   ├── database/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── carbonFootprint.js
│   │   │   ├── goals.js
│   │   │   └── users.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Calculate.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LearnMore.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SetGoals.jsx
│   │   │   └── SignUp.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── animations.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
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

## Carbon Footprint Calculation

The calculator uses scientifically-based emission factors to estimate annual CO₂ emissions:

### Emission Factors
- **Transport**: 0.2 kg CO₂ per km × daily distance × 365 days
- **Electricity**: Monthly kWh × 12 months × 0.0007 emission factor
- **Diet**: 
  - Vegan: 1.0 tons CO₂/year
  - Vegetarian: 1.5 tons CO₂/year
  - Mixed: 2.5 tons CO₂/year
  - High Meat: 3.5 tons CO₂/year
- **Flights**: 0.25 tons CO₂ per round-trip flight
- **Waste**: Weekly kg × 52 weeks × 0.001 emission factor

### Global Averages (for comparison)
- Transport: 1.8 tons CO₂/year
- Electricity: 1.2 tons CO₂/year
- Diet: 2.5 tons CO₂/year
- Flights: 0.9 tons CO₂/year
- Waste: 0.6 tons CO₂/year
- **Total Average**: 7.0 tons CO₂/year

## Design & UI

- **Dark Theme**: Modern black background with green accents
- **Smooth Animations**: CSS animations for fade-in, slide, and hover effects
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Interactive Charts**: Chart.js visualizations with gradients and tooltips
- **Custom Styling**: Inline CSS animations for dynamic effects
- **Loading States**: Skeleton screens and spinners for better UX
- **Form Validation**: Real-time validation with error messages

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

Both frontend and backend include `vercel.json` configuration files for seamless deployment.

### Environment Variables
Ensure the following environment variables are set in your Vercel project:

**Backend:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret key for JWT token generation
- `CLIENT_URL` - Frontend URL (e.g., https://your-app.vercel.app)
- `NODE_ENV` - Set to `production`

**Frontend:**
- `VITE_BASE_URL` - Backend API URL (e.g., https://your-api.vercel.app)

## Key Features & Highlights

### Interactive Carbon Calculator
- Real-time CO₂ calculations with visual feedback
- Comparison charts showing your footprint vs. global averages
- Personalized recommendations based on your emissions
- Beautiful gradient-based visualizations with Chart.js
- Breakdown by transport, electricity, diet, flights, and waste

### Goals Management System
- Track carbon reduction goals with detailed activity logging
- Filter by category and date range
- Real-time CO2 emission calculations per goal
- Optimistic UI updates for instant feedback
- Edit and delete functionality with confirmation

### Comprehensive Dashboard
- Overview statistics (total emissions, goal count, averages)
- Category-based emissions breakdown with progress bars
- Recent goals display
- Monthly and overall statistics
- Quick action buttons for common tasks

### Modern User Experience
- Dark theme with green accents
- Smooth CSS animations (fade-in, slide, hover effects)
- Responsive design for all devices
- Loading states and error handling
- Intuitive navigation with protected routes
- Form validation with helpful error messages

## Support

For support, create an issue in the repository or contact the development team.

---

**Ecotrack** - Making the world greener, one track at a time. 🌱