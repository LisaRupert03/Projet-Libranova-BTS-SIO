const express = require('express');
const router = express.Router();
const User = require('../models/User');

// =======================
// 👤 PROFIL
// =======================
router.get('/profile', (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('users/profile', {
    title: 'Mon profil',
    user: req.session.user
  });
});


// =======================
// 👨‍💼 ADMIN
// =======================
router.get('/', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  if (req.session.user.role !== 'admin') {
    return res.redirect('/');
  }

  const users = await User.findAll();

  res.render('users/index', {
    users,
    title: 'Gestion utilisateurs'
  });
});

module.exports = router;