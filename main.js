// Default variables
var options = require("./config.js");
var req = require("./requests.js");
var db = require("./database.js");
var web = require("./web.js");
var tmi = require("tmi.js");
var bot = new tmi.client(options.twitch);

// Start website
web.listen(3030, function() { console.log("LurkerLogs website is now online!"); });

// [TEST] Get the sub badges from given channel (Merijn in this case)
req.getSubBadge("51068984", function (err, res) { console.log(res); });

// Connect the bot to Twitch
bot.connect().then(function(data) {
  db.query("SELECT * FROM channels", function (err, channels) {
    for (var i = 0; i < channels.length; i++) {
      bot.join("#" + channels[i].channelname).then(function(data) {
        console.log("LurkerLogs connected to " + data[0]);
      }).catch(function(err) { console.log(err) });
    }
  });
}).catch(function(err) { console.log(err); });

// Detect chat message
bot.on("chat", function (channel, userInfo, message, self) {
  if (self) return; // Ignore own messages sent
  var isMod;

  // Set mod to true if the user is a mod or the broadcaster
  if (userInfo["mod"] || (userInfo["badges"] && userInfo["badges"]["broadcaster"])) {isMod = true} else {isMod = false}

  // Parse the time the message was sent
  var time = new Date(0)
  time.setUTCMilliseconds(userInfo["tmi-sent-ts"]);

  // Create log message on new message sent
  var logMessage = {
    userId: userInfo["user-id"],
    displayName: userInfo["display-name"], // We can track if the user changes their username by recording the current display name
    streamerId: userInfo["room-id"],
    date: time,
    log: message, // Emoji's aren't yet parsed, so they show up as question marks
    isSub: userInfo["subscriber"],
    isMod: isMod
  }

  // Add message to the database
  db.query("INSERT INTO chatlogs SET ?", logMessage, function (err, result) { if (err) { console.log(err); } });
});
