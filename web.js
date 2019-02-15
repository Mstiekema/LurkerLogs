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

app.get("/streamer/:channel", function (req, res) {
	db.query("SELECT * FROM chatlogs WHERE streamerId = ?", req.params.channel, function (err, result) {
		res.render("channelLogs.html", {logs: result});
	});
});

app.get("/user/:channel", function (req, res) {
	db.query("SELECT * FROM chatlogs WHERE userId = ?", req.params.channel, function (err, result) {
		if (result && result[0]) {
			rq.getUserInfo(result[0].userId, function(err, rslt) {
				var channels = new Array();
				for (var i = 0; i < result.length; i++) {
					if (checkIfContains(channels, "id", result[i].streamerId) == -1) {
						// Name doesn't work because you can't return from a callback. Also can't push from within the callback. Will have to look into this in the future
						channels.push({
							// name: rq.getUserInfo(result[i].streamerId, function(err, res) { return res["display_name"] }),
							id: result[i].streamerId});
					}
				}
				res.render("user.html", {logs: result, channels: channels, user: rslt});
				return
			});
		} else {
			res.render("user.html", {logs: [], channels: [], user: []});
		}
	});
});

function checkIfContains(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
    if(array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}
