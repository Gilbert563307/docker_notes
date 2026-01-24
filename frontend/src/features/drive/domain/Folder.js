export class Folder {
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
    this.#validate({
      id,
      user_uid,
      name,
      color,
      archived,
    });

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

  /** Return object representation */
  toString() {
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

  toJsonWithoutId() {
    return {
      user_uid: this.#user_uid,
      name: this.#name,
      color: this.#color,
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  /** Update one or more fields */
  update(name, color, archived, updated_at) {
    this.#validate({
      id: this.#id,
      user_uid: this.#user_uid,
      name: name ?? this.#name,
      color: color ?? this.#color,
      archived: archived ?? this.#archived,
    });

    this.#name = name;
    this.#color = color;
    this.#archived = archived;
    this.#updated_at = updated_at;
  }

  #validate(data) {
    const { id, user_uid, name, color, archived } = data;

    if (id == null || typeof id !== "string") {
      throw new Error("Something went wrong while identifying this folder. Please try again.");
    }

    if (!user_uid || typeof user_uid !== "string") {
      throw new Error("User information is missing or invalid.");
    }

    if (!name || typeof name !== "string") {
      throw new Error("Please enter a name for the folder.");
    }

    if (name.length > 255) {
      throw new Error("Folder name is too long.");
    }

    if (color !== undefined && typeof color !== "string") {
      throw new Error("Folder color is invalid.");
    }

    if (archived === null || archived === undefined || typeof archived !== "boolean") {
      throw new Error("The archive information is missing. Please try again.");
    }
  }
}
