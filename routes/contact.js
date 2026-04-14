const express = require('express');
const router = express.Router();

router.get('/contact', (req, res) => {
  res.render('contact/index', {
    title: 'Contact'
  });
});

module.exports = router;