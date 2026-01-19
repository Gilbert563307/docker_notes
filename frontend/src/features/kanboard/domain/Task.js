import { TASKS_PRIORITY, TASKS_STATUS } from "../../../config";
import { Assignee } from "./Assignee";
import { Reporter } from "./Reporter";

const FOUR_CHARACTERS = 4;

export class Task {
  // ===== Private fields =====
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
      id,
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

  // ===== Getters =====
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
  getAssignee() {
    return this.#assignee;
  }
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

  toJson() {
    return {
      id: this.#id,
      project_id: this.#project_id,
      user_uid: this.#user_uid,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      assignee: this.#assignee,
      reporter: this.#reporter,
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  toJsonWithoutId() {
    return {
      project_id: this.#project_id,
      user_uid: this.#user_uid,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      assignee: this.#assignee,
      reporter: this.#reporter,
      archived: this.#archived,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

  /**
   * LEFT AS-IS (behavior preserved)
   */
  update(data) {
    this.#validate(data);

    if ("id" in data) this.#id = data.id;
    if ("project_id" in data) this.#project_id = data.project_id;
    if ("user_uid" in data) this.#user_uid = data.user_uid;
    if ("title" in data) this.#title = data.title;
    if ("description" in data) this.#description = data.description;
    if ("status" in data) this.#status = data.status;
    if ("priority" in data) this.#priority = data.priority;
    if ("assignee" in data) this.#assignee = data.assignee;
    if ("reporter" in data) this.#reporter = data.reporter;
    if ("archived" in data) this.#archived = data.archived;
    if ("created_at" in data) this.#created_at = data.created_at;
    if ("updated_at" in data) this.#updated_at = data.updated_at;
  }

  #validate(data) {
    const { id, project_id, user_uid, title, status, priority, assignee, reporter, created_at, updated_at } = data;

    if (id == null || typeof id !== "string") {
      throw new Error("Something went wrong while identifying this task. Please try again.");
    }

    if (project_id === undefined || typeof project_id !== "string") {
      throw new Error("The project information is missing or invalid. Please select a valid project.");
    }

    if (!user_uid || typeof user_uid !== "string") {
      throw new Error("We couldn’t identify the user. Please sign in again and try.");
    }

    if (!title || typeof title !== "string") {
      throw new Error("Please enter a title for the task.");
    }

    if (title.length < FOUR_CHARACTERS) {
      throw new Error(`The task title must be at least ${FOUR_CHARACTERS} characters long.`);
    }

    if (status == null || typeof status !== "number") {
      throw new Error("Please select a valid task status.");
    }

    if (!Object.values(TASKS_STATUS).includes(status)) {
      throw new Error("The selected task status is not supported.");
    }

    if (priority == null || typeof priority !== "number") {
      throw new Error("Please select a priority for the task.");
    }

    if (!Object.values(TASKS_PRIORITY).includes(priority)) {
      throw new Error("The selected priority is not supported.");
    }

    if (!assignee || typeof assignee !== "object") {
      throw new Error("Please assign this task to a user.");
    }

    if (!reporter || typeof reporter !== "object") {
      throw new Error("The reporter information is missing. Please try again.");
    }

    if (!created_at || !updated_at) {
      throw new Error("We couldn’t determine when this task was created or updated. Please try again.");
    }
  }
}
