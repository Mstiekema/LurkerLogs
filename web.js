var session = require("express-session");
var bodyParser = require("body-parser");
var db = require("./database.js");
var express = require("express");
var app = express();

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(session({secret: "lolxdhaha", resave: false, saveUninitialized: true, cookie: { secure: false }}));
app.engine("html", require("ejs").renderFile);
app.set("views", "static/templates");
app.set("view engine", "html");
module.exports = app;

app.get("/", function (req, res) {
	res.render("index.html");
});

app.get("/streamer/:channel", function (req, res) {
	db.query("SELECT * FROM chatlogs WHERE streamerId = ?", req.params.channel, function (err, result) {
		res.render("channelLogs.html", {logs: result});
	});
});
