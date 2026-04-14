const User = require('../models/User');
const bcrypt = require('bcrypt');

// =======================
// 🔹 LISTE USERS (ADMIN)
// =======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.render('users/index', {
      users,
      title: 'Gestion des utilisateurs'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).render('error', {
      error,
      title: 'Erreur serveur'
    });
  }
};

// =======================
// 🔹 REGISTER
// =======================
exports.showRegister = (req, res) => {
  return res.render('auth/register', {
    title: 'Inscription'
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render('auth/register', {
        title: 'Inscription',
        error: 'Tous les champs sont obligatoires'
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Inscription',
        error: 'Email déjà utilisé'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hash,
      role: 'client'
    });

    return res.redirect('/login');

  } catch (error) {
    console.error(error);
    return res.status(500).render('error', {
      error,
      title: 'Erreur serveur'
    });
  }
};

// =======================
// 🔹 LOGIN (FIX IMPORTANT)
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/login', {
        title: 'Connexion',
        error: 'Utilisateur non trouvé'
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.render('auth/login', {
        title: 'Connexion',
        error: 'Mot de passe incorrect'
      });
    }

    // 🔥 SESSION (LE POINT CRUCIAL)
    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    console.log("SESSION USER =", req.session.user); // debug

    return res.redirect('/');

  } catch (error) {
    console.error(error);
    return res.status(500).render('error', {
      error,
      title: 'Erreur serveur'
    });
  }
};

// =======================
// 🔹 LOGOUT (FIX)
// =======================
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// =======================
// 🔹 EDIT USER
// =======================
exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    return res.render('users/modifier', {
      user,
      title: 'Modifier utilisateur'
    });

  } catch (error) {
    return res.status(500).render('error', {
      error,
      title: 'Erreur serveur'
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id }
    });

    return res.redirect('/users');

  } catch (error) {
    return res.status(500).render('error', {
      error,
      title: 'Erreur serveur'
    });
  }
};

// =======================
// 🔹 DELETE USER
// =======================
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });

    return res.redirect('/users');

  } catch (error) {
    return res.status(500).render('error', {
      error,
      title: 'Erreur serveur'
    });
  }
};