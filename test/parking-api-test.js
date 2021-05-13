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

  test("get all parkings empty", async function () {
    const allParkings = await service.getParkings();
    assert.equal(allParkings.length, 0);
  });
  test("get one parking", async function () {
    const p1 = await service.createParking(newParking);
    const allParkings = await service.getParkings();
    assert.equal(allParkings.length, 1);
    assert.equal(p1._id, allParkings[0]._id);
  });
  test("get parking", async function () {
    const p1 = await service.createParking(newParking);
    const p2 = await service.getParking(p1._id);
    assert.equal(p1.name, p2.name);
  });
  test("create multiple parkings", async function () {
    for (var i = 0; i < parkings.length; i++) {
      await service.createParking(parkings[i]);
    }
    const allParkings = await service.getParkings();
    assert.equal(allParkings.length, parkings.length);
  });
  test("get parking by logged user", async function () {
    const p1 = await service.createParking(newParking);
    const parkingsUser = await service.getParkingUser();
    assert.equal(parkingsUser.length, 1);
    assert.equal(p1._id, parkingsUser[0]._id);
  });
  test("delete parking by id", async function () {
    for (var i = 0; i < parkings.length; i++) {
      await service.createParking(parkings[i]);
    }
    const parkingsUser = await service.getParkingUser();
    assert.equal(parkingsUser.length, 3);
    await service.deleteParkingsId(parkingsUser[0]._id)
    const allParkings = await service.getParkings();
    assert.equal(allParkings.length, 2);
    assert.equal(allParkings[0].name, parkings[1].name);
  });
  test("update parking", async function () {
    const p1 = await service.createParking(newParking);
    const parkingsUser = await service.getParkingUser();

    assert.equal(parkingsUser[0].name, newParking.name);
    const updateParking = {
      name: "updated name",
      category: "Public",
      description: "Updated description",
      lat: "12.3",
      long: "12.3",
      pros: "Updated pro",
      cons: "Updated con",
    }
    const updatedParking = await service.updateParking(parkingsUser[0]._id, updateParking)
    assert.equal(updatedParking.name, updateParking.name);
  });
});