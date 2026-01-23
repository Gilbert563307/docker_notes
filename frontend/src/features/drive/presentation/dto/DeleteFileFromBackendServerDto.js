export class DeleteFileFromBackendServerDto {
  #user_uid;
  #filename;

  /**
   *
   * @param {string} user_uid
   * @param {string} filename
   */
  constructor(user_uid, filename) {
    this.#user_uid = user_uid;
    this.#filename = filename;
  }

  getUserUid() {
    return this.#user_uid;
  }

  getFileName() {
    return this.#filename;
  }

  toJSON() {
    return {
      user_uid: this.#user_uid,
      filename: this.#filename,
    };
  }
}
