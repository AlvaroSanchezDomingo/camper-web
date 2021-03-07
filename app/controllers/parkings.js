"use strict";
const Parking = require("../models/parking");
const User = require("../models/user");

const Parkings = {

  showParkings: {
    handler: async function(request, h) {
      const parkings = await Parking.find().populate("user").lean();
      return h.view("showparkings", {
        title: "All camper parking",
        parkings: parkings
      });
    }
  },
  newParking: {
    handler: function(request, h) {
      return h.view("newparking", { title: "Create new parking" });
    }
  },
  addParking: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const newParking = new Parking({
          name: data.name,
          description: data.description,
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
  }
};

module.exports = Parkings;
