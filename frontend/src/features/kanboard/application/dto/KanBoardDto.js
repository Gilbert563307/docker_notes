export class KanBoardDto {
  #id;
  #user_uid;
  #name;
  #color;
  #archived;
  #collaborative;
  #imageUrl;
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
   * @param {string} imageUrl - Board image URL
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
    imageUrl,
    created_at,
    updated_at,
  ) {
    this.#id = id;
    this.#user_uid = user_uid;
    this.#name = name;
    this.#color = color;
    this.#archived = archived;
    this.#collaborative = collaborative;
    this.#imageUrl = imageUrl;
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

  /** @returns {string} Board image URL */
  getImageUrl() {
    return this.#imageUrl;
  }

  /** @returns {string} Formatted creation date */
  getCreatedAt() {
    return this.#created_at;
  }

  /** @returns {string} Formatted update date */
  getUpdatedAt() {
    return this.#updated_at;
  }

  toJson() {
    return {
      id: this.#id,
      user_uid: this.#user_uid,
      name: this.#name,
      color: this.#color,
      archived: this.#archived,
      collaborative: this.#collaborative,
      imageUrl: this.#imageUrl,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  static Builder = class {
    #id = "";
    #user_uid = "";
    #name = "";
    #color = "#000000";
    #archived = false;
    #collaborative = false;
    #imageUrl = "";
    #created_at = "";
    #updated_at = "";
    #validate = true;
    #init = false;

    id(id) {
      this.#id = id;
      return this;
    }

    userUid(user_uid) {
      this.#user_uid = user_uid;
      return this;
    }

    name(name) {
      this.#name = name;
      return this;
    }

    color(color) {
      this.#color = color;
      return this;
    }

    archived(archived) {
      this.#archived = archived;
      return this;
    }

    collaborative(collaborative) {
      this.#collaborative = collaborative;
      return this;
    }

    imageUrl(imageUrl) {
      if(!imageUrl) return this;
      this.#imageUrl = imageUrl;
      return this;
    }

    createdAt(date) {
      this.#created_at = date;
      return this;
    }

    updatedAt(date) {
      this.#updated_at = date;
      return this;
    }

    validate(validate) {
      this.#validate = validate;
      return this;
    }

    init() {
      this.#init = true;
      return this;
    }

    build() {
      if (this.#validate && !this.#init) {
        if (!this.#name || this.#name.trim().length === 0) {
          throw new Error("Kanboard name is required.");
        }

        if (!this.#user_uid || this.#user_uid.trim().length === 0) {
          throw new Error("User UID is required.");
        }

        if (!this.#color || !this.#color.startsWith("#")) {
          throw new Error(
            "Kanboard colour is invalid and must be a hex code.",
          );
        }

        if (typeof this.#archived !== "boolean") {
          throw new Error(
            "Archived flag is required and must be a boolean.",
          );
        }

        if (typeof this.#collaborative !== "boolean") {
          throw new Error(
            "Collaborative flag is required and must be a boolean.",
          );
        }
      }

      return new KanBoardDto(
        this.#id,
        this.#user_uid,
        this.#name,
        this.#color,
        this.#archived,
        this.#collaborative,
        this.#imageUrl,
        this.#created_at,
        this.#updated_at,
      );
    }
  };
}