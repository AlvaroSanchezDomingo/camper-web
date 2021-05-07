const Users = require("./app/api/users");
const Parkings = require("./app/api/parkings");

module.exports = [
  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "PUT", path: "/api/users/{id}", config: Users.update },

  { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },

  { method: "GET", path: "/api/parkings", config: Parkings.findAll },
  { method: "GET", path: "/api/parkings/{id}", config: Parkings.findById },
  { method: "GET", path: "/api/parkings/user", config: Parkings.findByUser },
  { method: "DELETE", path: "/api/parkings", config: Parkings.deleteAll },
  { method: "DELETE", path: "/api/parkings/{id}", config: Parkings.deleteById },
  { method: "POST", path: "/api/parkings", config: Parkings.create },
  { method: "POST", path: "/api/parkings/update/{id}", config: Parkings.updateParking },

];