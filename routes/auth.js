const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// GET: Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST: Handle Registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.send('Error registering user');
    }
});

// GET: Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST: Handle Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.send('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send('Incorrect password');

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.send('Login error');
    }
});

// GET: Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
