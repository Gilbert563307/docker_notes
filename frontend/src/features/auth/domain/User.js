export class User {
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
    this.#validate({ uid, displayName, email, photoURL, token });

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

  #validate(data) {
    const { uid, email, token } = data;

    if (!uid || typeof uid !== "string") {
      throw new Error("We couldn’t sign you in. Please try again.");
    }

    if (!email || typeof email !== "string") {
      throw new Error("Please enter a valid email address.");
    }

    if (!token || typeof token !== "string") {
      throw new Error("Your session has expired. Please sign in again.");
    }
  }
}
