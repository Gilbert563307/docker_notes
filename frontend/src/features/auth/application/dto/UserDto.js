export class UserDto {
  #uid;
  #displayName;
  #email;
  #photoURL;
  #token;

  /**
   * @param {string} uid
   * @param {string} displayName
   * @param {string} email
   * @param {string} photoURL
   * @param {string} token
   */
  constructor(uid, displayName, email, photoURL, token) {
    this.#uid = uid;
    this.#displayName = displayName;
    this.#email = email;
    this.#photoURL = photoURL;
    this.#token = token;
  }

  getUid() {
    return this.#uid;
  }

  getDisplayName() {
    return this.#displayName;
  }

  getEmail() {
    return this.#email;
  }

  getPhotoURL() {
    return this.#photoURL;
  }

  getToken() {
    return this.#token;
  }

  toJson() {
    return {
      uid: this.#uid,
      displayName: this.#displayName,
      email: this.#email,
      photoURL: this.#photoURL,
      token: this.#token,
    };
  }
}
