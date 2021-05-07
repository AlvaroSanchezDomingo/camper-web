"use strict";

const assert = require("chai").assert;
const Service = require("./service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const service = new Service(fixtures.service);

  suiteSetup(async function () {
    await service.deleteAllUsers();
    const returnedUser = await service.createUser(newUser);
    const response = await service.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await service.deleteAllUsers();
    service.clearAuth();
  });
  test("create a user", async function () {
    const returnedUser = await service.createUser(newUser);
    assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser");
    assert.isDefined(returnedUser._id);
  });
  test("get users", async function () {
    const u1 = await service.createUser(newUser);
    const u2 = await service.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });
  test("get invalid user", async function () {
    const u1 = await service.getUser("1234");
    assert.isNull(u1);
    const u2 = await service.getUser("012345678901234567890123");
    assert.isNull(u2);
  });
  test("delete a user", async function () {
    let u = await service.createUser(newUser);
    assert(u._id != null);
    await service.deleteOneUser(u._id);
    u = await service.getUser(u._id);
    assert(u == null);
  });
  test("get all users", async function () {
    await service.deleteAllUsers();
    await service.createUser(newUser);
    await service.authenticate(newUser);
    for (let u of users) {
      await service.createUser(u);
    }
    const allUsers = await service.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  });
  test("get users detail", async function () {
    await service.deleteAllUsers();
    const user = await service.createUser(newUser);
    await service.authenticate(newUser);
    for (let u of users) {
      await service.createUser(u);
    }
    const testUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };
    users.unshift(testUser);
    const allUsers = await service.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), "returnedUser must be a superset of newUser");
    }
  });

  test("get all users empty", async function () {
    await service.deleteAllUsers();
    const user = await service.createUser(newUser);
    await service.authenticate(newUser);
    const allUsers = await service.getUsers();
    assert.equal(allUsers.length, 1);
  });
});
