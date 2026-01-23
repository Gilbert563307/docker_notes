export class DeleteFileDto {
  #id;
  #filename;

  /**
   *
   * @param {string} id
   * @param {string} filename
   */
  constructor(id, filename) {
    this.#id = id;
    this.#filename = filename;
  }

  getId() {
    return this.#id;
  }

  getFilename() {
    return this.#filename;
  }
}
