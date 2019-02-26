var session = require("express-session");
var bodyParser = require("body-parser");
var rq = require("./requests.js");
var db = require("./database.js");
var express = require("express");
var app = express();

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(session({secret: "lolxdhaha", resave: false, saveUninitialized: true, cookie: { secure: false }}));
app.engine("html", require("ejs").renderFile);
app.set("views", "static/templates");
app.set("view engine", "ejs");
module.exports = app;

app.get("/", function (req, res) {
	res.render("index.html");
});

app.get("/logs/:channel", function (req, res) {
	db.query("SELECT * FROM chatlogs WHERE streamerId = ?", req.params.channel, function (err, result) {
		rq.getChannelNames(result, "userId", function(err, channels) {
			mergeArrays(result, channels, "userId", function(rslt) {
				res.render("logs.html", {logs: result, channels: channels});
			});
		});
	});
});

app.get("/logs/:channel/:user", function (req, res) {
	db.query("SELECT * FROM chatlogs WHERE streamerId = '" + req.params.channel + "' AND userId = '" + req.params.user + "'", function (err, result) {
		rq.getChannelNames(result, "userId", function(err, channels) {
			mergeArrays(result, channels, "userId", function(rslt) {
				res.render("logs.html", {logs: result, channels: channels});
			});
		});
	});
});

app.get("/user/:channel", function (req, res) {
	// Improve this query so it only displays a maximum of 5 logs.
	db.query("SELECT * FROM chatlogs WHERE userId = ?", req.params.channel, function (err, result) {
		if (result && result[0]) {
			rq.getUserInfo(result[0].userId, function(err, rslt) {
				rq.getChannelNames(result, "streamerId", function(err, channels) {
					res.render("user.html", {logs: result, channels: channels, user: rslt});
				});
			});
		} else {
			res.render("user.html", {logs: [], channels: [], user: []});
		}
	});
});

function mergeArrays(arr1, arr2, attr, finished) {
	for (var i in arr1) {
		for (var e in arr2) {
			if (arr1[i][attr] == arr2[e][attr]) {
				Object.assign(arr1[i], arr2[e]);
			}
		}
	}
	finished(arr1);
}
