const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    console.log("BODY =", req.body);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ USER INTROUVABLE");
      return res.json({ success: false });
    }

    if (password !== user.password) {
      console.log("❌ MAUVAIS PASSWORD");
      return res.json({ success: false });
    }

    // ✅ SESSION
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log("✅ SESSION USER =", req.session.user);

    // 🔥 CRUCIAL : attendre la sauvegarde
    req.session.save(() => {
      res.json({ success: true });
    });

  } catch (error) {
    console.error("❌ ERROR LOGIN :", error);
    res.json({ success: false });
  }
});

module.exports = router;