import express from 'express';
import { 
  calculateCarbonFootprint, 
  getCarbonFootprintHistory, 
  getLatestCarbonFootprint,
  deleteCarbonFootprint 
} from '../controllers/carbonFootprintController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/carbon-footprint/calculate - Calculate carbon footprint
router.post('/calculate', calculateCarbonFootprint);

// GET /api/carbon-footprint/history - Get user's calculation history
router.get('/history', getCarbonFootprintHistory);

// GET /api/carbon-footprint/latest - Get latest calculation
router.get('/latest', getLatestCarbonFootprint);

// DELETE /api/carbon-footprint/:id - Delete a calculation
router.delete('/:id', deleteCarbonFootprint);

export default router;