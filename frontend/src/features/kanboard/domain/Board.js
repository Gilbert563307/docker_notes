export class Board {
  constructor(
    id,
    user_uid,
    name,
    color,
    archived,
    collaborative,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.user_uid = user_uid;
    this.name = name;
    this.color = color;
    this.archived = archived;
    this.collaborative = collaborative;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // ===== Getters =====
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

  getIsCollaborative() {
    return this.collaborative;
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
      collaborative: this.collaborative,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  toCreateObject(){
    return {
      user_uid: this.user_uid,
      name: this.name,
      color: this.color,
      archived: this.archived,
      collaborative: this.collaborative,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  /** Update one or more fields */
  update(data = {}) {
    Object.assign(this, data);
  }
}
