export class GetFoldersQueryClauses {
  #searchTerm;

  /**
   *
   * @param {string} [searchTerm]
   */
  constructor(searchTerm) {
    this.#searchTerm = searchTerm;
  }

  getSearchTerm() {
    return this.#searchTerm;
  }
}
