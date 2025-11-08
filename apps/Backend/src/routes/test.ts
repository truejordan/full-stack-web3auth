import express from 'express';
import sql from '../config/database';

const router = express.Router();

router.get('/test-db', async (req, res) => {
    console.log('🔍 Testing database connection...');
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful:', result);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

export default router;