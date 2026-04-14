const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// =======================
// AJOUT PANIER
// =======================
router.post('/add/:id', async (req, res) => {

  const book = await Book.findByPk(req.params.id);

  if (!book) return res.redirect('/books');

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existing = req.session.cart.find(item => item.id == book.id);

  if (existing) {
    existing.quantity++;
  } else {
    req.session.cart.push({
      id: book.id,
      titre: book.titre,
      prix: book.prix,
      quantity: 1
    });
  }

  console.log("PANIER =", req.session.cart);

  res.redirect('/cart');
});


// =======================
// PAGE PANIER
// =======================
router.get('/', (req, res) => {

  const cart = req.session.cart || [];

  const total = cart.reduce((sum, item) => {
    return sum + item.prix * item.quantity;
  }, 0);

  res.render('cart/index', {
    cart,
    total
  });
});


// =======================
// CHECKOUT (CRUCIAL)
// =======================
router.post('/checkout', (req, res) => {

  console.log("🔥 CHECKOUT CLICKED");

  if (!req.session.user) {
    console.log("❌ PAS CONNECTÉ");
    return res.redirect('/login');
  }

  const cart = req.session.cart || [];

  console.log("🛒 CART =", cart);

  if (cart.length === 0) {
    console.log("❌ PANIER VIDE");
    return res.redirect('/cart');
  }

  const order = {
    numero: Date.now(),
    client: req.session.user.email,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.prix * item.quantity, 0),
    status: "En cours",
    createdAt: new Date()
  };

  if (!req.session.orders) {
    req.session.orders = [];
  }

  req.session.orders.push(order);

  console.log("✅ ORDER CREATED =", order);
  console.log("📦 ALL ORDERS =", req.session.orders);

  req.session.cart = [];

  res.render('orders/ticket', {
    order
  });
});

module.exports = router;