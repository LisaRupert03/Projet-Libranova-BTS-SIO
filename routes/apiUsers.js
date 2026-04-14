const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET tous les users
router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// GET user par id
router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

// DELETE user
router.delete('/:id', async (req, res) => {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "Utilisateur supprimé" });
});

module.exports = router;