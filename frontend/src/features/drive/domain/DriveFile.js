import { Timestamp } from "firebase/firestore";

export class DriveFile {
  /**
   * 
   * @param {string} id 
   * @param {string} name 
   * @param {string} folder_id 
   * @param {number} size 
   * @param {string} type 
   * @param {boolean} archived 
   * @param {Timestamp} created_at
   * @param {Timestamp} updated_at 
   */
  constructor(id, name, folder_id, size, type, archived, created_at, updated_at) {
    this.id = id;
    this.name = name;
    this.folder_id = folder_id;
    this.size = size;
    this.type = type;
    this.archived = archived;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getFolderId() {
    return this.folder_id;
  }

  getSize() {
    return this.size;
  }

  getType() {
    return this.type;
  }

  getIsArchived() {
    return this.archived;
  }

  getCreatedAt() {
    return this.created_at;
  }

  getUpdatedAt() {
    return this.updated_at;
  }

  /** Return object representation */
  toString() {
    return {
      id: this.id,
      name: this.name,
      folder_id: this.folder_id,
      size: this.size,
      type: this.type,
      archived: this.archived,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  /** Update one or more fields */
  update() {
    throw new Error("method needs to be implemented");
  }
}
