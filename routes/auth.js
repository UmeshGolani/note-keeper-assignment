// routes/auth.js

import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';
import { registerMiddleware, loginMiddleware } from '../middlewares/authMiddleware.js';

router.post('/register', registerMiddleware, register);
router.post('/login', loginMiddleware, login);

export default router;
