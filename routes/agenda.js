var express = require("express");
const { token } = require("morgan");
var router = express.Router();

require("../models/connection");

const User = require("../models/users");

// DIDAY

// Route UNIQUE POUR recup momentDiDay & dateDiDay
router.post("/", function (req, res) {
	User.findOne({ token: req.body.token }).then((data) => {
		if (data) {
			res.json({ result: true, dateDiday: data.agenda.dateDiday, momentDiDay: data.agenda.momentDiday });
			console.log("Your availablity ");
		} else {
			res.json({ result: false, error: "Wrong task" });
		}
	});
	// res.json({ hello: "coucou", result: true });
});

router.put("/", function (req, res) {
	console.log(req.body);
	const obj = {};
	User.updateOne(
		{ token: req.body.token },
		{ $set: { agenda: { dateDiday: req.body.dateDiday, momentDiday: req.body.momentDiday } } },
	).then((docUpdate) => {
		User.findOne({ token: req.body.token }).then((data) => {
			if (data) {
				res.json({ result: true, DATA: data.agenda });
				console.log("DATA changed ok");
			} else {
				res.json({ result: false, error: "Wrong task" });
			}
		});
	});
});
// Route UNIQUE POUR MAJ momentDiDay & dateDiDay

// Update date DiDay
router.put("/diday", function (req, res) {
	User.updateOne({ token: req.body.token }, { $set: { agenda: { dateDiday: req.body.dateDiday } } }).then(() => {
		User.findOne({ token: req.body.token }).then((data) => {
			if (data) {
				res.json({ result: true, dateDiday: data.agenda.dateDiday });
				console.log("change  date ok");
			} else {
				res.json({ result: false, error: "Wrong task" });
			}
		});
	});
});

// get day DiDay
router.get("/diday", function (req, res) {
	User.findOne({ token: req.body.token }).then((data) => {
		if (data) {
			res.json({ result: true, dateDiday: data.agenda.dateDiday });
			console.log("dateDiday recup ");
		} else {
			res.json({ result: false, error: "Wrong task" });
		}
	});
});

// MOMENT

// Update moment DiDay
router.put("/moment", function (req, res) {
	console.log(req.body);
	User.updateOne({ token: req.body.token }, { $set: { agenda: { momentDiday: req.body.momentDiday } } }).then(() => {
		User.findOne({ token: req.body.token }).then((data) => {
			if (data) {
				res.json({ result: true, momentDiday: data.agenda.momentDiday });
				console.log("change moment ok");
			} else {
				res.json({ result: false, error: "Wrong task" });
			}
		});
	});
});

// get moment DiDay
router.get("/moment", function (req, res) {
	console.log(req.body);
	User.findOne({ token: req.body.token }).then((data) => {
		if (data) {
			res.json({ result: true, TonMomentDiday: data.agenda.momentDiday });
			console.log("momentDiday recup");
		} else {
			res.json({ result: false, error: "Wrong task" });
		}
	});
});

// export
module.exports = router;
