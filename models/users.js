const mongoose = require('mongoose');

const agendaSchema = mongoose.Schema({
    dateDiday: Date,
    momentDiday: String,
   });

const userSchema = mongoose.Schema({
  sexe: String,
  firstname: String,
  lastname: String,
  email: String,
  age: String,
  password: String, 
  passwordCheck: String,
  city: String,
  token: String,
  mobileNum: Number,
  cgu: Boolean,
  likeReceived: [{type: mongoose.Schema.Types.ObjectId, ref: 'likeReceived'}],
  media: String,
  agenda: agendaSchema,
});

const User = mongoose.model('users', userSchema);

module.exports = User;