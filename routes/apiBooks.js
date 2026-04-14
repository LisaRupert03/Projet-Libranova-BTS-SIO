const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET JSON
router.get('/', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

// POST JSON
router.post('/', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

module.exports = router;