export class DownloadFileDto {
  #filename;

  /**
   *
   * @param {string} filename
   */
  constructor(filename) {
    this.#filename = filename;
  }

  getFilename() {
    return this.#filename;
  }

  toJson() {
    return { filename: this.#filename };
  }
}
