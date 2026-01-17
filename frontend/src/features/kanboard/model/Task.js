export class Task {
  constructor(
    id,
    project_id,
    user_uid,
    title,
    description,
    status,
    priority,
    assignee,
    reporter,
    archived,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.project_id = project_id;
    this.user_uid = user_uid;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.assignee = assignee;
    this.reporter = reporter;
    this.archived = archived;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // ===== Getters =====
  getId() {
    return this.id;
  }

  getProjectId() {
   return this.project_id;
  }

  getUserUid() {
    return this.user_uid;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getStatus() {
    return this.status;
  }

  getPriority() {
    return this.priority;
  }

  getAssignee() {
    return this.assignee;
  }

  getReporter() {
    return this.reporter;
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
      project_id: this.project_id,
      user_uid: this.user_uid,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assignee: this.assignee,
      reporter: this.reporter,
      archived: this.archived,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

   toCreateObject(){
    return {
      project_id: this.getProjectId(),
      user_uid: this.getUserUid(),
      title: this.getTitle(),
      description: this.getDescription(),
      status: this.getStatus(),
      priority: this.getPriority(),
      assignee: this.getAssignee(),
      reporter: this.getReporter(),
      archived: this.getIsArchived(),
      created_at: this.getCreatedAt(),
      updated_at: this.getUpdatedAt(),
    };
   }

  /** Update one or more fields */
  update(data = {}) {
    Object.assign(this, data);
  }
}
