const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'
    }],
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'checked_out'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'carts' }); // Eksplicitno postavljanje imena kolekcije

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
