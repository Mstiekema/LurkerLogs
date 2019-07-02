var session = require("express-session");
var bodyParser = require("body-parser");
var rq = require("./requests.js");
var db = require("./database.js");
var express = require("express");
var app = express();

app.use(express.static("./static"));
app.use(bodyParser.json());
app.use(session({ secret: "lolxdhaha", resave: false, saveUninitialized: true, cookie: { secure: false } }));
app.engine("html", require("ejs").renderFile);
app.set("views", "./static/templates");
app.set("view engine", "ejs");
module.exports = app;

app.get("/", function (req, res) {
  db.query("SELECT * FROM channels", function (err, channels) {
    rq.getChannelStatus(channels, function (live, offline) {
      res.render("index.html", { live: live, offline: offline });
    });
  });
});

app.get("/logs/:channel", function (req, res) {
  loadLogs(req, "SELECT * FROM chatlogs WHERE streamerId = ?", [req.params.channel], function (user, logs, channels) {
    res.render("logs.html", { user: user, logs: logs, channels: channels, streamer: null, date: req.query.date });
  });
});

app.get("/logs/:channel/:user", function (req, res) {
  loadLogs(req, "SELECT * FROM chatlogs WHERE userId = ? AND streamerId = ?", [req.params.user, req.params.channel], function (user, logs, channels, timeInfo) {
    console.log(timeInfo)
    rq.getChannelNames([{ streamerId: req.params.channel }], "streamerId", function (err, streamer) {
      if (!streamer[0]) { streamerName = req.params.channel } else { streamerName = streamer[0].username }
      res.render("logs.html", { user: user, logs: logs, channels: channels, streamer: streamerName, date: req.query.date, timeInfo: timeInfo });
    });
  });
});

app.get("/user/:channel", function (req, res) {
  rq.getUserInfo(req.params.channel, function (err, user) {
    if (user) {
      db.query(`SET @rank = 0, @current = NULL`, null); // Set these variables so the next query works
      db.query(`SELECT userId, streamerId, date, log, displayName, isSub, isMod FROM (SELECT userId, streamerId, date, log, displayName, isSub, isMod, @rank := IF(@current = streamerId, @rank + 1, 1) AS rank, (@current := streamerId) FROM chatlogs WHERE displayName = '` + req.params.channel + `' OR userId = '` + req.params.channel + `' ORDER BY streamerId, date DESC) ranked WHERE rank <= 10`, function (err, result) {
        if (result && result[0]) {
          rq.getChannelNames(result, "streamerId", function (err, channels) {
            res.render("user.html", { logs: result, channels: channels, user: user });
          });
        } else {
          res.render("user.html", { logs: null, channels: null, user: user });
        }
      });
    } else {
      res.render("user.html", { logs: null, channels: null, user: null });
    }
  });
});

app.get("/stats/:channel", function (req, res) {
  res.render("stats.html", { user: req.params.channel });
});

function loadLogs(req, sql, params, next) {
  if (req.query.date) {
    sql += " AND CAST(date AS DATE) = ?";
    params.push(req.query.date);
  }
  sql += " LIMIT 500"
  if (params[1] != req.query.date) {
    rq.getUserInfo(params[1], function (err, res) {
      params[1] = res["id"];
      getLogs(sql, params, true, next);
    });
  } else {
    getLogs(sql, params, false, next);
  }
}

function getLogs(sql, params, getTime, next) {
  rq.getUserInfo(params[0], function (err, res) {
    params[0] = res["id"]; // Set to userId if it was a login name
    db.query(sql, params, function (err, result) {
      rq.getChannelNames(result, "userId", function (err, channels) {
        mergeArrays(result, channels, "userId", function (rslt) {
          if (getTime) {
            db.query("SELECT * FROM users WHERE userId = ? AND streamerId = ?", [params[0], params[1]], function (err, timeInfo) {
              timeInfo = timeInfo[0];
              if (timeInfo) {
                timeInfo.online = parseTime(timeInfo.online)
                timeInfo.offline = parseTime(timeInfo.offline)
              }
              next(res, result, rslt, timeInfo);
            });
          } else {
            next(res, result, rslt, null);
          }
        });
      });
    });
  });
}

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

// Parse minutes into days, hours & minutes
function parseTime(t) {
  var days = Math.floor(t / 24 / 60);
  var hours = Math.floor(t / 60 % 24);
  var minutes = Math.floor(t % 60);
  var timeString = (days > 0 ? days + " days, " : "") + (hours > 0 ? hours + " hours, " + (minutes < 10 ? "0" : "") : "") + minutes + " minutes"
  return timeString;
}
