const express = require('express');
const router = express.Router();

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Book = require('../models/Book');


// =======================
// 🔥 CREER COMMANDE
// =======================
router.post('/', async (req, res) => {
  try {

    const { clientName, items } = req.body;

    let total = 0;

    // 🔥 calcul total + mise à jour stock
    for (const item of items) {

      const book = await Book.findByPk(item.id);

      if (!book) continue;

      // ❗ sécurité stock
      if (book.stock < item.quantity) {
        return res.status(400).json({ error: "Stock insuffisant" });
      }

      book.stock -= item.quantity;
      await book.save();

      total += book.prix * item.quantity;
    }

    // 🔥 création commande
    const order = await Order.create({
      numero: 'CMD-' + Date.now(),
      client: clientName,
      status: 'En cours de préparation',
      total
    });

    // 🔥 création items
    for (const item of items) {

      const book = await Book.findByPk(item.id);

      await OrderItem.create({
        orderId: order.id,
        bookId: item.id,
        titre: book.titre,
        prix: book.prix,
        quantity: item.quantity
      });
    }

    res.json(order);

  } catch (error) {
    console.error("ERREUR CREATE :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// =======================
// 🔥 RECUPERER COMMANDES
// =======================
router.get('/', async (req, res) => {
  try {

    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);

  } catch (error) {
    console.error("ERREUR GET :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;