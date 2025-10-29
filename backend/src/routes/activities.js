import express from 'express';
import sql from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all activity categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await sql`
      SELECT id, name, description, emission_factor, unit
      FROM activity_categories
      ORDER BY name
    `;

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get user activities
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let activities, totalCount;

    if (category && startDate && endDate) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category} AND a.activity_date >= ${startDate} AND a.activity_date <= ${endDate}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category} AND a.activity_date >= ${startDate} AND a.activity_date <= ${endDate}
      `;
    } else if (category && startDate) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category} AND a.activity_date >= ${startDate}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category} AND a.activity_date >= ${startDate}
      `;
    } else if (category && endDate) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category} AND a.activity_date <= ${endDate}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category} AND a.activity_date <= ${endDate}
      `;
    } else if (category) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.category_id = ${category}
      `;
    } else if (startDate && endDate) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.activity_date >= ${startDate} AND a.activity_date <= ${endDate}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.activity_date >= ${startDate} AND a.activity_date <= ${endDate}
      `;
    } else if (startDate) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.activity_date >= ${startDate}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.activity_date >= ${startDate}
      `;
    } else if (endDate) {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id} AND a.activity_date <= ${endDate}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id} AND a.activity_date <= ${endDate}
      `;
    } else {
      activities = await sql`
        SELECT 
          a.id,
          a.description,
          a.quantity,
          a.co2_emissions,
          a.activity_date,
          a.created_at,
          ac.name as category_name,
          ac.unit
        FROM activities a
        JOIN activity_categories ac ON a.category_id = ac.id
        WHERE a.user_id = ${req.user.id}
        ORDER BY a.activity_date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCount = await sql`
        SELECT COUNT(*) as count
        FROM activities a
        WHERE a.user_id = ${req.user.id}
      `;
    }

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount[0].count),
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

// Create new activity
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { categoryId, description, quantity, activityDate } = req.body;

    if (!categoryId || !quantity || !activityDate) {
      return res.status(400).json({ error: 'Category, quantity, and date are required' });
    }

    // Get category emission factor
    const category = await sql`
      SELECT emission_factor FROM activity_categories WHERE id = ${categoryId}
    `;

    if (category.length === 0) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const co2Emissions = parseFloat(quantity) * parseFloat(category[0].emission_factor);

    const newActivity = await sql`
      INSERT INTO activities (user_id, category_id, description, quantity, co2_emissions, activity_date)
      VALUES (${req.user.id}, ${categoryId}, ${description || ''}, ${quantity}, ${co2Emissions}, ${activityDate})
      RETURNING id, description, quantity, co2_emissions, activity_date, created_at
    `;

    res.status(201).json({
      message: 'Activity created successfully',
      activity: newActivity[0]
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Update activity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, description, quantity, activityDate } = req.body;

    // Check if activity belongs to user
    const existingActivity = await sql`
      SELECT id FROM activities WHERE id = ${id} AND user_id = ${req.user.id}
    `;

    if (existingActivity.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Get category emission factor if category is being updated
    let co2Emissions;
    if (categoryId && quantity) {
      const category = await sql`
        SELECT emission_factor FROM activity_categories WHERE id = ${categoryId}
      `;
      co2Emissions = parseFloat(quantity) * parseFloat(category[0].emission_factor);
    }

    const updatedActivity = await sql`
      UPDATE activities 
      SET 
        category_id = COALESCE(${categoryId}, category_id),
        description = COALESCE(${description}, description),
        quantity = COALESCE(${quantity}, quantity),
        co2_emissions = COALESCE(${co2Emissions}, co2_emissions),
        activity_date = COALESCE(${activityDate}, activity_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${req.user.id}
      RETURNING id, description, quantity, co2_emissions, activity_date, updated_at
    `;

    res.json({
      message: 'Activity updated successfully',
      activity: updatedActivity[0]
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedActivity = await sql`
      DELETE FROM activities 
      WHERE id = ${id} AND user_id = ${req.user.id}
      RETURNING id
    `;

    if (deletedActivity.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;