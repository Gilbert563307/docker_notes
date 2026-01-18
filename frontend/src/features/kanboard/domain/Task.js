import { TASKS_PRIORITY, TASKS_STATUS } from "../../../config";
import { Assignee } from "./Assignee";
import { Reporter } from "./Reporter";

const FOUR_CHARACTERS = 4;

/**
 * Represents a Task domain entity.
 * Performs validation on creation and exposes read-only accessors.
 */
export class Task {
  /**
   * Create a Task instance.
   *
   * @param {string} id - Task unique identifier
   * @param {string} project_id - Project identifier
   * @param {string} user_uid - User unique identifier
   * @param {string} title - Task title (minimum 4 characters)
   * @param {string} description - Task description
   * @param {number} status - Task status (must be valid TASKS_STATUS)
   * @param {number} priority - Task priority (must be valid TASKS_PRIORITY)
   * @param {Assignee} assignee - Assigned user object
   * @param {Reporter} reporter - Reporting user object
   * @param {boolean} archived - Archive flag
   * @param {Date} created_at - Creation timestamp
   * @param {Date} updated_at - Last update timestamp
   *
   * @throws {Error} If validation fails
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
    this.#validate({
      project_id,
      user_uid,
      title,
      status,
      priority,
      assignee,
      reporter,
      created_at,
      updated_at,
    });

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

  /**
   * Convert task to a plain object.
   *
   * @returns {import("../../../types/types.js").Task} JSON representation of the task
   */
  toJson() {
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

  /**
   * Convert task to a plain object without the ID.
   * Useful for creation payloads.
   *
   * @returns {Object} JSON representation without ID
   */
  toJsonWithoutId() {
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

  /**
   * 
   *
   * @param {import("../../../types/types.js").Task} data 
   */
  update(data) {
    this.#validate(data);
    Object.assign(this, data);
  }

  #validate(data) {
    const { project_id, user_uid, title, status, priority, assignee, reporter, created_at, updated_at } = data;

    if (project_id == undefined || project_id === null || typeof project_id !== "number") {
      throw new Error("The project id cannot be empty");
    }

    if (!user_uid || typeof user_uid !== "string") {
      throw new Error("The user uid cannot be empty");
    }

    if (!title || typeof title !== "string") {
      throw new Error("The title cannot be empty");
    }

    if (title.length < FOUR_CHARACTERS) {
      throw new Error("The title should be more than 4 characters");
    }

    if (status === undefined || status === null|| typeof status !== "number") {
      throw new Error("The status cannot be empty");
    }

    if (!Object.values(TASKS_STATUS).includes(status)) {
      throw new Error("The status must be valid");
    }

    if (priority === undefined || priority === null || typeof priority !== "number") {
      throw new Error("The priority cannot be empty");
    }

    if (!Object.values(TASKS_PRIORITY).includes(priority)) {
      throw new Error("The priority must be valid");
    }

    if (!assignee || typeof assignee !== "object") {
      throw new Error("The assignee cannot be empty");
    }

    if (!reporter || typeof reporter !== "object") {
      throw new Error("The reporter cannot be empty");
    }

    if (!created_at || !updated_at) {
      throw new Error("The creation and update dates cannot be empty");
    }
  }
}
