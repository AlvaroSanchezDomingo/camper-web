"use strict";
const Accounts = require("./app/controllers/accounts");
const Parkings = require("./app/controllers/parkings");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/signupadmin", config: Accounts.signupAdmin },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  { method: 'GET', path: '/showusers', config: Accounts.showUsers },
  { method: "GET", path: "/deleteuser/{id}", config: Accounts.deleteUser },
  { method: "GET", path: "/deleteadmin/{id}", config: Accounts.deleteAdmin },
  { method: "GET", path: "/showparkings", config: Parkings.showParkings },
  { method: "GET", path: "/showallparkings", config: Parkings.showAllParkings },
  { method: "GET", path: "/newparking", config: Parkings.newParking },
  { method: "POST", path: "/addparking", config: Parkings.addParking },
  { method: "GET", path: "/deleteparking/{id}", config: Parkings.deleteParking },
  { method: 'GET', path: "/editparking/{id}", config: Parkings.showEditParking },
  { method: "POST", path: "/editparking/{id}", config: Parkings.editParking },
  { method: "GET", path: "/viewparking/{id}", config: Parkings.viewParking },
  { method: 'POST', path: "/uploadfile/{id}", config: Parkings.uploadFile },
  { method: 'GET', path: "/deleteimage/{id}/{imageId}", config: Parkings.deleteImage },
  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
