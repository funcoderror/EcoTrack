import jwt from 'jsonwebtoken';
import sql from '../database/db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Verify user still exists
    const user = await sql`
      SELECT id, email, first_name, last_name 
      FROM users 
      WHERE id = ${decoded.userId}
    `;

    if (user.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user[0].id,
      email: user[0].email,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      name: `${user[0].first_name} ${user[0].last_name}`
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};