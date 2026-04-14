const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const sequelize = require('./config/db');
require('./models/associations');
// =======================
// ROUTES WEB
// =======================
const indexRouter = require('./routes/index');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const authRouter = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const reviewRoutes = require('./routes/reviews');

// =======================
// ROUTES API
// =======================
const apiBooksRouter = require('./routes/apiBooks');
const apiUsersRouter = require('./routes/apiUsers');
const apiAuthRouter = require('./routes/apiAuth');
const apiOrdersRouter = require('./routes/apiOrders');
const apiStatsRouter = require('./routes/apiStats');

// =======================
// MIDDLEWARES
// =======================
const setUser = require('./middlewares/setUser');

const app = express();

// =======================
// MIDDLEWARES GLOBAUX
// =======================
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 SESSION (VERSION STABLE)
app.use(session({
  secret: 'libraNovaSecret',
  resave: false,
  saveUninitialized: false,
 
}));

// 🔥 USER GLOBAL (EJS)
app.use(setUser);

// 🔥 ADMIN FLAG
app.use((req, res, next) => {
  res.locals.isAdmin = res.locals.user && res.locals.user.role === 'admin';
  next();
});

// =======================
// CONFIG VUES
// =======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =======================
// STATIC FILES
// =======================
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// =======================
// ROUTES WEB
// =======================
app.use('/', indexRouter);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/', authRouter);     // 🔥 plus propre
app.use('/', contactRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);

// =======================
// ROUTES API
// =======================
app.use('/api/books', apiBooksRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api', apiAuthRouter);
app.use('/api/orders', apiOrdersRouter);
app.use('/api', apiStatsRouter);

// =======================
// 404
// =======================
app.use((req, res) => {
  res.status(404).render('404');
});

// =======================
// SERVER
// =======================
const PORT = 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé : http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Erreur DB :', error);
  }
})();