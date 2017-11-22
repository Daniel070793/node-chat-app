const expect = require("expect");
const { Users } = require("./users");

describe("Users", () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Test",
        room: "testRoom"
      },
      {
        id: "2",
        name: "testers",
        room: "room1"
      },
      {
        id: "3",
        name: "Daniel",
        room: "testRoom"
      }
    ];
  });

  it("should add new user", () => {
    var users = new Users();
    var user = {
      id: "123",
      name: "Daniel",
      room: "Rummet"
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it("should remove a user", () => {
    var userId = "1";
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should NOT remove user", () => {
    var userId = "99";
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it("should find user", () => {
    var userId = "2";
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it("should NOT find user", () => {
    var userId = "99";
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });

  it("should return names for testRoom room", () => {
    var userList = users.getUserList("testRoom");

    expect(userList).toEqual(["Test", "Daniel"]);
  });

  it("should return names for room1 room", () => {
    var userList = users.getUserList("room1");

    expect(userList).toEqual(["testers"]);
  });
});
