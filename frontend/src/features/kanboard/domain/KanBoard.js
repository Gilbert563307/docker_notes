export class KanBoard {
  // ===== Private fields =====
  #id;
  #user_uid;
  #name;
  #color;
  #archived;
  #collaborative;
  #created_at;
  #updated_at;

  /**
   * @param {string} id
   * @param {string} user_uid
   * @param {string} name
   * @param {string} color
   * @param {boolean} archived
   * @param {boolean} collaborative
   * @param {string} created_at
   * @param {string} updated_at
   */
  constructor(id, user_uid, name, color, archived, collaborative, created_at, updated_at) {
    this.#validate({
      id,
      user_uid,
      name,
      color,
      archived,
      collaborative,
      created_at,
      updated_at,
    });

    this.#id = id;
    this.#user_uid = user_uid;
    this.#name = name;
    this.#color = color;
    this.#archived = archived;
    this.#collaborative = collaborative;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  // ===== Getters =====
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

  getIsCollaborative() {
    return this.#collaborative;
  }

  getCreatedAt() {
    return this.#created_at;
  }

  getUpdatedAt() {
    return this.#updated_at;
  }

  /** Return object representation */
  toJson() {
    return {
      id: this.#id,
      user_uid: this.#user_uid,
      name: this.#name,
      color: this.#color,
      archived: this.#archived,
      collaborative: this.#collaborative,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  toJsonWithoutId() {
    return {
      user_uid: this.#user_uid,
      name: this.#name,
      color: this.#color,
      archived: this.#archived,
      collaborative: this.#collaborative,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  /** Update one or more fields */
  /**
   * @param {string} name
   * @param {string} color
   * @param {boolean} archived
   * @param {boolean} collaborative
   * @param {any} created_at
   * @param {any} updated_at
   */
  update(name, color, archived, collaborative, created_at, updated_at) {
    const data = {
      id: this.#id,
      user_uid: this.#user_uid,
      name,
      color,
      archived,
      collaborative,
      created_at,
      updated_at,
    };
    this.#validate(data);

    if (name !== undefined) this.#name = name;
    if (color !== undefined) this.#color = color;
    if (archived !== undefined) this.#archived = archived;
    if (collaborative !== undefined) this.#collaborative = collaborative;
    if (updated_at !== undefined) this.#updated_at = updated_at;
  }

  /**
   *
   * @param {Object} data
   */
  #validate(data) {
    const { id, user_uid, name, color, archived, collaborative, created_at, updated_at } = data;

    if (id === undefined || id === null || typeof id !== "string") {
      throw new Error("Board id is required and must be a string.");
    }

    if (!user_uid || typeof user_uid !== "string") {
      throw new Error("User UID is required and must be a string.");
    }

    if (!name || typeof name !== "string") {
      throw new Error("Board name is required and must be a non-empty string.");
    }

    if (color === undefined || color === null || typeof color !== "string") {
      throw new Error("Board color is required and must be a string.");
    }

    if (typeof archived !== "boolean") {
      throw new Error("Archived flag is required and must be a boolean.");
    }

    if (typeof collaborative !== "boolean") {
      throw new Error("Collaborative flag is required and must be a boolean.");
    }

    if (!created_at) {
      throw new Error("Creation date is required.");
    }

    if (!updated_at) {
      throw new Error("Update date is required.");
    }
  }
}
