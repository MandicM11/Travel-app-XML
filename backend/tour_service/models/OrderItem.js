const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    tourName: { type: String, required: true },
    price: { type: Number, required: true },
}, { collection: 'order_items' }); // Eksplicitno postavljanje imena kolekcije

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
