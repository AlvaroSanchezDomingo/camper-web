"use strict";

const assert = require("chai").assert;
const Service = require("./service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Candidate API tests", function () {
  let parkings = fixtures.parkings;
  let newParking = fixtures.newParking;

  const service = new Service(fixtures.service);
  let newUser = fixtures.newUser;

  suiteSetup(async function () {
    await service.deleteAllUsers();
    const returnedUser = await service.createUser(newUser);
    const response = await service.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await service.deleteAllUsers();
    service.clearAuth();
  });

  setup(async function () {
    await service.deleteAllParkings();
  });

  teardown(async function () {
    await service.deleteAllParkings();
  });

  test("get all users empty", async function () {
    const allParkings = await service.getParkings();
    assert.equal(allParkings.length, 0);
  });
});