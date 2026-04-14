const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

// Liste des livres
router.get('/', controller.getAllBooks);

// Détail d’un livre
router.get('/:id', controller.getOneBook);

// Ajouter un livre (admin)
router.post('/add', controller.createBook);

// Supprimer un livre
router.get('/delete/:id', controller.deleteBook);

module.exports = router;