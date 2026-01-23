export class UploadFilesDto {
  #files;
  #folderId;

  /**
   *
   * @param {Array<File>} files
   * @param {string} folderId
   */
  constructor(files, folderId) {
    this.#files = files;
    this.#folderId = folderId;
  }

  getFiles() {
    return this.#files;
  }

  getFolderId() {
    return this.#folderId;
  }
}
