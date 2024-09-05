const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    profilePicture: String,
    bio: String,
    motto: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    currentPosition: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    }
}, { collection: 'users' }); // Eksplicitno postavljanje imena kolekcije

const User = mongoose.model('User', userSchema);

module.exports = User;
