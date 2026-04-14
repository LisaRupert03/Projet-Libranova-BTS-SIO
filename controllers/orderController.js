const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// =======================
// 🔹 VOIR MES COMMANDES
// =======================
exports.getOrders = async (req, res) => {

    try {

        // 🔥 DEBUG
        console.log("SESSION =", req.session.user);

        // ❌ pas connecté
        if (!req.session.user) {
            return res.redirect('/login');
        }

        let orders;

        // =======================
        // 🔥 ADMIN → VOIT TOUT
        // =======================
        if (req.session.user.role === 'admin') {

            orders = await Order.findAll({
                include: [{
                    model: OrderItem
                }],
                order: [['createdAt', 'DESC']]
            });

        } else {

            // =======================
            // 🔥 CLIENT → VOIT SES COMMANDES
            // =======================
            orders = await Order.findAll({
                where: {
                    user_id: req.session.user.id
                },
                include: [{
                    model: OrderItem
                }],
                order: [['createdAt', 'DESC']]
            });

        }

        // 🔥 DEBUG IMPORTANT
        console.log("USER ID =", req.session.user.id);
        console.log("ORDERS =", orders);

        res.render('orders/index', {
            orders,
            title: 'Mes commandes'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


// =======================
// 🔹 CRÉER COMMANDE
// =======================
exports.createOrder = async (req, res) => {

    try {

        if (!req.session.user) {
            return res.redirect('/login');
        }

        const cart = req.session.cart || [];

        if (cart.length === 0) {
            return res.redirect('/cart');
        }

        // 🔥 calcul total
        let total = 0;
        cart.forEach(item => {
            total += item.prix * item.quantity;
        });

        // 🔥 création commande
        const order = await Order.create({
            numero: 'CMD-' + Date.now(),
            total: total,
            status: 'En cours de préparation',
            user_id: req.session.user.id,
            client: req.session.user.email
        });

        // 🔥 ajout des livres
        for (let item of cart) {
            await OrderItem.create({
                orderId: order.id,
                bookId: item.id,
                titre: item.titre,
                prix: item.prix,
                quantity: item.quantity
            });
        }

        // 🔥 vider panier
        req.session.cart = [];

        // 🔥 redirection ticket
        res.redirect('/orders/' + order.id);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};