const mongoose = require('mongoose');

const tourPurchaseTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    purchaseDate: { type: Date, default: Date.now },
    token: { type: String, required: true, unique: true },
}, { collection: 'tour_purchase_tokens' }); // Eksplicitno postavljanje imena kolekcije

const TourPurchaseToken = mongoose.model('TourPurchaseToken', tourPurchaseTokenSchema);

module.exports = TourPurchaseToken;
