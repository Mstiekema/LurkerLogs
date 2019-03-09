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
exports.getChannelNames = function(data, attr, finished) {
  getIdArray(data, attr, function(userIds) {
    var channels = userIds.join("&id=");
    Request("GET", "https://api.twitch.tv/helix/users?id="+channels, function(e, d) {
      if (d.data) {
        var res = new Array();
        for (var i = 0; i < d.data.length; i++) {
          res.push({userId: d.data[i]["id"], username: d.data[i]["display_name"]})
        }
        finished(e, res);
      } else {
        finished(e, []);
      }
    });
  });
}

// Create array of IDs
function getIdArray(data, attr, finished) {
  var channels = new Array();
  for (var i = 0; i < data.length; i++) {
    if (checkIfContains(channels, data[i][attr]) == -1) { channels.push(data[i][attr]); }
  }
  finished(channels)
}

// Check if array contains certain value
function checkIfContains(array, value) {
  for(var i = 0; i < array.length; i += 1) {
    if(array[i] === value) {
      return i;
    }
  }
  return -1;
}

// Default request
function Request(type, url, finished) {
  req({method: type, headers: {'content-type': 'application/json', 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': conf.twitchApi.clientId}, url: url}, function (error, response, body) {
    if (error) { return finished({error: error}) }
    body = JSON.parse(body);
    finished(error, body);
  });
}
