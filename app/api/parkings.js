"use strict";

const Parking = require("../models/parking");
const Boom = require("@hapi/boom");


const Parkings = {
  findAll: {
    auth: false,
    handler: async function (request, h) {
      const parkings = await Parking.find();
      return parkings;
    },
  },
  findByUser: {
    auth: false,
    handler: async function (request, h) {
      const parkings = await Parking.find({ user: request.params.id });
      return parkings;
    },
  },

  findById: {
    auth: false,
    handler: async function (request, h) {
      const parking = await Parking.findById(request.params.id);
      return parking;
    },
  },

};

module.exports = Parkings;