const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification + gestion des rôles
 * @param {Array} roles - rôles autorisés (ex: ['admin', 'client'])
 */
const auth = (roles = []) => {
  return (req, res, next) => {

    const token = req.cookies?.token;

    // ❌ Pas de token
    if (!token) {
      if (!req.originalUrl.startsWith('/api')) {
        return res.redirect('/login');
      }
      return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'SECRET_KEY'
      );

      // 👤 Injection user
      req.user = decoded;
      res.locals.user = decoded;

      // 🔐 Vérification des rôles
      if (roles.length && !roles.includes(decoded.role)) {

        if (!req.originalUrl.startsWith('/api')) {
          return res.status(403).render('403', {
            title: 'Accès refusé'
          });
        }

        return res.status(403).json({ message: 'Accès refusé' });
      }

      next();

    } catch (err) {
      console.error('JWT Error:', err.message);

      if (!req.originalUrl.startsWith('/api')) {
        return res.redirect('/login');
      }

      return res.status(401).json({
        message: 'Token invalide ou expiré'
      });
    }
  };
};

module.exports = auth;