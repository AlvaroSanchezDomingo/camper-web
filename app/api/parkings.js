"use strict";

const Parking = require("../models/parking");
const Boom = require("@hapi/boom");
const utils = require("./utils.js");


const Parkings = {
  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const parkings = await Parking.find();
      return parkings;
    },
  },
  findByUser: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const parkings = await Parking.find({ user: request.params.id });
      return parkings;
    },
  },

  findById: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const parking = await Parking.findById(request.params.id);
      return parking;
    },
  },
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userId = utils.getUserIdFromRequest(request);
      let newParking = new Parking(request.payload);
      newParking.user = userId;
      const parking = await newParking.save();
      if (parking) {
        return h.response(parking).code(201);
      }
      return Boom.badImplementation("error creating candidate");
    },
  },
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Parking.deleteMany({});
      return { success: true };
    },
  },
};

module.exports = Parkings;