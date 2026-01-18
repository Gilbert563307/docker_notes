import { AssigneeDto } from "./AssigneeDto";
import { ReporterDto } from "./RepoterDto";

export class TaskDto {
  #id;
  #project_id;
  #user_uid;
  #title;
  #description;
  #status;
  #priority;
  #assignee;
  #reporter;
  #archived;
  #created_at;
  #updated_at;

  /**
   *  @param {AssigneeDto} assignee - Assigned user object
   * @param {ReporterDto} reporter - Reporting user object
   */
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
    updated_at,
  ) {
    this.#id = id;
    this.#project_id = project_id;
    this.#user_uid = user_uid;
    this.#title = title;
    this.#description = description;
    this.#status = status;
    this.#priority = priority;
    this.#assignee = assignee;
    this.#reporter = reporter;
    this.#archived = archived;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  getId() {
    return this.#id;
  }

  getProjectId() {
    return this.#project_id;
  }

  getUserUid() {
    return this.#user_uid;
  }

  getTitle() {
    return this.#title;
  }

  getDescription() {
    return this.#description;
  }

  getStatus() {
    return this.#status;
  }

  getPriority() {
    return this.#priority;
  }

  /**
   * 
   * @returns {AssigneeDto}
   */
  getAssignee() {
    return this.#assignee;
  }

  getAssigneeName() {
    return this.#assignee.getName();
  }

  getReporterName() {
    return this.#reporter.getName();
  }

   /**
   * 
   * @returns {ReporterDto}
   */
  getReporter() {
    return this.#reporter;
  }

  getIsArchived() {
    return this.#archived;
  }

  getCreatedAt() {
    return this.#created_at.toLocaleString();
  }

  getUpdatedAt() {
    return this.#updated_at.toLocaleString();
  }

  /**
   * Convert task to a plain object.
   *
   * @returns {import("../../../../types/types.js").Task} JSON representation of the task
   */
  toJson() {
    return {
      id: this.#id,
      project_id: this.#project_id,
      user_uid: this.#user_uid,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      assignee: this.#assignee.toJson(),
      reporter: this.#reporter.toJson(),
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
