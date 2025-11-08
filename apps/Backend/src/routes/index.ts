import express from 'express';
import testRoutes from './test';
import userRoutes from './users';
import web3authRoutes from './web3auth';

const router = express.Router();

router.use('/test', testRoutes);
router.use('/users', userRoutes);
router.use('/web3auth', web3authRoutes);

export default router;