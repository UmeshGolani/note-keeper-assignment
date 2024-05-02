// routes/index.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

export default router;
