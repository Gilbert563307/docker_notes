export class ArchiveFileDto {
  #id;
  #archived;

  /**
   *
   * @param {string} id
   * @param {boolean} archived
   */
  constructor(id, archived) {
    this.#id = id;
    this.#archived = archived;
  }

  getId() {
    return this.#id;
  }

  getArchived() {
    return this.#archived;
  }
}
