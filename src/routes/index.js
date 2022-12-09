import express from 'express';
import users from './users'

const router = express.Router();

router.use('/api/v1/users', users)

export default router;
