const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
    name: String,
    url: String,
    cloudinary_id: String,
    description: String,
});

const Media = mongoose.model('media', mediaSchema);

module.exports = Media;