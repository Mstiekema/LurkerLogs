var req = require("./requests.js");
var db = require("./database.js");

exports.updateWatchTime = function(channel, chanId, live) {
  req.getChatters(channel, function(err, users) {
    var viewers = users.chatters.viewers;
    var moderators = users.chatters.moderators
    var vips = users.chatters.vips
    var staff = users.chatters.staff
    var admins = users.chatters.admins
    var global_mods = users.chatters.global_mods
    var usernames = viewers.concat(moderators, vips, staff, admins, global_mods)

    // if (usernames.length > 100) {
    //   for (var i = 0, i < Math.floor(usernames.length / 100)), i++) {
    //     var j = i + 1;
    //     var usernamesBig = usernames.splice(i * 100, j * 100);
    //     updateAllUsers(usernamesBig);
    //   }
    // } else {
      updateAllUsers(usernames);
    // }
  });
}

function updateAllUsers(usernames) {
  req.getUserIds(usernames, function(err, allUsers) {
    db.query("SELECT userId FROM users where streamerId = ?", chanId, function(err, res) {
      req.getIdArray(res, "userId", function(userIds) {
        let user = {userId: "", streamerId: chanId, online: 0, offline: 0}
        if (userIds[0]) {
          for (var i = 0; i < allUsers.length; i++) {
            if (userIds.indexOf(allUsers[i]) != -1) {
              user.userId = allUsers[i];
              updateUser(user, live);
            } else {
              user.userId = allUsers[i];
              insertUser(user, live);
            }
          }
        } else {
          for (var i = 0; i < allUsers.length; i++) {
            user.userId = allUsers[i];
            insertUser(user, live);
          }
        }
      });
    });
  });
}

function updateUser(user, live) {
  let sql = "UPDATE users SET "
  if (live) { sql += " online = online + 10 "; } else { sql += " offline = offline + 10 "; }
  sql += "WHERE userId = " + user.userId + " AND streamerId = " + user.streamerId;

  db.query(sql, function(err, res) {
    if (err) {
      // next(err);
    } else {
      // next(err);
    }
  });
}

function insertUser(user, live) {
  if (live) { user.online = 10; } else { user.offline = 10; }
  db.query("INSERT INTO users SET ?", user, function(err, res) {
    if (err) {
      // next(err);
    } else {
      // next(err);
    }
  });
}
