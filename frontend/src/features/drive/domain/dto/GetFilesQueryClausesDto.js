export class GetFilesQueryClausesDto {
  #searchTerm;
  #folderId;

  /**
   *
   * @param {string} [searchTerm]
   * @param {string} [folderId]
   */
  constructor(searchTerm, folderId) {
    this.#searchTerm = searchTerm;
    this.#folderId = folderId;
  }

  getSearchTerm() {
    return this.#searchTerm;
  }
  getFolderId() {
    return this.#folderId;
  }
}
