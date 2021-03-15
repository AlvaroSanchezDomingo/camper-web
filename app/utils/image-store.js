'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function() {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  getParkingImages: async function(parkingId) {
    const result = await cloudinary.v2.api.resources(
      { prefix: parkingId },
      function(error, result) {console.log(result, error); });

    return result.resources;
  },



  uploadImage: async function(imagefile) {
    await writeFile('./public/temp.img', imagefile);
    await cloudinary.uploader.upload('./public/temp.img');
  },
  uploadParkingImage: async function(imagefile, parkingId) {
    const timestamp = Date.now();
    const pictureName = parkingId.toString() + "_"+ timestamp.toString();
    await writeFile('./public/temp.img', imagefile);
    await cloudinary.uploader.upload('./public/temp.img', {public_id : pictureName});
  },
  deleteImage: async function(id) {
    await cloudinary.v2.uploader.destroy(id, {});
  },

};

module.exports = ImageStore;
