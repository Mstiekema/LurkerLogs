var conf = require("./config.js");
var req = require("request");

// Request the badges from a streamer
exports.getSubBadge = function(userId, finished) {
  Request("GET", "https://api.twitch.tv/kraken/chat/"+userId+"/badges", function(e, b) {
    finished(e, b);
  });
}

// Default request
function Request(type, url, finished) {
  req({method: type, headers: {'content-type': 'application/json', 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': conf.twitchApi.clientId}, url: url}, function (error, response, body) {
    if (error) { return finished({error: error}) }
    body = JSON.parse(body);
    finished(error, body);
  });
}
