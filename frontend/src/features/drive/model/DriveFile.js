export class DriveFile {
  constructor(
    id,
    name,
    folder_id,
    size,
    type,
    archived,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.name = name;
    this.folder_id = folder_id;
    this.size = size;
    this.type = type;
    this.archived = archived;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // ===== Getters =====
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
  update(data = {}) {
    Object.assign(this, data);
    // this.updated_at = new Date().toISOString();
  }
}
