const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  const orders = req.session.orders || [];

  console.log("📦 ORDERS PAGE =", orders);

  res.render('orders/index', {
    orders
  });
});

module.exports = router;