"use strict";

const axios = require("axios");

class Service {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }




  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users/authenticate", user);
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common["Authorization"] = "";
  }
  async createParking(newParking) {
    try {
      const response = await axios.post(this.baseUrl + "/api/parkings", newParking);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async getParkings() {
    try {
      const response = await axios.get(this.baseUrl + "/api/parkings");
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async getParking(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/parkings/"+ id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  findById
  async deleteAllParkings() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/parkings");
      return response.data;
    } catch (e) {
      return null;
    }
  }

}

module.exports = Service;
