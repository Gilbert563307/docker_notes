export class ListFilesDto {
  #currentPage;
  #itemsPerPage;
  #searchTerm;
  #folderId;

  /**
   *
   * @param {number} currentPage
   * @param {number} [itemsPerPage]
   * @param {string} [searchTerm]
   * @param {string} [folderId]
   */
  constructor(currentPage, itemsPerPage, searchTerm, folderId) {
    //validate
    if (currentPage === null || currentPage === undefined) {
      throw new Error("Current page is missing");
    }

    this.#currentPage = currentPage;
    this.#itemsPerPage = itemsPerPage;
    this.#searchTerm = searchTerm;
    this.#folderId = folderId;
  }

  getCurrentPage() {
    return this.#currentPage;
  }

  getItemsPerPage() {
    return this.#itemsPerPage;
  }

  getSearchTerm() {
    return this.#searchTerm;
  }

  getFolderId() {
    return this.#folderId;
  }
}
