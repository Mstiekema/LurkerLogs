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
  console.log(userId)
  if (isNaN(userId)) {
    Request("GET", "https://api.twitch.tv/helix/users?login="+userId, function(e, b) {
      if (b.data) {
        finished(e, b.data[0]);
      } else {
        finished(e, null);
      }
    });
  } else {
      Request("GET", "https://api.twitch.tv/helix/users?id="+userId, function(e, b) {
      if (b.data) {
        finished(e, b.data[0]);
        } else {
        finished(e, null);
      }
    });
  }
}

// Check whether the given channels are live or not
exports.getChannelStatus = function(userIds, finished) {
  let channels = userIds.map(e => e["userId"]);
  var ids = channels.join("&user_id=");
  Request("GET", "https://api.twitch.tv/helix/streams?user_id="+ids, function(e, b) {
    var live = new Array();
    var offline = new Array();
    console.log("https://api.twitch.tv/helix/streams?user_id="+ids)
    console.log(b.data)
    if (b.data) {
      let liveChannels = b.data.map(e => e["user_id"]);
      for (var x in userIds) {
        if (liveChannels.includes(userIds[x].userId)) {
          var liveUser = b.data.find(obj => obj["user_id"] === userIds[x].userId)
          live.push({id: userIds[x].userId, name: liveUser["user_name"], title: liveUser["title"], viewers: liveUser["viewer_count"]});
        } else {
          offline.push(userIds[x])
        }
      }
    } else {
      offline = userIds;
      live = null;
    }
    finished(live, offline);
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

// Get the current chatters in a stream
exports.getChatters = function(streamer, finished) {
  streamer = streamer.toLowerCase();
  req({method: "GET", url: "http://tmi.twitch.tv/group/user/" + streamer + "/chatters"}, function (error, response, body) {
    console.log(error)
    console.log(response)
    console.log(body)
    if (error) { return finished(error, null) }
    body = JSON.parse(body);
    finished(error, body);
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
    if (error) { return finished(error, null) }
    body = JSON.parse(body);
    finished(error, body);
  });
}
