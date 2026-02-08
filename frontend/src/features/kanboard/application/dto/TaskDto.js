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

  //TODO FIND OUT ABOUT THESE TYPES created_at updated_at
  /**
   * @param {string} id - The unique identifier for the task.
   * @param {string} project_id - The unique identifier for the project.
   * @param {string} user_uid - The unique identifier for the user.
   * @param {string} title - The title of the task.
   * @param {string} description - The description of the task.
   * @param {number} status - The status of the task.
   * @param {number} priority - The priority level of the task.
   * @param {AssigneeDto} assignee - The assignee of the task with name and unique identifier.
   * @param {ReporterDto} reporter - The reporter of the task with name and unique identifier.
   * @param {Boolean} archived - The archived status.
   * @param {Date | string} created_at - The timestamp when the task was created.
   * @param {Date | string} updated_at - The timestamp when the task was last updated.
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

  getAssigneeId() {
    return this.#assignee.getAssigneeId();
  }

  getReporterId() {
    return this.#reporter.getAssigneeId();
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
    return this.#created_at;
  }

  getUpdatedAt() {
    return this.#updated_at;
  }

  /**
   *
   * @returns {string}
   */
  getUserLocaleCreatedAt() {
    if (!this.#created_at) return "";
    return this.#created_at.toDate().toLocaleString();
  }

  /**
   *
   * @returns {string}
   */
  getUserLocaleUpdatedAt() {
    if (!this.#updated_at) return "";
    return this.#updated_at.toDate().toLocaleString();
  }

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
