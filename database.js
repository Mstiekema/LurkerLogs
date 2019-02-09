var conf = require("./config.js");
var mysql = require("mysql");
var c;

function startDatabase() {
  c = mysql.createConnection({
    host: conf.mysql.ip,
    user: conf.mysql.user,
    password: conf.mysql.password,
    database: conf.mysql.database,
    port: 3306
  });

  c.connect(function(err) {
    if(err) {
      console.log("Database connection error: ", err);
      startDatabase();
    }
    else {
      console.log("MySQL connected :)");
    }
  });

  c.on('error', function(err) { // Immediatly reconnect to the database to prevent crashes and loss of information
    console.log('DB Crashed', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      startDatabase();
    } else {
      throw err;
    }
  });
}

startDatabase();

module.exports = c;