"use strict";
const Parking = require("../models/parking");
const User = require("../models/user");
const Joi = require("@hapi/joi");

const Parkings = {

  showParkings: {
    handler: async function(request, h) {
      const parkings = await Parking.find().populate("user").lean();
      return h.view("showparkings-list", {
        title: "All camper parking",
        parkings: parkings,
        showownparkings: false, //This is not working
      });
    }
  },
  showUserParkings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const parkings = await Parking.findByUser(user).populate("user").lean();
        return h.view("showparkings-list", {
          title: "User camper parking",
          parkings: parkings,
          showownparkings: true, //This is not working
        });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },
  newParking: {
    handler: function(request, h) {
      return h.view("newparking", { title: "Create new parking" });
    }
  },
  addParking: {
    validate: {
      payload: {
        name: Joi.string().max(100).required(),
        category: Joi.string().required(),
        description: Joi.string().min(50).max(1000).required(),
        pros: Joi.string().max(100).required(),
        cons: Joi.string().max(100).required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("newparking", {
            title: "Add parking error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const newParking = new Parking({
          name: data.name,
          description: data.description,
          category: data.category,
          pros: data.pros,
          cons: data.cons,
          user: user._id
        });
        await newParking.save();
        return h.redirect("/showparkings");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    }
  },
  deleteParking: {
    handler: async function(request, h) {
      const id = request.params.id;
      await Parking.deleteOne({ _id: id });
      return h.redirect("/showuserparkings");
    }
  },
  showEditParking: {
    handler: async function (request, h) {
      try {
        const id = request.params.id;
        const parking = await Parking.findById(id).populate("user").lean()
        return h.view("editparking", { title: "Edit parking", parking: parking });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  editParking: {
    validate: {
      payload: {
        name: Joi.string().max(100).required(),
        category: Joi.string().required(),
        description: Joi.string().min(50).max(1000).required(),
        pros: Joi.string().max(100).required(),
        cons: Joi.string().max(100).required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("editparking", {
            title: "Edit parking error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const parkingEdit = request.payload;
        const id = request.params.id;
        const parking = await Parking.findById(id).populate("user").lean();
        parking.name = parkingEdit.name;
        parking.category = parkingEdit.category;
        parking.pros = parkingEdit.pros;
        parking.cons = parkingEdit.cons;
        parking.description = parkingEdit.description;
        await parking.save();
        return h.redirect("/showuserparkings");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

};

module.exports = Parkings;
