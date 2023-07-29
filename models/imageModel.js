// models/imageModel.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});

const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
