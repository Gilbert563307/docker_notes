export class DriveFileDto {
  #id;
  #name;
  #folder_id;
  #user_uid;
  #size;
  #type;
  #archived;
  #created_at;
  #updated_at;

  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {string} folder_id
   * @param {string} user_uid
   * @param {number} size
   * @param {string} type
   * @param {boolean} archived
   * @param {*} created_at
   * @param {*} updated_at
   */
  constructor(id, name, folder_id, user_uid, size, type, archived, created_at, updated_at) {
    this.#id = id;
    this.#name = name;
    this.#folder_id = folder_id;
    this.#user_uid = user_uid;
    this.#size = size;
    this.#type = type;
    this.#archived = archived;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getFolderId() {
    return this.#folder_id;
  }

  getUserUId() {
    return this.#user_uid;
  }

  getSize() {
    return this.#size;
  }

  getType() {
    return this.#type;
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
      name: this.#name,
      folder_id: this.#folder_id,
      size: this.#size,
      type: this.#type,
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
