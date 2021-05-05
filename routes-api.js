const Users = require("./app/api/users");
const Parkings = require("./app/api/users");

module.exports = [
  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "PUT", path: "/api/users/{id}", config: Users.update },

  { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },

  { method: "DELETE", path: "/api/parkings", config: Parkings.deleteAll },
  { method: "POST", path: "/api/parkings", config: Parkings.create },
];