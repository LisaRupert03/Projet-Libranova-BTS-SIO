const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =======================
// REGISTER
// =======================
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔐 hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'client' // 👈 par défaut
    });

    res.json({
      success: true,
      message: 'Compte créé avec succès'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =======================
// LOGIN
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // 🔐 vérification mot de passe
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // 🎟️ token
    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      'SECRET_KEY',
      { expiresIn: '1d' }
    );

    // 🍪 cookie
    res.cookie('token', token, { httpOnly: true });

    res.json({
      success: true,
      message: 'Connexion réussie'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};