"use strict";
const User = require("../models/user");
const Parking = require("../models/parking");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const ImageStore = require('../utils/image-store');

const Accounts = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to CamperPark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Sign up for CamperPark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        repeat_password: Joi.ref('password'),
        level: Joi.number().max(1).min(0).required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          level:payload.level,
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        if(payload.level == 0){
          return h.redirect("/showallparkings");
        }else{
          return h.redirect("/showparkings");
        }
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    },
  },
  
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login to CamperPark" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("login", {
            title: "Sign in error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }else if(user.level == 0) {
          user.comparePassword(password);
          request.cookieAuth.set({ id: user.id });
          return h.redirect("/showallparkings");
        }else{
          user.comparePassword(password);
          request.cookieAuth.set({ id: user.id });
          return h.redirect("/showparkings");
        }

      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  showUsers: {
    handler: async function(request, h) {
      try {
        const users = await User.find().lean();
        return h.view("showusers-admin", {
          title: "Show users",
          users: users,
        });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },
  deleteUser: {
    handler: async function(request, h) {
      try {
        const userId = request.params.id;
        const user = await User.findById(userId);
        const parkings = await Parking.findByUser(user).lean();

        for(const parking of parkings){
          let parkingId = parking._id;
          await ImageStore.deleteParkingImages(parkingId);
        }
        await Parking.deleteMany({ user: user });
        await User.deleteOne({ _id: userId });
        return h.redirect("/showusers");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },

  showSettings: {
    handler: async function (request, h) {
      try {

        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        if (!user) {
          const message = "No user or admin found";
          throw Boom.unauthorized(message);
        }else if(user) {
          if(user.level == 0) {
            return h.view("settings-admin", { title: "CamperPark Settings Admin", user: user });
          }else{
            return h.view("settings", { title: "CamperPark Settings User", user: user });
          }
        }
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("settings", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        if (!user) {
          const message = "No user found";
          throw Boom.unauthorized(message);
        }else {
          user.firstName = userEdit.firstName;
          user.lastName = userEdit.lastName;
          user.email = userEdit.email;
          user.password = userEdit.password;
          await user.save();
        }
        return h.redirect("/settings");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
};

module.exports = Accounts;
