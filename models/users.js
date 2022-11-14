const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
  //createdAt: String,
  url: String,
});

const superLikeSchema = mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
	creditDemande: {type: Boolean,default: true},
});

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
  likeReceived: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  dislikeSend: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  match: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  superlikeSend: [superLikeSchema],
  media: mediaSchema,
  agenda: agendaSchema,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
