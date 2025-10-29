import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import activityRoutes from './routes/activities.js';
import carbonFootprintRoutes from './routes/carbonFootprint.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/carbon-footprint', carbonFootprintRoutes);

app.get("/", (_,res) =>{
    res.json({ message: "Server is Live!" })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ecotrack API is running' });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})

export default app;