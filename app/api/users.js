"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const utils = require('./utils.js');
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Users = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this id");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      const payload = request.payload;
      const hash = await bcrypt.hash(payload.password, saltRounds);
      const newUser = new User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hash,
      });
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating user");
    },
  },
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await User.deleteMany({});
      return { success: true };
    },
  },
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userEdit = request.payload;
      const user = await User.findById(userEdit._id);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      user.password = userEdit.password;
      user.level = userEdit.level;
      await user.save();
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        await user.comparePassword(request.payload.password);
        const token = utils.createToken(user);
        return h.response({ success: true, token: token ,level:user.level}).code(201);

      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },
};

module.exports = Users;
