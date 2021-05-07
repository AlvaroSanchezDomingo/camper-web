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
      const userId = utils.getUserIdFromRequest(request);
      const parkings = await Parking.find({ user: userId });
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
  deleteById: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const parking = await Parking.deleteOne({ _id: request.params.id });
      if (parking) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },
  updateParking: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const parkingEdit = request.payload;
      const parking = await Parking.findById(request.params.id);
      parking.name = parkingEdit.name;
      parking.category = parkingEdit.category;
      parking.description = parkingEdit.description;
      parking.lat = parkingEdit.lat;
      parking.long = parkingEdit.long;
      parking.pros = parkingEdit.pros;
      parking.cons = parkingEdit.cons;
      await parking.save();
      if (parking) {
        return h.response(parking).code(201);
      }
      return Boom.notFound("error saving parking");
    },
  },
};
module.exports = Parkings;