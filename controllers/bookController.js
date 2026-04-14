const Book = require('../models/Book');

// 📚 LISTE DES LIVRES
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();

        res.render('books/index', {
            books,
            title: 'Catalogue des livres'
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 📖 UN LIVRE
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);

        res.render('books/show', {
            book,
            title: book.titre
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ➕ AJOUT
exports.createBook = async (req, res) => {
    try {
        await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ❌ SUPPRESSION
exports.deleteBook = async (req, res) => {
    try {
        await Book.destroy({ where: { id: req.params.id } });
        res.redirect('/books');
    } catch (error) {
        res.status(500).send(error.message);
    }
};