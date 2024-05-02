// controllers/authController.js

// import { registerMiddleware, loginMiddleware } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

export async function register(req, res) {
    const { username, password } = req.userData;

    try {
        const user = new User({
            username,
            password,
        });

        await user.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).render('register', { message: 'Error in registering user' });
    }
}

export async function login(req, res) {
    const token = req.token;
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/notes');
}

