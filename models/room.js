const mongoose = require('mongoose');

const message = mongoose.Schema({
    createdAt: String,
    content: String,
   });

const roomSchema = mongoose.Schema({
    userOne: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    userTwo: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    channel: String,
    message: [message],
});

const Room = mongoose.model('room', roomSchema);

module.exports = Room;