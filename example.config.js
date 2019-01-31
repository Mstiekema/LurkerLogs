module.exports = {
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
};