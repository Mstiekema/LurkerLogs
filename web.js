var session = require("express-session");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(session({secret: "lolxdhaha", resave: false, saveUninitialized: true, cookie: { secure: false }}));
app.engine("html", require("ejs").renderFile);
app.set("views", "static/templates");
app.set("view engine", "html");
module.exports = app;

app.get('/', function (req, res) {
	res.render('index.html');
});
