var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* ***************** ROUTE SIGN UP *******************/

router.post("/signup", (req, res) => {
	console.log("recupération des données via le front", req.body);
	if (
		!checkBody(req.body, [
			"sexe",
			"firstname",
			"lastname",
			"email",
			"age",
			"password",
			"passwordCheck",
			"city",
			"mobileNum",
			"cgu",
		])
	) {
		res.json({ result: false, error: "Missing or empty fields" });
		return;
	}
	// Check if the user has not already been registered
	User.findOne({ email: req.body.email }).then((data) => {
		if (data === null) {
			const hash = bcrypt.hashSync(req.body.password, 10);
			// Création du nouveau User
			const newUser = new User({
				sexe: req.body.sexe,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				age: req.body.age,
				password: hash,
				passwordCheck: hash,
				city: req.body.city,
				token: uid2(32),
				mobileNum: req.body.mobile,
				cgu: true,
			});

			newUser.save().then((newDoc) => {
				res.json({ result: true, newUser: newDoc });
			});
		} else {
			// User already exists in database
			res.json({ result: false, error: "User already exists" });
		}
	});
});

// Connexion user
router.post("/signin", (req, res) => {
	if (!checkBody(req.body, ["email", "password"])) {
		res.json({ result: false, error: "Missing or empty fields" });
		return;
	}

	User.findOne({ email: req.body.email }).then((data) => {
		if (data && bcrypt.compareSync(req.body.password, data.password)) {
			res.json({ result: true, userConnect: data });
		} else {
			res.json({ result: false, error: "User not found or wrong password" });
		}
	});
});

// test get user
router.get("/test", function (req, res) {
	User.find().then((response) => {
		res.json({ result: true, error: response });
	});
});

/* ***************** ROUTE LIKE/MATCH  *******************/

module.exports = router;
