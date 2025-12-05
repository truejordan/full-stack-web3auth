import express from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

router.get('/test-db', async (req, res) => {
    console.log('🔍 Testing database connection...');
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    console.log('✅ Database connection successful:', data);
    res.json({ success: true, message: 'Database connection successful', data: data });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

export default router;