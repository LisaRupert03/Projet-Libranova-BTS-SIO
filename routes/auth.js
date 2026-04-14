const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// =======================
// PAGE LOGIN
// =======================
router.get('/login', (req, res) => {
  res.render('auth/login');
});


// =======================
// LOGIN
// =======================
router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/login', { error: "Utilisateur introuvable" });
    }

    // 🔥 VERSION SIMPLE (stable BTS)
    if (password !== user.password) {
      return res.render('auth/login', { error: "Mot de passe incorrect" });
    }

    // ✅ SESSION
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log("SESSION USER =", req.session.user);

    // 🔥 IMPORTANT : sauvegarder la session avant redirection
    req.session.save(() => {
      res.redirect('/');
    });

  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: "Erreur serveur" });
  }
});


// =======================
// LOGOUT
// =======================
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;