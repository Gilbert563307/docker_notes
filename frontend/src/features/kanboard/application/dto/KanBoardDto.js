export class KanBoardDto {
  #id;
  #user_uid;
  #name;
  #color;
  #archived;
  #collaborative;
  #created_at;
  #updated_at;

  /**
   * Create a Board DTO.
   *
   * @param {string} id - Board identifier
   * @param {string} user_uid - Owner user UID
   * @param {string} name - Board name
   * @param {string} color - Board color
   * @param {boolean} archived - Archive flag
   * @param {boolean} collaborative - Collaborative flag
   * @param {string} created_at - Creation date
   * @param {string} updated_at - Update date
   */
  constructor(
    id,
    user_uid,
    name,
    color,
    archived,
    collaborative,
    created_at,
    updated_at,
  ) {
    this.#id = id;
    this.#user_uid = user_uid;
    this.#name = name;
    this.#color = color;
    this.#archived = archived;
    this.#collaborative = collaborative;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  /** @returns {string} Board ID */
  getId() {
    return this.#id;
  }

  /** @returns {string} User UID */
  getUserUid() {
    return this.#user_uid;
  }

  /** @returns {string} Board name */
  getName() {
    return this.#name;
  }

  /** @returns {string} Board color */
  getColor() {
    return this.#color;
  }

  /** @returns {boolean} Archive state */
  getIsArchived() {
    return this.#archived;
  }

  /** @returns {boolean} Collaborative state */
  getIsCollaborative() {
    return this.#collaborative;
  }

  /** @returns {string} Formatted creation date */
  getCreatedAt() {
    return this.#created_at.toLocaleString();
  }

  /** @returns {string} Formatted update date */
  getUpdatedAt() {
    return this.#updated_at.toLocaleString();
  }

 
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
}
