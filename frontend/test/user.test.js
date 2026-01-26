import assert from "node:assert";
import { User } from "../src/features/auth/domain/User";

describe("User domain", () => {
  it("should expose correct domain data via getters", () => {
    // Arrange
    const uid = "user-123";
    const displayName = "John Doe";
    const email = "john@doe.com";
    const photoURL = "https://photo.url/avatar.png";
    const token = "jwt-token";

    const user = new User(uid, displayName, email, photoURL, token);

    // Assert
    assert.strictEqual(user.getUid(), uid);
    assert.strictEqual(user.getDisplayName(), displayName);
    assert.strictEqual(user.getEmail(), email);
    assert.strictEqual(user.getPhotoURL(), photoURL);
    assert.strictEqual(user.getToken(), token);
  });

  it("should convert to JSON correctly", () => {
    const user = new User("uid", "Jane", "jane@mail.com", "photo", "token");

    assert.deepStrictEqual(user.toJson(), {
      uid: "uid",
      displayName: "Jane",
      email: "jane@mail.com",
      photoURL: "photo",
      token: "token",
    });
  });
});
