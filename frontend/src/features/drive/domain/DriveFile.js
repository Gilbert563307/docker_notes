import { ALLOWED_UPLOAD_FILE_TYPES } from "../../../config";

export class DriveFile {
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
    this.#validate({
      id,
      name,
      folder_id,
      user_uid,
      size,
      type,
      archived,
    });
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

  getUserUid() {
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

  /** Return object representation */
  toString() {
    return {
      id: this.#id,
      name: this.#name,
      folder_id: this.#folder_id,
      user_uid: this.#user_uid,
      size: this.#size,
      type: this.#type,
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  /** Update one or more fields */
  update(name, folder_id, size, type, archived, created_at, updated_at) {
    throw new Error("METHOD NOT CREATED");
    this.#validate({ id, name, folder_id, size, type, archived });
  }

  #validate(data) {
    const { id, name, folder_id, user_uid, size, type, archived } = data;

    if (id == null || typeof id !== "string") {
      throw new Error("Something went wrong while identifying this task. Please try again.");
    }

    if (!name || typeof name !== "string") {
      throw new Error("Please enter a name for the file.");
    }

    if (folder_id === undefined || typeof folder_id !== "string") {
      throw new Error("The folder information is missing or invalid. Please select a valid folder.");
    }

    if (!user_uid || typeof user_uid !== "string") {
      throw new Error("We couldn’t identify the user. Please sign in again and try.");
    }

    if (size == null || typeof size !== "number") {
      throw new Error("The size of the file is missing");
    }
    //TODO FINISH VALIDATION
    if (size) {
      throw new Error(`File size ${size}`);
    }

    if (!type || typeof type !== "string") {
      throw new Error("File type missing or not supported.");
    }

    if (archived === null || archived === undefined || typeof archived !== "boolean") {
      throw new Error("The archive information is missing. Please try again.");
    }

    if (type) {
      if (!ALLOWED_UPLOAD_FILE_TYPES.includes(type)) {
        throw new Error("File type not supported. Supported file types: PDF, DOCX, DOC, TXT, MD. ");
      }
    }
  }
}
