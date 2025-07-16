const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    // Added passwordHint to be extracted from the request body
    const { firstName, lastName, email, password, passwordHint } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Added passwordHint to the new User object
        const user = new User({ firstName, lastName, email, password, passwordHint });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully!' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;