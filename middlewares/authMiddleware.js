// middleware/authMiddleware.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function registerMiddleware(req, res, next) {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.userData = {
            username,
            password: hashedPassword,
        };
        next();
    } catch (error) {
        console.log(error);
        res.status(500).render('register', { message: 'Error in registering user' });
    }
}

export async function loginMiddleware(req, res, next) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).render('login', { message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).render('login', { message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, 'secretkey');
        req.token = token;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).render('login', { message: 'Error in login' });
    }
}

