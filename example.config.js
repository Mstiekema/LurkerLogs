module.exports = {
  twitch: {
    options: {
      debug: true
    },
    connection: {
      reconnect: true,
  		secure: true
    },
    identity: {
      username: "Username",
      password: "oauth:123xxx" // Get this over at https://twitchapps.com/tmi/ 
    }
  },
  twitchApi: {
    clientId: "",
    secret: ""
  },
  mysql: {
    ip: "localhost",
    user: "user",
    password: "pass",
    database: "db"
  }
};