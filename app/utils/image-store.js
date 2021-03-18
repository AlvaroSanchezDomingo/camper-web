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


  getParkingImages: async function(parkingId) {
    const result = await cloudinary.v2.api.resources(
      {  type: "upload",
                prefix: parkingId.toString() },
      function(error, result) {console.log(result, error); });

    return result.resources;
  },

  uploadParkingImage: async function(imagefile, parkingId) {
    const timestamp = Date.now();
    const pictureName = parkingId.toString() + "_"+ timestamp.toString();
    //const pictureName = parkingId.toString();
    await writeFile('./public/temp.img', imagefile);
    await cloudinary.v2.uploader.upload('./public/temp.img',
      { public_id: pictureName },
      function(error, result) {console.log(result, error); });
  },

  deleteImage: async function(id) {
    await cloudinary.v2.uploader.destroy(id, {});
  },
  deleteParkingImages: async function(parkingId) {
    const result = await cloudinary.v2.api.resources(
      {  type: "upload",
        prefix: parkingId.toString() },
      function(error, result) {console.log(result, error); });
      for(const image of result.resources){
        await cloudinary.v2.uploader.destroy(image.public_id, {});
      }
  },

};

module.exports = ImageStore;
