export class Folder {
  constructor(id, user_uid, name, color, archived, created_at, updated_at) {
    this.id = id;
    this.user_uid = user_uid;
    this.name = name;
    this.color = color;
    this.archived = archived;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  getId() {
    return this.id;
  }

  getUserUid() {
    return this.user_uid;
  }

  getName() {
    return this.name;
  }

  getColor() {
    return this.color;
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
      user_uid: this.user_uid,
      name: this.name,
      color: this.color,
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
