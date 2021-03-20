"use strict";
const Parking = require("../models/parking");
const User = require("../models/user");
const Admin = require("../models/admin");
const Joi = require("@hapi/joi");
const ImageStore = require('../utils/image-store');
const axios = require("axios");

const Parkings = {

  showParkings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const parkings = await Parking.findByUser(user).populate("user").lean();
        return h.view("showparkings-list", {
          title: "User camper parking",
          parkings: parkings,
        });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },
  showAllParkings: {
    handler: async function(request, h) {
      try {
        const parkings = await Parking.find().populate("user").lean();
        return h.view("showparkings-list-admin", {
          title: "All camper parking",
          parkings: parkings,
        });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },
  viewParking: {
    handler: async function(request, h) {
      try {
        const parkingId = request.params.id;
        const parking = await Parking.findById(parkingId).populate("user").lean()

        const apiKey = "S84DhNhKFuebGRZMU1FN8z0Ir9vwdzGj"
        let weather = {};
        const weatherRequest = `https://data.climacell.co/v4/timelines?location=${parking.lat},${parking.long}&fields=temperature&units=metric&apikey=${apiKey}`;
        const response = await axios.get(weatherRequest)
        if (response.status == 200) {
          weather = response.data
        }
        const report = {
          temp: weather.data.timelines[0].intervals[0].values.temperature,
        }
        const allImages = await ImageStore.getParkingImages(parkingId);
        const data = {
          parking: parking,
          images: allImages,
          weather:report,
        }
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const admin = await Admin.findById(id);
        if (!user && !admin) {
          const message = "No user or admin found";
          throw Boom.unauthorized(message);
        }else if(user) {
          return h.view("showparking", { title: "View parking", data: data});
        }else if(admin) {
          return h.view("showparking-admin", { title: "View parking", data: data});
        }

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
        name: Joi.string().max(200).required(),
        category: Joi.string().required(),
        description: Joi.string().min(50).max(3000).required(),
        pros: Joi.string().max(200).required(),
        cons: Joi.string().max(200).required(),
        lat: Joi.number().max(90).min(-90).required(),
        long: Joi.number().max(90).min(-90).required(),
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
          lat: data.lat,
          long: data.long,
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
      const parkingId = request.params.id;
      await ImageStore.deleteParkingImages(parkingId);
      await Parking.deleteOne({ _id: parkingId });
      return h.redirect("/showparkings");
    }
  },
  showEditParking: {
    handler: async function (request, h) {
      try {
        const parkingId = request.params.id;
        const parking = await Parking.findById(parkingId).populate("user").lean()
        const allImages = await ImageStore.getParkingImages(parkingId);
        const data = {
          parking: parking,
          images: allImages,
        }
        return h.view("editparking", { title: "Edit parking", data: data });
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
        lat: Joi.number().max(90).min(-90).required(),
        long: Joi.number().max(90).min(-90).required(),
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
        const parkingId = request.params.id;
        const parking = await Parking.findById(parkingId).populate("user");
        parking.name = parkingEdit.name;
        parking.category = parkingEdit.category;
        parking.pros = parkingEdit.pros;
        parking.cons = parkingEdit.cons;
        parking.lat = parkingEdit.lat;
        parking.long = parkingEdit.long;
        parking.description = parkingEdit.description;
        await parking.save();
        return h.redirect(`/editparking/${parkingId}`);
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  uploadFile: {
    handler: async function(request, h) {
      try {
        const parkingId = request.params.id;
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          await ImageStore.uploadParkingImage(request.payload.imagefile, parkingId);
        }
        return h.redirect(`/editparking/${parkingId}`)
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },
  deleteImage: {
    handler: async function(request, h) {
      try {
        const parkingId = request.params.id;
        await ImageStore.deleteImage(request.params.imageId);
        return h.redirect(`/editparking/${parkingId}`);
      }
      catch (err) {
        console.log(err);
      }
    }
  },
};

module.exports = Parkings;
