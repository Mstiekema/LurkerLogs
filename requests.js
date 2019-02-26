var conf = require("./config.js");
var req = require("request");

// Request the badges from a streamer
exports.getSubBadge = function(userId, finished) {
  Request("GET", "https://api.twitch.tv/kraken/chat/"+userId+"/badges", function(e, b) {
    finished(e, b);
  });
}

// Request the information of a Twitch user
exports.getUserInfo = function(userId, finished) {
  Request("GET", "https://api.twitch.tv/kraken/users/"+userId, function(e, b) {
    finished(e, b);
  });
}

// Request usernames of array with streamers
exports.getStreamerNames = function(userIds, finished) {
  var channels = userIds.join("&id=");
  Request("GET", "https://api.twitch.tv/helix/users?id="+channels, function(e, d) {
    var res = new Array();
    for (var i = 0; i < d.data.length; i++) {
      res.push({id: d.data[i]["id"], username: d.data[i]["display_name"]})
    }
    console.log(res)
    finished(e, res);
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
