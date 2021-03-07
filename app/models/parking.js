"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const parkingSchema = new Schema({
  name: String,
  category: String,
  description: String,
  pros: String,
  cons: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Mongoose.model("parking", parkingSchema);
