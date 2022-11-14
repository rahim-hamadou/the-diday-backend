require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var matchRouter = require("./routes/match");
var mediaRouter = require("./routes/media");
var agendaRouter = require("./routes/agenda");

var app = express();
const cors = require("cors");

const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/media", mediaRouter);
app.use("/match", matchRouter);
app.use("/agenda", agendaRouter);

module.exports = app;
