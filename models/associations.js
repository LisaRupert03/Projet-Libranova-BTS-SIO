const Order = require('./Order');
const OrderItem = require('./OrderItem');
const User = require('./User');
const Book = require('./Book');

// 🔥 RELATIONS PROPRES

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Book, { foreignKey: 'bookId' });