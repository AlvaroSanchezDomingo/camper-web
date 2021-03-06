"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const parkingSchema = new Schema({
  name: String,
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Mongoose.model("parking", parkingSchema);
