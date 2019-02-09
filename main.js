// Default variables
var options = require("./config.js");
var web = require("./web.js");
var tmi = require("tmi.js");

var bot = new tmi.client(options);
var channels = ["#lurkerlogs", "#merijn"]; // Test channels, pull all channels from database in future commit

// Connect the bot to Twitch
bot.connect().then(function(data) {
  for (var i = 0; i < channels.length; i++) {
    bot.join(channels[i]).then(function(data) {
      bot.say(data[0], "LurkerLogs connected MrDestructoid");
    }).catch(function(err) { console.log(err) });
  }
}).catch(function(err) { console.log(err); });

bot.on("chat", function (channel, userInfo, message, self) {
  if (self) return; // Ignore own messages sent
  // Create log message on new chat
  var logMessage = {
    message: message,
    user: userInfo["user-id"],
    streamer: userInfo["room-id"],
    sentAt: userInfo["tmi-sent-ts"],
    sub: userInfo["subscriber"],
    mod: userInfo["mod"]
  }
  console.log(logMessage);
});

// Start website
web.listen(3030, function() { console.log("LurkerLogs website is now online!"); });