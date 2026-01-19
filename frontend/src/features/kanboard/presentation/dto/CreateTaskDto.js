export class CreateTaskDto {
  #title;
  #description;
  #status;
  #priority;
  #project_id;

  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {number} status
   * @param {number} priority
   * @param {string | undefined} project_id
   */
  constructor(title, description, status, priority, project_id) {
    this.#title = title;
    this.#description = description;
    this.#status = status;
    this.#priority = priority;
    this.#project_id = project_id;
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

  getProjectId() {
    return this.#project_id;
  }
}
