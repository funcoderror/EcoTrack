# Ecotrack - Carbon Footprint Tracking Application

A full-stack web application for tracking and managing personal carbon footprint. Built with React, Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: Secure registration and login system
- **Activity Tracking**: Log various activities that contribute to carbon emissions
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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Activities
- `GET /api/activities` - Get user activities (with pagination and filters)
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/categories` - Get all activity categories

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

## Usage

1. **Register/Login**: Create an account or sign in
2. **Add Activities**: Log your daily activities that contribute to carbon emissions
3. **View Dashboard**: Monitor your carbon footprint with visual analytics
4. **Track Progress**: See your emissions over time and by category
5. **Manage Profile**: Update your personal information

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

## Support

For support, email support@ecotrack.com or create an issue in the repository.

---

**Ecotrack** - Making the world greener, one track at a time. 🌱