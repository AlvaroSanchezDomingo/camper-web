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
  create: {
    auth: false,
    handler: async function (request, h) {
      const newParking = new Parking(request.payload);
      const parking = await newParking.save();
      if (parking) {
        return h.response(parking).code(201);
      }
      return Boom.badImplementation("error creating candidate");
    },
  },
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await Parking.deleteMany({});
      return { success: true };
    },
  },
};

module.exports = Parkings;