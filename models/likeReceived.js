const mongoose = require('mongoose');

const likeReceivedSchema = mongoose.Schema({
  userId : string, 
});

const LikeReceived = mongoose.model('likes', likeReceivedSchema);

module.exports = LikeReceived;