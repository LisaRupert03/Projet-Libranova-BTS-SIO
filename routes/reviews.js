const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// =======================
// PAGE AVIS
// =======================
router.get('/', async (req, res) => {

  const reviews = await Review.findAll({
  order: [['date', 'DESC']] // 🔥 IMPORTANT
});

  res.render('reviews/index', {
    reviews,
    user: req.session.user
  });
});


// =======================
// AJOUT AVIS
// =======================
router.post('/add', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { rating, comment } = req.body;

await Review.create({
  rating,
  commentaire: comment,
  userEmail: req.session.user.email,
  date: new Date() // 🔥 IMPORTANT
});

  if (!rating || !comment) {
    return res.redirect('/reviews');
  }


  res.redirect('/reviews');
});

module.exports = router;