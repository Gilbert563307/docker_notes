export class FolderDto {
  #id;
  #user_uid;
  #name;
  #color;
  #archived;
  #created_at;
  #updated_at;

  /**
   *
   * @param {string} id
   * @param {string} user_uid
   * @param {string} name
   * @param {string} color
   * @param {boolean} archived
   * @param {*} created_at
   * @param {*} updated_at
   */
  constructor(id, user_uid, name, color, archived, created_at, updated_at) {
    this.#id = id;
    this.#user_uid = user_uid;
    this.#name = name;
    this.#color = color;
    this.#archived = archived;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  getId() {
    return this.#id;
  }

  getUserUid() {
    return this.#user_uid;
  }

  getName() {
    return this.#name;
  }

  getColor() {
    return this.#color;
  }

  getIsArchived() {
    return this.#archived;
  }

  getCreatedAt() {
    return this.#created_at;
  }

  getUpdatedAt() {
    return this.#updated_at;
  }

  /**
   *
   * @returns {string}
   */
  getUserLocaleCreatedAt() {
    if (!this.#created_at) return "";
    return this.#created_at.toDate().toLocaleString();
  }

  /**
   *
   * @returns {string}
   */
  getUserLocaleUpdatedAt() {
    if (!this.#updated_at) return "";
    return this.#updated_at.toDate().toLocaleString();
  }

  /** Return object representation */
  toJson() {
    return {
      id: this.#id,
      user_uid: this.#user_uid,
      name: this.#name,
      color: this.#color,
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
