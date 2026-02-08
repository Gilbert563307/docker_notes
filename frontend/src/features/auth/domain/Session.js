import { FieldValue, Timestamp } from "firebase/firestore";

export class Session {
  #user;
  #token;
  #expire_date;
  #created_at;
  #updated_at;
  /**
   *
   * @param {Object} user
   * @param {string} token
   * @param {Timestamp} expire_date
   * @param {FieldValue} created_at
   * @param {FieldValue} updated_at
   */
  constructor(user, token, expire_date, created_at, updated_at) {
    this.#validate({ user, token });
    this.#user = user;
    this.#token = token;
    this.#expire_date = expire_date;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  getUser() {
    return this.#user;
  }

  getToken() {
    return this.#token;
  }

  getExpireDate() {
    return this.#expire_date;
  }
  getCreatedAt() {
    return this.#created_at;
  }
  getUpdatedAt() {
    return this.#updated_at;
  }

  toJson() {
    return {
      user_uid: this.#user,
      token: this.#token,
      expire_date: this.#expire_date,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  /**
   *
   * @param {Object} data
   */
  #validate(data) {
    const { user, token } = data;
    const emptyUserObject = JSON.stringify({});
    if (emptyUserObject === user) {
      throw new Error("Cannot create session, the user is empty");
    }

    if (token === null || token === undefined || typeof token !== "string") {
      throw new Error("Token missing or invalid data type");
    }
  }
}
