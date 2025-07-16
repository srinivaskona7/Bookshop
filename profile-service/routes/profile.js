const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

// GET current user's profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).send('Server Error'); }
});

// PUT update current user's details (name)
router.put('/details', authMiddleware, async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        await user.save();
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser);
    } catch (err) { res.status(500).send('Server Error'); }
});

// PUT update current user's profile picture
router.put('/picture', authMiddleware, async (req, res) => {
    const { imageData } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.profilePicture = imageData;
        await user.save();
        res.json({ msg: 'Profile picture updated.', profilePicture: user.profilePicture });
    } catch (err) { res.status(500).send('Server Error'); }
});


// --- Admin Routes ---

router.get('/users', [authMiddleware, adminAuth], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/:id', [authMiddleware, adminAuth], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/:id/role', [authMiddleware, adminAuth], async (req, res) => {
    const { role } = req.body;
    if (!['Admin', 'Manager', 'Customer'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid role' });
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        res.json(user);
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;