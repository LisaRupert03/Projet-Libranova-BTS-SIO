const express = require('express');
const router = express.Router();

const User = require('../models/User');
const OrderItem = require('../models/OrderItem');
const Review = require('../models/Review');
const Book = require('../models/Book');

router.get('/stats', async (req, res) => {

  try {

    console.log("=== STATS ===");

    // 👤 USERS (sans admin)
    const users = await User.findAll();
    const usersCount = users.filter(u => u.role === 'client').length;

    console.log("USERS =", usersCount);

    // ⭐ REVIEWS
    const reviews = await Review.findAll();
    const reviewsCount = reviews.length;

    console.log("REVIEWS =", reviewsCount);

    const stars = {1:0,2:0,3:0,4:0,5:0};

    reviews.forEach(r => {
      const note = r.note || r.rating;
      if (note) stars[note]++;
    });

    // 📚 BOOKS
    const books = await Book.findAll();

    // 📦 ORDER ITEMS + BOOK RELATION
    const items = await OrderItem.findAll({
      include: {
        model: Book
      }
    });

    let totalBooksSold = 0;
    let salesPerBook = {};

    // init tous les livres
    books.forEach(b => {
      salesPerBook[b.titre] = 0;
    });

    // remplir ventes
    items.forEach(item => {

      totalBooksSold += item.quantity;

      if (item.Book) {
        const titre = item.Book.titre;

        if (salesPerBook[titre] !== undefined) {
          salesPerBook[titre] += item.quantity;
        }
      }
    });

    console.log("SALES PER BOOK =", salesPerBook);

    // 🏆 BEST SELLER
    let bestBook = "Aucun";
    let bestCount = 0;

    for (let key in salesPerBook) {
      if (salesPerBook[key] > bestCount) {
        bestBook = key;
        bestCount = salesPerBook[key];
      }
    }

    console.log("BEST =", bestBook, bestCount);

    // ⚠️ STOCK FAIBLE
    const lowStockBooks = books
      .filter(b => b.stock <= 5)
      .map(b => b.titre);

    const lowStock = lowStockBooks.join(', ');

    res.json({
      users: usersCount,
      booksSold: totalBooksSold,
      reviews: reviewsCount,
      stars,
      bestBook,
      bestBookCount: bestCount,
      salesPerBook,
      lowStock
    });

  } catch (error) {
    console.error("ERREUR STATS =", error);
    res.status(500).json({ error: "Erreur stats" });
  }
});

module.exports = router;