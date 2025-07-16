const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Book = require('../models/Book');

// POST Add a new book (Admin only)
router.post('/', [authMiddleware, adminAuth], async (req, res) => {
    const { title, author } = req.body;
    try {
        const newBook = new Book({ title, author, addedBy: req.user.id });
        const book = await newBook.save();
        res.json(book);
    } catch (err) { res.status(500).send('Server Error'); }
});

// GET all books
router.get('/', authMiddleware, async (req, res) => {
    try {
        const books = await Book.find().sort({ title: 1 });
        res.json(books);
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;