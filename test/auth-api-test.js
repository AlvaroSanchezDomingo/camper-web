"use strict";

const assert = require("chai").assert;
const Service = require("./service");
const fixtures = require("./fixtures.json");
const utils = require("../app/api/utils.js");

suite("Authentication API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const service = new Service(fixtures.service);

  setup(async function () {
    await service.deleteAllUsers();
  });

  test("authenticate", async function () {
    const returnedUser = await service.createUser(newUser);
    const response = await service.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async function () {
    const returnedUser = await service.createUser(newUser);
    const response = await service.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

});