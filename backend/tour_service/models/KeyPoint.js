const mongoose = require('mongoose');

const keyPointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    image: { type: String, required: false },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const KeyPoint = mongoose.model('KeyPoint', keyPointSchema);

module.exports = KeyPoint;
