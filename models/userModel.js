const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true ,unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;