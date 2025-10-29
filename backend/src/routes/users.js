import express from 'express';
import sql from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await sql`
      SELECT id, email, first_name, last_name, created_at
      FROM users 
      WHERE id = ${req.user.id}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const updatedUser = await sql`
      UPDATE users 
      SET first_name = ${firstName}, last_name = ${lastName}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.user.id}
      RETURNING id, email, first_name, last_name, updated_at
    `;

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_activities,
        SUM(co2_emissions) as total_emissions,
        AVG(co2_emissions) as avg_emissions,
        MIN(activity_date) as first_activity,
        MAX(activity_date) as last_activity
      FROM activities 
      WHERE user_id = ${req.user.id}
    `;

    const monthlyStats = await sql`
      SELECT 
        DATE_TRUNC('month', activity_date) as month,
        SUM(co2_emissions) as monthly_emissions,
        COUNT(*) as monthly_activities
      FROM activities 
      WHERE user_id = ${req.user.id}
      GROUP BY DATE_TRUNC('month', activity_date)
      ORDER BY month DESC
      LIMIT 12
    `;

    const categoryStats = await sql`
      SELECT 
        ac.name as category,
        SUM(a.co2_emissions) as total_emissions,
        COUNT(*) as activity_count
      FROM activities a
      JOIN activity_categories ac ON a.category_id = ac.id
      WHERE a.user_id = ${req.user.id}
      GROUP BY ac.name
      ORDER BY total_emissions DESC
    `;

    res.json({
      overall: stats[0],
      monthly: monthlyStats,
      categories: categoryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;