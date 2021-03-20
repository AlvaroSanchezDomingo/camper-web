"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const parkingSchema = new Schema({
  name: String,
  category: String,
  description: String,
  lat: Number,
  long: Number,
  pros: String,
  cons: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

parkingSchema.statics.findByUser = function(user) {
  return this.find({ user : user});
};

parkingSchema.statics.findById = function(id) {
  return this.findOne({ _id : id});
};

module.exports = Mongoose.model("parking", parkingSchema);
